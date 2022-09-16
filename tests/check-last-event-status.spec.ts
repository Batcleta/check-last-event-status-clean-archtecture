import { set, reset } from 'mockdate'

interface ILoadLastEventRepository {
  loadLastEvent: (input: { groupId: string }) => Promise<{endDate: Date} | undefined>
}

class LoadLastEventRepositorySpy implements ILoadLastEventRepository {
  public groupId?: string
  public callsCount = 0
  public output?: { endDate: Date }

  async loadLastEvent ({ groupId }: {groupId: string}): Promise<{endDate: Date} | undefined> {
    this.groupId = groupId
    this.callsCount++

    return this.output
  };
}

class CheckLastEventStatus {
  constructor (
    private readonly loadLastEventRepository: ILoadLastEventRepository
  ) {} // type class

  async exec ({ groupId }: {groupId: string}): Promise<string> {
    if (groupId !== null && groupId !== undefined) {
      const response = await this.loadLastEventRepository.loadLastEvent({ groupId })
      const currentDate: Date = new Date()
      const timeDifference: number = (response?.endDate.getTime() - currentDate.getTime()) * -1

      if (response !== undefined) {
        if (currentDate < response.endDate) return 'active'
        if (currentDate > response.endDate && timeDifference <= 10) return 'inReview'
      }

      return 'done'
    }
  }
}

interface sutOutput {
  sut: CheckLastEventStatus
  loadLastEventRepository: LoadLastEventRepositorySpy
}

const makeSut = (): sutOutput => {
  const loadLastEventRepository = new LoadLastEventRepositorySpy()
  const sut = new CheckLastEventStatus(loadLastEventRepository)
  return { sut, loadLastEventRepository }
}

describe('CheckLastEventStatus', () => {
  const groupId = 'any_group_id'

  beforeAll(() => set(new Date())) // congelar data
  afterAll(() => reset())
  it('should get last event data', async () => {
    // arrange
    const { sut, loadLastEventRepository } = makeSut()
    // Act
    await sut.exec({ groupId }) // act
    // Assert
    expect(loadLastEventRepository.groupId).toBe(groupId)
    expect(loadLastEventRepository.callsCount).toBe(1)
  })

  it('should return status done when group has no event', async () => {
    // arrange
    const { sut, loadLastEventRepository } = makeSut()
    loadLastEventRepository.output = undefined
    // act
    const status = await sut.exec({ groupId })
    // assert
    expect(status).toBe('done')
  })

  it('should return status active when the current time is lower than the event end time', async () => {
    // arrange
    const { sut, loadLastEventRepository } = makeSut()
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() + 1)
    }
    // act
    const status = await sut.exec({ groupId })
    // assert
    expect(status).toBe('active')
  })

  it('should return status inReview when the current time is tinny greater than the event end time', async () => {
    // arrange
    const { sut, loadLastEventRepository } = makeSut()
    loadLastEventRepository.output = {
      endDate: new Date(new Date().getTime() - 1)
    }
    // act
    const status = await sut.exec({ groupId })
    // assert
    expect(status).toBe('inReview')
  })
})

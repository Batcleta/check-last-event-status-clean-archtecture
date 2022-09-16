interface ILoadLastEventRepository {
  loadLastEvent: (groupId: string) => Promise<undefined>
}

class LoadLastEventRepositorySpy implements ILoadLastEventRepository {
  public groupId?: string
  public callsCount = 0
  public output: undefined

  async loadLastEvent (groupId: string): Promise<undefined> {
    this.groupId = groupId
    this.callsCount++

    return this.output
  };
}

class CheckLastEventStatus {
  constructor (
    private readonly loadLastEventRepository: ILoadLastEventRepository
  ) {} // type class

  async exec (groupId: string): Promise<string> {
    if (groupId !== null && groupId !== undefined) {
      await this.loadLastEventRepository.loadLastEvent(groupId)
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
  it('should get last event data', async () => {
    // arrange
    const { sut, loadLastEventRepository } = makeSut()
    // Act
    await sut.exec('any__group__id') // act
    // Assert
    expect(loadLastEventRepository.groupId).toBe('any__group__id')
    expect(loadLastEventRepository.callsCount).toBe(1)
  })

  it('should return status done when group has no event', async () => {
    // arrange
    const { sut, loadLastEventRepository } = makeSut()
    loadLastEventRepository.output = undefined
    // act
    const status = await sut.exec('any__group__id')
    // assert
    expect(status).toBe('done')
  })
})

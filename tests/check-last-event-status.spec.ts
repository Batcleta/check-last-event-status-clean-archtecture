interface ILoadLastEventRepository {
  loadLastEvent(groupId: string):Promise<void>;
}

class LoadLastEventRepositoryMock implements ILoadLastEventRepository{
  public groupId?: string;
  callsCount = 0

  async loadLastEvent(groupId: string):Promise<void> {
     this.groupId = groupId
     this.callsCount ++
  };
}

class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: ILoadLastEventRepository
  ) {} //type class

  async exec(groupId: string): Promise<void> {
    this.loadLastEventRepository.loadLastEvent(groupId);
  }
}

const makeSut = () => {
  const loadLastEventRepository = new LoadLastEventRepositoryMock();
  const sut = new CheckLastEventStatus(
    loadLastEventRepository

  ); 

  return {sut, loadLastEventRepository}
}

describe("CheckLastEventStatus", () => {
  it("should get last event data", async () => {
    const {sut, loadLastEventRepository} = makeSut() //arrange

    await sut.exec("any__group__id"); //act

    expect(loadLastEventRepository.groupId).toBe("any__group__id"); //assert
    expect(loadLastEventRepository.callsCount).toBe(1); //assert
  });
});

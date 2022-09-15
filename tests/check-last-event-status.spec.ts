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

describe("CheckLastEventStatus", () => {
  it("should get last event data", async () => {
    const loadLastEventRepository = new LoadLastEventRepositoryMock();
    const checkLastEventStatus = new CheckLastEventStatus(
      loadLastEventRepository
    ); //arrange

    await checkLastEventStatus.exec("any__group__id"); //act

    expect(loadLastEventRepository.groupId).toBe("any__group__id"); //assert
    expect(loadLastEventRepository.callsCount).toBe(1); //assert
  });
});

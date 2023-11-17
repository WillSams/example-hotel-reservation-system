const { db } = require("../../../src/api/utils");
const { Room } = require("../../../src/api/models");
const { availableRooms } = require("../../../src/api/resolvers/queries");

jest.mock("../../../src/api/utils");
jest.mock("../../../src/api/models");

describe("availableRooms", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return available rooms for valid request", async () => {
    const requestSchema = { startDate: "2023-04-01", endDate: "2023-04-10" };
    const mockData = { rows: [{ id: 1, name: "Room 101" }] };
    const dbRawMock = jest.fn().mockResolvedValue(mockData);
    const schemaMock = jest.fn().mockReturnValue(mockData.rows);

    db.mockReturnValue({ raw: dbRawMock });
    Room.queryByAvailable.mockReturnValue("mockQuery");
    Room.schema.mockReturnValue(schemaMock);

    const result = await availableRooms(null, requestSchema);

    expect(Room.queryByAvailable).toHaveBeenCalledWith(requestSchema);
    expect(db).toHaveBeenCalled();
    expect(dbRawMock).toHaveBeenCalledWith("mockQuery");
    expect(Room.schema).toHaveBeenCalledWith(mockData);
  });

  it("should throw an error when the database query fails", async () => {
    const requestSchema = { startDate: "2023-04-01", endDate: "2023-04-10" };
    const error = new Error("Database error");
    const dbRawMock = jest.fn().mockRejectedValue(error);
    db.mockReturnValue({ raw: dbRawMock });
    Room.queryByAvailable.mockReturnValue("mockQuery");

    await expect(availableRooms(null, requestSchema)).rejects.toThrow(error);
  });
});

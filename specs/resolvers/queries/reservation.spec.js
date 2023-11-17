const { db } = require("../../../src/api/utils");
const { Reservation } = require("../../../src/api/models");
const { reservation } = require("../../../src/api/resolvers/queries");

jest.mock("../../../src/api/utils");
jest.mock("../../../src/api/models");

describe("reservation query resolver", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve a reservation for valid input", async () => {
    // Arrange
    const roomId = 1;
    const checkinDate = "2023-04-01";
    const checkoutDate = "2023-04-10";
    const expectedRawData = [{ id: 1, roomId, checkinDate, checkoutDate }];
    const expectedReservation = { id: 1, roomId, checkinDate, checkoutDate };
    const dbRawMock = jest.fn().mockResolvedValue({ rows: expectedRawData });
    const schemaMock = jest.fn().mockReturnValue([expectedReservation]);
    db.mockReturnValue({ raw: dbRawMock });
    Reservation.schema.mockReturnValue(schemaMock);

    const result = await reservation(null, {
      roomId,
      checkinDate,
      checkoutDate,
    });

    expect(db).toHaveBeenCalled();
    expect(dbRawMock).toHaveBeenCalledWith(Reservation.get(), [
      roomId,
      checkinDate,
      checkoutDate,
    ]);
    expect(Reservation.schema).toHaveBeenCalledWith({ rows: expectedRawData });
  });

  it("should throw an error when db operation fails", async () => {
    // Arrange
    const roomId = 3;
    const checkinDate = "2023-05-01";
    const checkoutDate = "2023-05-10";
    const error = new Error("Database error");
    const dbRawMock = jest.fn().mockRejectedValue(error);
    db.mockReturnValue({ raw: dbRawMock });

    await expect(
      reservation(null, { roomId, checkinDate, checkoutDate })
    ).rejects.toThrow(error);
  });

  it("should handle invalid date formats", async () => {
    // Arrange
    const roomId = 4;
    const checkinDate = "invalid-date";
    const checkoutDate = "2023-05-15";
    const error = new Error("Invalid date format");
    const dbRawMock = jest.fn().mockRejectedValue(error);
    db.mockReturnValue({ raw: dbRawMock });

    await expect(
      reservation(null, { roomId, checkinDate, checkoutDate })
    ).rejects.toThrow(error);
  });
});

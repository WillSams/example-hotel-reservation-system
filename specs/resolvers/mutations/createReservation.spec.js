const { db } = require("../../../src/api/utils");
const { Reservation } = require("../../../src/api/models");
const { createReservation } = require("../../../src/api/resolvers/mutations");

jest.mock("../../../src/api/utils");
jest.mock("../../../src/api/models");

describe("createReservation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a reservation and return the created reservation data", async () => {
    // Arrange
    const input = {
      roomId: "1ABC234",
      checkinDate: "2020-12-31",
      checkoutDate: "2021-01-24",
      totalCharge: 500,
    };
    const expectedReservation = {
      id: 1,
      ...input,
    };
    const dbRawMock = jest.fn();
    dbRawMock
      .mockResolvedValueOnce()
      .mockResolvedValueOnce([expectedReservation]);
    db.mockReturnValue({ raw: dbRawMock });

    // Act
    await createReservation(null, { input });

    // Assert
    expect(db).toHaveBeenCalledTimes(2);
    expect(dbRawMock).toHaveBeenCalledWith(
      Reservation.create(),
      expect.arrayContaining([
        input.roomId,
        input.checkinDate,
        input.checkoutDate,
        input.totalCharge,
      ])
    );
    expect(dbRawMock).toHaveBeenCalledWith(
      Reservation.get(),
      expect.arrayContaining([
        input.roomId,
        input.checkinDate,
        input.checkoutDate,
      ])
    );
  });

  it("should handle the case when the reservation creation fails", async () => {
    // Arrange
    const input = {
      roomId: 2,
      checkinDate: "2023-05-01",
      checkoutDate: "2023-05-05",
      totalCharge: 300,
    };
    const error = new Error("Creation failed");
    const dbRawMock = jest.fn().mockRejectedValueOnce(error);
    db.mockReturnValue({ raw: dbRawMock });

    // Act & Assert
    await expect(createReservation(null, { input })).rejects.toThrow(error);
  });

  it("should handle the case when fetching the created reservation fails", async () => {
    // Arrange
    const input = {
      roomId: 3,
      checkinDate: "2023-06-01",
      checkoutDate: "2023-06-10",
      totalCharge: 800,
    };
    const error = new Error("Fetch failed");
    const dbRawMock = jest.fn();
    dbRawMock.mockResolvedValueOnce().mockRejectedValueOnce(error);
    db.mockReturnValue({ raw: dbRawMock });

    // Act & Assert
    await expect(createReservation(null, { input })).rejects.toThrow(error);
  });
});

const { db } = require("../../../src/api/utils");
const { Reservation } = require("../../../src/api/models");
const { reservations } = require("../../../src/api/resolvers/queries");

jest.mock("../../../src/api/utils");
jest.mock("../../../src/api/models");

describe("reservations query resolver", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all reservations", async () => {
    const mockData = {
      rows: [
        {
          id: 1,
          roomId: 1,
          checkinDate: "2023-04-01",
          checkoutDate: "2023-04-10",
        },
      ],
    };
    const dbRawMock = jest.fn().mockResolvedValue(mockData);
    const schemaMock = jest.fn().mockReturnValue(mockData.rows);
    db.mockReturnValue({ raw: dbRawMock });
    Reservation.schema.mockReturnValue(schemaMock);

    const result = await reservations(null, {});

    expect(db).toHaveBeenCalled();
    expect(dbRawMock).toHaveBeenCalledWith(Reservation.queryAll());
    expect(Reservation.schema).toHaveBeenCalledWith(mockData);
  });

  it("should throw an error if the database query fails", async () => {
    const error = new Error("Database error");
    const dbRawMock = jest.fn().mockRejectedValue(error);
    db.mockReturnValue({ raw: dbRawMock });

    await expect(reservations(null, {})).rejects.toThrow(error);
  });
});

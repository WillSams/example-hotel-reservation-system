const mutations = require("../src/api/resolvers/mutations");
const queries = require("../src/api/resolvers/queries");

jest.mock("../src/api/utils", () => {
  return {
    db: () => {
      return {
        raw: jest.fn(),
      };
    },
  };
});

describe("Specs", () => {
  describe("When a room is reserved", () => {
    it("it cannot be reserved by another guest on overlapping dates", async () => {
      // Reserve a room for some dates
      const input = {
        roomId: "1",
        checkinDate: "2023-03-01",
        checkoutDate: "2023-03-05",
        totalCharge: 500,
      };
      await mutations.createReservation(null, { input });

      // Mock the database query methods to return the same data again
      db.raw.mockReturnValueOnce(Promise.resolve([{ id: 1 }]));

      // Try to reserve the same room for overlapping dates
      const overlappingInput = {
        roomId: "1",
        checkinDate: "2023-03-03",
        checkoutDate: "2023-03-06",
        totalCharge: 600,
      };
      await expect(
        mutations.createReservation(null, { input: overlappingInput })
      ).rejects.toThrow();
    });
  });

  describe("When there are multiple available rooms for a request", () => {
    it("the room with the lower final price is assigned", async () => {});
  });

  describe("When a request is made for a single room", () => {
    it("a double bed room may be assigned (if no single is available?", async () => {});

    it("Smokers are not placed in non-smoking rooms", async () => {});
    it("Non-smokers are not placed in allowed smoking rooms", async () => {});

    it("Final price for reservations are determined by daily price * num of days requested, plus the cleaning fee", async () => {});
  });
});

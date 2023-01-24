const { PromisePool } = require('@supercharge/promise-pool');

const { jsonReader } = require('./utils');

const Mutation = require('./mutations');
const Query = require('./queries');

const process_requests = () => {
  let reservationRequests = null;
  jsonReader(`${__dirname}/requests.json`, (error, requests) => {
    try {
      if (error) throw error;
      else reservationRequests = requests;
    } catch (ex) {
      console.log(`Json file read failed: ${ex.message}`);
    }
  }).then(async () => {
    // Note:  we can refactor the api to handle bulk inserts and de-couple
    // the records creation from this promise pool.  However, this scenario would
    // still need to call the availableRooms GraphQL query O(N).
    await PromisePool.for(reservationRequests)
      .withConcurrency(1)
      .process(async (request, index, pool) => {
        const avaliableRoomsVars = {
          startDate: request?.checkin_date,
          endDate: request?.checkout_date,
          allowSmoking: request?.is_smoker,
          numBeds: request?.min_beds,
        };

        await Query.getAvailableRooms(avaliableRoomsVars)
          .then((rooms) => {
            const room = rooms.length > 0 ? rooms[0] : {};

            if (room?.Id) {
              return {
                roomId: room?.Id,
                checkinDate: request?.checkin_date,
                checkoutDate: request?.checkout_date,
                totalCharge: room?.TotalCharge,
              };
            }
          })
          .then((data) =>
            Mutation.createReservation(data).then(
              (data) => data?.createReservation
            )
          )
          .then((room) => {
            console.log(
              `Hotel X - Reservation request processed.  Room:  ${room.RoomId}`
            );
          });
      });
  });
};

process_requests();

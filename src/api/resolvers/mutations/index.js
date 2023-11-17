const { db } = require('../../utils');
const { Reservation } = require('../../models');
const { relayStylePagination } = require('@apollo/client/utilities');

const createReservation = (root, { input }) => {
  const inserts = [input.roomId, input.checkinDate, input.checkoutDate];

  return db()
    .raw(Reservation.create(), [...inserts, input.totalCharge])
    .then(() => {
      return db()
        .raw(Reservation.get(), inserts)
        .then((data) => {
          const reservationArray = Reservation.schema(data);
          if (!reservationArray || reservationArray?.length === 0) {
            return Reservation.schema(data[0]);
          } else {
            return Reservation.schema(data)[0];
          }
        });
    });
};

module.exports = {
  createReservation,
};

const { db } = require('../../utils');
const { Reservation } = require('../../models');

const createReservation = (root, { input }) => {
  const inserts = [
    input.roomId,
    input.checkinDate,
    input.checkoutDate,
  ];

  return db().raw(Reservation.create(), [...inserts, input.totalCharge]).then(() => {
    return db().raw(Reservation.get(), inserts).then(async data => Reservation.schema(data)[0]);
  });
};

module.exports = {
  createReservation,
};
const { defaultDate, db } = require('../../utils');
const { Reservation, Room } = require('../../models');

const requestSchema = {
	startDate: defaultDate,
	endDate: defaultDate,
	numBeds: 1,
	allowSmoking: false
};

const availableRooms = (root, requestSchema) =>
	db().raw(Room.queryByAvailable({ ...requestSchema }))
		.then(data => Room.schema(data));

const reservation = (root, { roomId, checkinDate, checkoutDate }) =>
	db().raw(Reservation.get(), [roomId, checkinDate, checkoutDate])
		.then(data => Reservation.schema(data)[0]);

const reservations = (root, { }) =>
	db().raw(Reservation.queryAll())
		.then(data => Reservation.schema(data));

module.exports = {
	availableRooms,
	reservation,
	reservations,
};
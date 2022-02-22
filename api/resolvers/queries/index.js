const { defaultDate, db } = require('../../utils');
const { Reservation, Room } = require('../../models');

const requestSchema = {
	startDate: defaultDate,
	endDate: defaultDate,
	numBeds: 1,
	allowSmoking: false
};

const availableRooms = async (root, requestSchema) =>
	await db()
		.raw(Room.queryByAvailable({ ...requestSchema }))
		.then(data => Room.schema(data));

const reservation = async (root, { roomId, checkinDate, checkoutDate }) =>
	await db()
		.raw(Reservation.get(), [roomId, checkinDate, checkoutDate])
		.then(data => Reservation.schema(data)[0]);

const reservations = async (root, { }) =>
	await db()
		.raw(Reservation.queryAll())
		.then(data => Reservation.schema(data));

module.exports = {
	availableRooms,
	reservation,
	reservations,
};
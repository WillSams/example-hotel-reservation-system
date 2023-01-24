exports.create = () =>
  'insert into \
    reservations (room_id, checkin_date, checkout_date, total_charge) \
    values (?, ?, ?, ?)';

exports.get = () =>
  'select id, room_id, checkin_date, checkout_date, total_charge \
  from reservations \
  where room_id = ? and checkin_date = ? and checkout_date = ? \
  order by 1';

exports.queryAll = () => 'select * from reservations';

exports.schema = items => {
  const results = [];
  items.rows.map(item => {
    results.push({
      Id: item.id,
      RoomId: item.room_id,
      CheckinDate: item.checkin_date,
      CheckoutDate: item.checkout_date,
      TotalCharge: item.total_charge,
    });
  });
  return results;
};
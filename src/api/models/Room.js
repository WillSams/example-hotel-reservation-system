const { daysBetween } = require('../utils');

exports.queryByAvailable = ({ startDate, endDate, numBeds, allowSmoking }) => {
  const numDays = daysBetween(startDate, endDate);
  // Return rooms in order of total final price.  Lowest will be available to reserve first.
  return `
  select distinct ro.id, ro.num_beds, ro.allow_smoking, ro.daily_rate, ro.cleaning_fee,
    ((ro.daily_rate * ${numDays}) + ro.cleaning_fee) as total_charge
  from rooms as ro
  where ro.allow_smoking = ${allowSmoking}
    and ro.num_beds >= ${numBeds}
	  and ro.id not in (
      select room_id 
      from reservations 
      where '${endDate}' between checkin_date and checkout_date
        and '${startDate}'  between checkin_date and checkout_date
    )
  order by 6, 2`;
};

exports.schema = items => {
  const results = [];
  items.rows.map(item => results.push({
    Id: item.id,
    NumBeds: item.num_beds,
    AllowSmoking: item.allow_smoking,
    DailyRate: item.daily_rate,
    CleaningFee: item.cleaning_fee,
    TotalCharge: item.total_charge,
  }));
  return results;
};
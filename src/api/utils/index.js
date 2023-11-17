const moment = require('moment');

const knex = require('knex');
const knexfile = require('../../../knexfile');

const env = process.env.NODE_ENV || 'development';
const defaultDate = moment(new Date()).format('YYYY-MM-DD');

const db = () => knex(env === 'test' ? knexfile.test : knexfile.development);

const daysBetween = (startDateStr, endDateStr) => {
  const startDate = moment(startDateStr, 'YYYY-MM-DD');
  const endDate = moment(endDateStr, 'YYYY-MM-DD');
  return moment.duration(endDate.diff(startDate)).asDays();
};

module.exports = {
  daysBetween,
  defaultDate,
  db,
};

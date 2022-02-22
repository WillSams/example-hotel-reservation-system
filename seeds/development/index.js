const { jsonReader } = require('../../client/utils');

const seedData = async (knex, tableName) => {
  await knex(tableName).del().then(async () => {
    let inserts = [];
    await jsonReader(`${__dirname}/${tableName}.json`, (error, data) => {
      try {
        if (error) throw error; else inserts = data;
      } catch (ex) { console.log(`Json file read failed: ${ex.message}`); };
    });
    return await knex(`${tableName}`).insert(inserts);
  });
};

exports.seed = async knex => {
  await seedData(knex, 'rooms');
  await seedData(knex, 'reservations');
};
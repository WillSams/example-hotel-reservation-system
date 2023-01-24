const { jsonReader, seedData } = require("../../src/client/utils");

const injectTables = async (knex, tableName) => {
  await jsonReader(`./seeds/development/${tableName}.json`, (error, data) => {
    try {
      if (error) throw error;
      else inserts = data;
    } catch (ex) {
      console.log(`Json file read failed: ${ex.message}`);
    }
  });
  await seedData(knex, tableName, inserts);
};

exports.seed = async (knex) => {
  await injectTables(knex, "rooms");
  await injectTables(knex, "reservations");
};

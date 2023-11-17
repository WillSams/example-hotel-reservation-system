const { readFile } = require('fs');

const fetch = require('cross-fetch');

const {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require('@apollo/client/core');

const graphqlClient = new ApolloClient({
  link: new HttpLink({
    uri: `http://localhost:${process.env.API_PORT}/graphql`,
    fetch,
  }),
  cache: new InMemoryCache(),
});

const logError = (prefix, message, data) => {
  const errorMsg = `${prefix}:  ${message || ''}`;
  console.log(errorMsg);
};

const queryRequest = (query, variables = {}) =>
  graphqlClient
    .query({ query, variables })
    .then((response) => response.data)
    .catch((response) => {
      logError('GraphQL query failed', response.message);
      return response.data;
    });

const mutationRequest = (mutation, variables = {}) =>
  graphqlClient
    .mutate({ mutation, variables })
    .then((response) => response.data)
    .catch((response) => {
      logError('GraphQL query failed', response.message);
      return response.data;
    });

const jsonReader = (filepath, callback) => {
  return new Promise((resolve, reject) => {
    readFile(filepath, (error, data) => {
      if (error) reject(error);
      else {
        const obj = JSON.parse(data);
        callback(null, obj);
        resolve();
      }
    });
  });
};

const seedData = async (knex, tableName, data) => {
  await knex(tableName).del();
  return await knex(tableName).insert(data);
};

module.exports = {
  mutationRequest,
  queryRequest,
  jsonReader,
  seedData,
};

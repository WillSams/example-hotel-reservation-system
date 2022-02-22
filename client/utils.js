const { readFile } = require('fs');

const fetch = require('cross-fetch');

const { ApolloClient, HttpLink, InMemoryCache, } = require('@apollo/client/core');

const graphqlClient = new ApolloClient({
  link: new HttpLink({
    uri: `http://localhost:${process.env.API_PORT}/graphql`,
    fetch,
  }),
  cache: new InMemoryCache(),
});

const createError = (prefix, message) => {
  const errorMsg = `${prefix}:  ${message || ''}`;
  console.log(errorMsg);
  throw new Error(errorMsg);
};

const queryRequest = (query, variables = {}) =>
  graphqlClient.query({ query, variables })
    .then(response => response.data)
    .catch(response => createError('GraphQL query failed', response.message));

const mutationRequest = (mutation, variables = {}) =>
  graphqlClient.mutate({ mutation, variables })
    .then(response => response.data)
    .catch(response => createError('GraphQL mutation failed', response.message));

const jsonReader = (filepath, callback) => {
  return new Promise((resolve, reject) => {
    readFile(filepath, (error, data) => {
      if (error) reject(error);
      else {
        const obj = JSON.parse(data);
        callback(null, obj);
        resolve();
      };
    });
  });
};

module.exports = {
  mutationRequest,
  queryRequest,
  jsonReader,
};

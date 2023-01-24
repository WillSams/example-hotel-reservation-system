const {
  ApolloServer,
  ApolloServerPluginStopHapiServer,
} = require('apollo-server-hapi');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const gqlServer = async (app) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginStopHapiServer({ hapiServer: app })],
  });

  await server.start();
  await server.applyMiddleware({ app });
};

module.exports = gqlServer;

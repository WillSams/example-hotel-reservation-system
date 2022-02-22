const Hapi = require('@hapi/hapi');

// Now let's create our api
const gqlServer = require('./gqlServer');
const port = process.env.API_PORT;
const app = Hapi.server({ port });
gqlServer(app);

module.exports = (async () => await app.start().then(() => {
    console.log(`🚀  Hotel X - GraphQL API ready at localhost:${port}/graphql `);
}).catch(ex => console.log(ex)))();


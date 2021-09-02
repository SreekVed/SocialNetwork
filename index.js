const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");

const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

async function startServer() {
  const PORT = process.env.PORT || 5000;

  const app = express();

  app.use(express.static("client/build"));

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await mongoose.connect(MONGODB, { useNewUrlParser: true })

  await server.start()

  server.applyMiddleware({ app });

  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

startServer();

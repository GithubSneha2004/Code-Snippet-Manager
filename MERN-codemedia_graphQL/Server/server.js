const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  try {
    // Start Apollo Server
    await server.start();
    server.applyMiddleware({ app });

    // Attempt to open the database connection
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });

  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }

  // Error handling if database connection fails
  db.on('error', (err) => {
    console.error('Database connection error:', err);
  });
};

startApolloServer();

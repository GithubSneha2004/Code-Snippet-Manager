// 


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

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all route to serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

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

    // Catch-all route to serve React's index.html for unmatched routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

    // Wait for DB and then start server
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });

  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }

  db.on('error', (err) => {
    console.error('Database connection error:', err);
  });
};


  startApolloServer();



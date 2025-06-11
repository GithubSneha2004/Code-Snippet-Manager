require('dotenv').config();
const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');

const {
  graphqlRequestCounter,
  resolverCounter,
  errorCounter,
  register // ✅ Reuse this, do NOT redefine
} = require('./metrics');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));

// ✅ Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    console.error('Metrics error:', err); // 
    res.status(500).end(err);
  }
});

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      graphqlRequestCounter.inc(); // ✅ Count every GraphQL request
      return authMiddleware({ req });
    }
  });

  try {
    await server.start();
    server.applyMiddleware({ app });

    // ✅ React fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

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

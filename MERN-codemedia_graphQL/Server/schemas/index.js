// schemas/index.js
// Combines all typeDefs and resolvers for Apollo Server

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Export both individually and together for flexibility
module.exports = {
  typeDefs,
  resolvers,
};

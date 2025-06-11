// metrics.js
const client = require('prom-client');

// ✅ Create central register
const register = new client.Registry();

// ✅ Collect default system metrics
client.collectDefaultMetrics({ register });

// ✅ Custom counters
const graphqlRequestCounter = new client.Counter({
  name: 'graphql_requests_total',
  help: 'Total number of GraphQL requests',
});

const resolverCounter = new client.Counter({
  name: 'graphql_resolver_requests_total',
  help: 'Number of times each GraphQL resolver was called',
  labelNames: ['resolver'],
});

const errorCounter = new client.Counter({
  name: 'graphql_resolver_errors_total',
  help: 'Total number of resolver errors',
  labelNames: ['resolver', 'error_type'],
});

// ✅ Register all custom metrics
register.registerMetric(graphqlRequestCounter);
register.registerMetric(resolverCounter);
register.registerMetric(errorCounter);

// ✅ Export everything
module.exports = {
  register,
  graphqlRequestCounter,
  resolverCounter,
  errorCounter
};

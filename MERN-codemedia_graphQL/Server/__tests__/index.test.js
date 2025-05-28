// __tests__/modelsIndex.test.js

jest.mock('../models/User', () => ({
  modelName: 'User'
}));

jest.mock('../models/Snippet', () => ({
  modelName: 'Snippet'
}));

describe('Models Index File', () => {
  it('should export User and Snippet models correctly', () => {
    const models = require('../models');

    expect(models).toHaveProperty('User');
    expect(models).toHaveProperty('Snippet');

    expect(models.User.modelName).toBe('User');
    expect(models.Snippet.modelName).toBe('Snippet');
  });
});

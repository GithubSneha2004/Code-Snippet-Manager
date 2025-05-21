// __tests__/Snippet.test.js
const Snippet = require('../models/Snippet');

describe('Snippet Model', () => {
  it('should create a snippet with expected values', () => {
    const snippet = new Snippet({
      title: 'Sample Snippet',
      code: 'console.log("Hello World");',
      language: 'JavaScript',
    });

    expect(snippet.title).toBe('Sample Snippet');
    expect(snippet.code).toBe('console.log("Hello World");');
    expect(snippet.language).toBe('JavaScript');
    expect(snippet.description).toBeUndefined(); // or remove if not needed
  });
});

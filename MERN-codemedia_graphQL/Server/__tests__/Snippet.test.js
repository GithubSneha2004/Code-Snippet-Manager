const mongoose = require('mongoose');
const Snippet = require('../models/Snippet');

describe('Snippet Model', () => {
  it('should create a snippet with all fields and test virtual', () => {
    const mockObjectId = new mongoose.Types.ObjectId();

    const snippet = new Snippet({
      title: 'Sample Snippet',
      language: 'JavaScript',
      code: 'console.log("Hello World");',
      description: 'This is a sample snippet',
      createdBy: mockObjectId,
    });

    // Core field checks
    expect(snippet.title).toBe('Sample Snippet');
    expect(snippet.language).toBe('JavaScript');
    expect(snippet.code).toBe('console.log("Hello World");');
    expect(snippet.description).toBe('This is a sample snippet');
    expect(snippet.createdBy).toEqual(mockObjectId);

    // createdAt default value check
    expect(snippet.createdAt).toBeInstanceOf(Date);

    // Virtual property check
    expect(typeof snippet.createdAtFormatted).toBe('string');
    expect(snippet.createdAtFormatted).toBe(snippet.createdAt.toISOString());
  });

  it('should fail validation if required fields are missing', async () => {
    const snippet = new Snippet({}); // Missing all required fields

    try {
      await snippet.validate();
    } catch (error) {
      const err = error.errors;
      expect(err.title).toBeDefined();
      expect(err.language).toBeDefined();
      expect(err.code).toBeDefined();
      expect(err.description).toBeDefined();
      expect(err.createdBy).toBeDefined();
    }
  });
});

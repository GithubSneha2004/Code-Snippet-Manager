// __tests__/typeDefs.test.js
const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('../schemas/typeDefs');

describe('GraphQL Schema (typeDefs)', () => {
  it('should be defined and parse without errors', () => {
    expect(typeDefs).toBeDefined();

    // Build schema to check validity
    const schema = makeExecutableSchema({ typeDefs });
    expect(schema).toBeDefined();
  });

  it('should define User type with correct fields', () => {
    const schema = makeExecutableSchema({ typeDefs });
    const userType = schema.getType('User');
    expect(userType).toBeDefined();

    const fields = userType.getFields();
    expect(fields).toHaveProperty('_id');
    expect(fields).toHaveProperty('username');
    expect(fields).toHaveProperty('email');
    expect(fields).toHaveProperty('savedSnippets');
  });

  it('should define Snippet type with correct fields', () => {
    const schema = makeExecutableSchema({ typeDefs });
    const snippetType = schema.getType('Snippet');
    expect(snippetType).toBeDefined();

    const fields = snippetType.getFields();
    expect(fields).toHaveProperty('_id');
    expect(fields).toHaveProperty('title');
    expect(fields).toHaveProperty('code');
    expect(fields).toHaveProperty('description');
    expect(fields).toHaveProperty('language');
    expect(fields).toHaveProperty('createdAt');
    expect(fields).toHaveProperty('createdBy');
  });

  it('should define Query type with expected queries', () => {
    const schema = makeExecutableSchema({ typeDefs });
    const queryType = schema.getQueryType();
    expect(queryType).toBeDefined();

    const fields = queryType.getFields();
    expect(fields).toHaveProperty('getAllSnippets');
    expect(fields).toHaveProperty('getSnippetsByUser');
    expect(fields).toHaveProperty('getSnippetById');
    expect(fields).toHaveProperty('getSnippetsBySearch');
    expect(fields).toHaveProperty('me');
  });

  it('should define Mutation type with expected mutations', () => {
    const schema = makeExecutableSchema({ typeDefs });
    const mutationType = schema.getMutationType();
    expect(mutationType).toBeDefined();

    const fields = mutationType.getFields();
    expect(fields).toHaveProperty('login');
    expect(fields).toHaveProperty('addUser');
    expect(fields).toHaveProperty('saveSnippet');
    expect(fields).toHaveProperty('deleteSnippet');
    expect(fields).toHaveProperty('editSnippet');
  });
});

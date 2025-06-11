const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type User {
    _id: ID!
    username: String
    email: String!
    role: String!
    savedSnippets: [Snippet]
  }

  type Snippet {
    _id: ID!
    title: String!
    code: String!
    description: String!
    language: String!
    createdAt: String
    createdBy: User!
    shared: SharedInfo
  }

  type SharedInfo {
    isShared: Boolean
    code: String
    createdAt: String
    codeExpiresAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type DeleteResult {
    success: Boolean
    message: String
  }

  type Query {
    me: User
    getAllSnippets: [Snippet]
    getSnippetsByUser: [Snippet]
    getSnippetById(snippetId: ID!): Snippet
    getSnippetsBySearch(searchText: String!): [Snippet]
    getSnippetByShareCode(code: String!): Snippet
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveSnippet(
      title: String!
      code: String!
      description: String!
      language: String!
    ): Snippet
    deleteSnippet(snippetId: ID!): Snippet
    editSnippet(snippetId: ID!, code: String!): Snippet
    shareSnippet(snippetId: ID!): Snippet
    deleteUser: DeleteResult
  }

  type Query {
  getMe: User
  testSentryError: String
}


`;

module.exports = typeDefs;

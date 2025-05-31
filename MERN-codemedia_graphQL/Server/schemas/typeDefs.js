const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedSnippets: [Snippet]
  }

  type Snippet {
    _id: ID!
    title: String!
    description: String!
    language: String!
    code: String!
    createdAt: String!
    createdBy: User!
    shared: SharedInfo
  }

  type SharedInfo {
    isShared: Boolean
    code: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
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
    deleteUser: DeleteResponse!
  }
`;

module.exports = typeDefs;

const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    savedSnippets: [Snippet]  # Add this to allow fetching saved snippets for the user
  }

  type Snippet {
    _id: ID!
    title: String
    code: String
    description: String
    language: String!
    createdAt: String!
    createdBy: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    getAllSnippets: [Snippet]
    getSnippetsByUser: [Snippet]
    getSnippetById(snippetId: ID!): Snippet
    getSnippetsBySearch(searchText: String!): [Snippet]
    me: User  # Add this line for the "me" query to fetch logged-in user data
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
    
    editSnippet(
      snippetId: ID!
      code: String!
    ): Snippet
  }
`;

module.exports = typeDefs;



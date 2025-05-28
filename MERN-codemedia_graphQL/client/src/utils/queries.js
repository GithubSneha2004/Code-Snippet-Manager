import { gql } from '@apollo/client';

// Get the logged-in user (basic profile info + saved snippets)
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      savedSnippets {
        _id
        title
        code
        language
        description
        createdAt
      }
    }
  }
`;

// Get all snippets in the system
export const GET_ALL_SNIPPETS = gql`
  query GetAllSnippets {
    getAllSnippets {
      _id
      title
      code
      language
      description
      createdAt
      createdBy {
        _id
        username
      }
    }
  }
`;

// Get a single snippet by ID
export const GET_SNIPPET_BY_ID = gql`
  query GetSnippetById($snippetId: ID!) {
    getSnippetById(snippetId: $snippetId) {
      _id
      title
      code
      language
      description
      createdAt
      createdBy {
        _id
        username
      }
    }
  }
`;

// Get all snippets created by a specific user
export const GET_SNIPPETS_BY_USER = gql`
  query GetSnippetsByUser($userId: ID!) {
    getSnippetsByUser(userId: $userId) {
      _id
      title
      code
      language
      description
      createdAt
    }
  }
`;

// Search snippets based on a search term
export const SEARCH_SNIPPETS = gql`
  query SearchSnippets($searchText: String!) {
    getSnippetsBySearch(searchText: $searchText) {
      _id
      title
      code
      language
      description
      createdAt
      createdBy {
        _id
        username
      }
    }
  }
`;


import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const GET_ME = gql`
  query {
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
        shared {
          isShared
          code
        }
      }
    }
  }
`;

export const SAVE_SNIPPET = gql`
  mutation saveSnippet($title: String!, $code: String!, $description: String!, $language: String!) {
    saveSnippet(title: $title, code: $code, description: $description, language: $language) {
      _id
      title
      code
      description
      language
      createdAt
      createdBy {
        _id
        username
      }
      shared {
        isShared
        code
      }
    }
  }
`;

export const GET_ALL_SNIPPETS = gql`
  query getAllSnippets {
    getAllSnippets {
      _id
      title
      description
      language
      createdAt
      createdBy {
        username
      }
      shared {
        isShared
        code
      }
    }
  }
`;

export const GET_SNIPPETS_BY_USER = gql`
  query {
    getSnippetsByUser {
      _id
      title
      description
      language
      code
      createdAt
      shared {
        isShared
        code
      }
    }
  }
`;

export const GET_SNIPPET_BY_ID = gql`
  query getSnippetById($snippetId: ID!) {
    getSnippetById(snippetId: $snippetId) {
      _id
      title
      description
      language
      code
      createdAt
      createdBy {
        username
      }
      shared {
        isShared
        code
      }
    }
  }
`;

export const GET_SNIPPETS_BY_SEARCH = gql`
  query getSnippetsBySearch($searchText: String!) {
    getSnippetsBySearch(searchText: $searchText) {
      _id
      title
      description
      language
      createdAt
      createdBy {
        username
      }
      shared {
        isShared
        code
      }
    }
  }
`;


export const GET_SNIPPET_BY_SHARE_CODE = gql`
  query GetSnippetByShareCode($code: String!) {
    getSnippetByShareCode(code: $code) {
      _id
      title
      description
      language
      code
      createdAt
      createdBy {
        username
      }
      shared {
        isShared
        code
        createdAt
      }
    }
  }
`;


export const SHARE_SNIPPET = gql`
  mutation shareSnippet($snippetId: ID!) {
    shareSnippet(snippetId: $snippetId) {
      _id
      shared {
        isShared
        code
        createdAt
      }
      createdBy {
        username
      }
    }
  }
`;

export const DELETE_SNIPPET = gql`
  mutation deleteSnippet($snippetId: ID!) {
    deleteSnippet(snippetId: $snippetId) {
      _id
      title
    }
  }
`;

export const EDIT_SNIPPET = gql`
  mutation editSnippet($snippetId: ID!, $code: String!) {
    editSnippet(snippetId: $snippetId, code: $code) {
      _id
      code
    }
  }
`;

export const DELETE_USER = gql`
  mutation {
    deleteUser {
      success
      message
    }
  }
`;

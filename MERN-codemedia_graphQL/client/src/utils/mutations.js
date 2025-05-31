

  // mutations.js
  import { gql } from '@apollo/client';

  export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
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
        }
      }
    }
  `;

  export const ADD_SNIPPET = gql`
    mutation saveSnippet(
      $title: String!
      $code: String!
      $description: String!
      $language: String!
    ) {
      saveSnippet(
        title: $title
        code: $code
        description: $description
        language: $language
      ) {
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
        title
        code
        description
        language
        createdAt
      }
    }
  `;

export const SHARE_SNIPPET = gql`
  mutation ShareSnippet($snippetId: ID!) {
    shareSnippet(snippetId: $snippetId) {
      _id
      shared {
        isShared
        code
        createdAt
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      success
      message
    }
  }
`;
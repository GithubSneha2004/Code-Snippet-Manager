// src/__tests__/Dashboard.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Dashboard from "../components/Dashboard";
import { GET_ME } from "../utils/queries";

jest.mock("../components/CreateSnippet", () => () => (
  <div data-testid="create-snippet">CreateSnippet Component</div>
));
jest.mock("../components/MySnippets", () => () => (
  <div data-testid="my-snippets">MySnippets Component</div>
));

const now = Date.now();
const mockUserData = {
  me: {
    username: "Sneha",
    savedSnippets: [
      {
        createdAt: String(now),
        content: "console.log('Hello World');",
      },
    ],
  },
};

const mockEmptySnippets = {
  me: {
    username: "Sneha",
    savedSnippets: [],
  },
};

describe("Dashboard Component", () => {
  test("renders loading state initially", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test("displays user greeting and snippet count", async () => {
    render(
      <MockedProvider
        mocks={[{ request: { query: GET_ME }, result: { data: mockUserData } }]}
        addTypename={false}
      >
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Hi, Sneha")).toBeInTheDocument();
      expect(screen.getByText("You have 1 snippets.")).toBeInTheDocument();
    });
  });

  test("displays last update date and time correctly", async () => {
    render(
      <MockedProvider
        mocks={[{ request: { query: GET_ME }, result: { data: mockUserData } }]}
        addTypename={false}
      >
        <Dashboard />
      </MockedProvider>
    );

    const dateRegex = /^Date: \d{2}\/\d{2}\/\d{4}$/;
    const timeRegex = /^Time: \d{2}:\d{2}:\d{2}/;

    await waitFor(() => {
      expect(screen.getByText(dateRegex)).toBeInTheDocument();
      expect(screen.getByText(timeRegex)).toBeInTheDocument();
    });
  });

  test("renders CreateSnippet and MySnippets components", async () => {
    render(
      <MockedProvider
        mocks={[{ request: { query: GET_ME }, result: { data: mockUserData } }]}
        addTypename={false}
      >
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("create-snippet")).toBeInTheDocument();
      expect(screen.getByTestId("my-snippets")).toBeInTheDocument();
    });
  });

  test("handles empty snippets gracefully", async () => {
    render(
      <MockedProvider
        mocks={[{ request: { query: GET_ME }, result: { data: mockEmptySnippets } }]}
        addTypename={false}
      >
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Hi, Sneha")).toBeInTheDocument();
      expect(screen.getByText("You have 0 snippets.")).toBeInTheDocument();
      expect(screen.getByText(/^Date:/)).toBeInTheDocument();
      expect(screen.getByText(/^Time:/)).toBeInTheDocument();
    });
  });

  test("handles GraphQL error without crashing", async () => {
    const errorMock = [
      {
        request: { query: GET_ME },
        error: new Error("GraphQL error"),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      // The fallback behavior is username and snippets undefined
      expect(screen.getByText("Hi,")).toBeInTheDocument();
      expect(screen.getByText("You have 0 snippets.")).toBeInTheDocument();
      expect(screen.getByText(/^Date:/)).toBeInTheDocument();
      expect(screen.getByText(/^Time:/)).toBeInTheDocument();
    });
  });

  test("handles completely missing 'me' data", async () => {
    const mockMissingData = {
      me: undefined, // Simulates a case where query succeeds but returns no user
    };

    render(
      <MockedProvider
        mocks={[{ request: { query: GET_ME }, result: { data: mockMissingData } }]}
        addTypename={false}
      >
        <Dashboard />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Hi,")).toBeInTheDocument();
      expect(screen.getByText("You have 0 snippets.")).toBeInTheDocument();
      expect(screen.getByText(/^Date:/)).toBeInTheDocument();
      expect(screen.getByText(/^Time:/)).toBeInTheDocument();
    });
  });
});

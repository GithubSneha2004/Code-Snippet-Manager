import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import MySnippets from '../components/MySnippets';
import { GET_ME } from '../utils/queries';
import { MemoryRouter } from 'react-router-dom';

// Mock auth to simulate logged-in user
jest.mock('../utils/auth', () => ({
  loggedIn: () => true,
}));

const mocks = [
  {
    request: {
      query: GET_ME,
    },
    result: {
      data: {
        me: {
          _id: 'user123',
          savedSnippets: [
            {
              _id: 'snippet1',
              title: 'Sample Snippet',
              code: 'console.log("Hello, world!")',
              language: 'JavaScript',
              description: 'Prints hello message',
              createdAt: '2024-01-01T00:00:00.000Z',
            },
          ],
        },
      },
    },
  },
];

describe('MySnippets Component', () => {
  test('renders user snippets', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MySnippets />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for snippet title to appear
    await waitFor(() =>
      expect(screen.getByText('Sample Snippet')).toBeInTheDocument()
    );

    // Also check snippet description is visible
    expect(screen.getByText('Prints hello message')).toBeInTheDocument();

    // Check delete button presence
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });
});

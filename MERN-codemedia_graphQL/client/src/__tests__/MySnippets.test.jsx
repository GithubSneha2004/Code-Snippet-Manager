import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';

import MySnippets from '../components/MySnippets';
import { GET_ME } from '../utils/queries';
import { DELETE_SNIPPET, EDIT_SNIPPET } from '../utils/mutations';

jest.mock('../utils/auth', () => ({
  loggedIn: () => true,
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const mocks = [
  {
    request: { query: GET_ME },
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
            {
              _id: 'snippet2',
              title: 'Another Snippet',
              code: 'print("Hi")',
              language: 'Python',
              description: 'Prints hi message',
              createdAt: '2024-01-02T00:00:00.000Z',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_SNIPPET,
      variables: { snippetId: 'snippet1' },
    },
    result: {
      data: {
        deleteSnippet: {
          _id: 'snippet1',
        },
      },
    },
  },
  {
    request: {
      query: EDIT_SNIPPET,
      variables: { snippetId: 'snippet1', code: 'console.log("Updated")' },
    },
    result: {
      data: {
        editSnippet: {
          _id: 'snippet1',
          code: 'console.log("Updated")',
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

    await waitFor(() => {
      expect(screen.getByText('Sample Snippet')).toBeInTheDocument();
      expect(screen.getByText('Another Snippet')).toBeInTheDocument();
    });
  });

  test('filters snippets based on search input', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MySnippets />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('Sample Snippet'));

    const searchInput = screen.getByPlaceholderText(/search snippets/i);
    await userEvent.type(searchInput, 'Python');

    expect(screen.queryByText('Sample Snippet')).not.toBeInTheDocument();
    expect(screen.getByText('Another Snippet')).toBeInTheDocument();
  });

  test('opens modal and copies code', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MySnippets />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('Sample Snippet'));

    const snippetCard = screen.getByText('Sample Snippet').closest('article');
    const viewButton = within(snippetCard).getByRole('button', { name: /view code/i });
    await userEvent.click(viewButton);

    await waitFor(() => screen.getByText(/console\.log/));
    const copyButton = screen.getByRole('button', { name: /copy code/i });
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('console.log("Hello, world!")');
    expect(screen.getByText(/copied/i)).toBeInTheDocument();
  });

  test('edits and updates snippet', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MySnippets />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('Sample Snippet'));
    const snippetCard = screen.getByText('Sample Snippet').closest('article');
    const viewButton = within(snippetCard).getByRole('button', { name: /view code/i });
    await userEvent.click(viewButton);

    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);

    const modal = screen.getByRole('dialog');
    const textarea = within(modal).getByRole('textbox');

    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'console.log("Updated")');

    const updateButton = within(modal).getByRole('button', { name: /update snippet/i });
    await userEvent.click(updateButton);

    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
  });

  test('deletes a snippet and shows success message', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MySnippets />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('Sample Snippet'));

    const snippetCard = screen.getByText('Sample Snippet').closest('article');
    const deleteButton = within(snippetCard).getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/snippet deleted successfully/i)).toBeInTheDocument();
    });
  });

  test('favorites and filters favorites', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <MySnippets />
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => screen.getByText('Sample Snippet'));

    const favButton = screen.getAllByRole('button', { name: /favorite/i })[0];
    await userEvent.click(favButton);

    const favToggle = screen.getByLabelText(/view favorites only/i);
    await userEvent.click(favToggle);

    expect(screen.queryByText('Another Snippet')).not.toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateSnippet from '../components/CreateSnippet';
import { MockedProvider } from '@apollo/client/testing';
import { ADD_SNIPPET } from '../utils/mutations';
import Auth from '../utils/auth';

// Mock Auth utility
jest.mock('../utils/auth');

describe('CreateSnippet component', () => {
  const mocks = [
    {
      request: {
        query: ADD_SNIPPET,
        variables: {
          title: 'Test Title',
          description: 'Test Description',
          language: 'JavaScript',
          code: 'console.log("hello");',
        },
      },
      result: {
        data: {
          addSnippet: {
            _id: '123',
            title: 'Test Title',
            description: 'Test Description',
            language: 'JavaScript',
            code: 'console.log("hello");',
            __typename: 'Snippet',
          },
        },
      },
    },
  ];

  beforeEach(() => {
    Auth.loggedIn.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form inputs and button', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CreateSnippet />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save snippet/i })).toBeInTheDocument();
  });

  test('updates input fields on user typing', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CreateSnippet />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'JavaScript' } });
    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'console.log("hello");' } });

    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Title');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
    expect(screen.getByLabelText(/language/i)).toHaveValue('JavaScript');
    expect(screen.getByLabelText(/code/i)).toHaveValue('console.log("hello");');
  });

  test('renders live preview when code is typed', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CreateSnippet />
      </MockedProvider>
    );

    const codeInput = screen.getByLabelText(/code/i);
    fireEvent.change(codeInput, { target: { value: 'console.log("hello");' } });

    expect(screen.getByText(/live preview/i)).toBeInTheDocument();
    expect(
      screen.getAllByText('console.log("hello");').some(
        el => el.tagName.toLowerCase() === 'pre'
      )
    ).toBe(true);
  });

  test('submits the form and shows success message', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CreateSnippet />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'JavaScript' } });
    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'console.log("hello");' } });

    fireEvent.click(screen.getByRole('button', { name: /save snippet/i }));

    await waitFor(() => {
      expect(screen.getByText(/snippet added successfully/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByLabelText(/language/i)).toHaveValue('');
    expect(screen.getByLabelText(/code/i)).toHaveValue('');
  });

  test('does not submit if user is not logged in', () => {
    Auth.loggedIn.mockReturnValue(false);

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <CreateSnippet />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'JavaScript' } });
    fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'console.log("hello");' } });

    fireEvent.click(screen.getByRole('button', { name: /save snippet/i }));

    expect(screen.queryByText(/snippet added successfully/i)).not.toBeInTheDocument();
  });

  test('shows error when mutation fails', async () => {
  const errorMock = [
    {
      request: {
        query: ADD_SNIPPET,
        variables: {
          title: 'Error Title',
          description: 'Error Description',
          language: 'Python',
          code: 'print("error")',
        },
      },
      error: new Error('Mutation failed'),
    },
  ];

  jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <MockedProvider mocks={errorMock} addTypename={false}>
      <CreateSnippet />
    </MockedProvider>
  );

  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Error Title' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Error Description' } });
  fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'Python' } });
  fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'print("error")' } });

  fireEvent.click(screen.getByRole('button', { name: /save snippet/i }));

  await waitFor(() => {
    expect(console.error).toHaveBeenCalled();
  });

  console.error.mockRestore();
});

test('success message disappears after timeout', async () => {
  jest.useFakeTimers();

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CreateSnippet />
    </MockedProvider>
  );

  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
  fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'JavaScript' } });
  fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'console.log("hello");' } });

  fireEvent.click(screen.getByRole('button', { name: /save snippet/i }));

  await waitFor(() => {
    expect(screen.getByText(/snippet added successfully/i)).toBeInTheDocument();
  });

  // Fast forward 3 seconds
  jest.advanceTimersByTime(3000);

  await waitFor(() => {
    expect(screen.queryByText(/snippet added successfully/i)).not.toBeInTheDocument();
  });

  jest.useRealTimers();
});

test('shows error in console when mutation fails', async () => {
  const errorMock = [
    {
      request: {
        query: ADD_SNIPPET,
        variables: {
          title: 'Error Title',
          description: 'Error Description',
          language: 'Python',
          code: 'print("Hello")',
        },
      },
      error: new Error('Mutation failed'),
    },
  ];

  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <MockedProvider mocks={errorMock} addTypename={false}>
      <CreateSnippet />
    </MockedProvider>
  );

  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Error Title' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Error Description' } });
  fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'Python' } });
  fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'print("Hello")' } });

  fireEvent.click(screen.getByRole('button', { name: /save snippet/i }));

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  consoleSpy.mockRestore();
});

test('success message disappears after timeout', async () => {
  jest.useFakeTimers();

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CreateSnippet />
    </MockedProvider>
  );

  fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
  fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
  fireEvent.change(screen.getByLabelText(/language/i), { target: { value: 'JavaScript' } });
  fireEvent.change(screen.getByLabelText(/code/i), { target: { value: 'console.log("hello");' } });

  fireEvent.click(screen.getByRole('button', { name: /save snippet/i }));

  await waitFor(() => {
    expect(screen.getByText(/snippet added successfully/i)).toBeInTheDocument();
  });

  jest.runAllTimers();

  await waitFor(() => {
    expect(screen.queryByText(/snippet added successfully/i)).not.toBeInTheDocument();
  });

  jest.useRealTimers();
});

});

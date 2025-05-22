import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Login from '../components/Login';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';


// Mock Auth utility
jest.mock('../utils/auth', () => ({
  login: jest.fn()
}));

const mockSuccess = {
  request: {
    query: LOGIN_USER,
    variables: { email: 'test@example.com', password: 'password123' },
  },
  result: {
    data: {
      login: {
        token: 'mockToken123',
      },
    },
  },
};

const mockError = {
  request: {
    query: LOGIN_USER,
    variables: { email: 'wrong@example.com', password: 'wrongpass' },
  },
  error: new Error('Invalid credentials'),
};

describe('Login Component', () => {
  test('renders email and password inputs and submit button', () => {
    render(
      <MockedProvider>
        <Login />
      </MockedProvider>
    );
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('updates form fields correctly', () => {
    render(
      <MockedProvider>
        <Login />
      </MockedProvider>
    );
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', () => {
    render(
      <MockedProvider>
        <Login />
      </MockedProvider>
    );
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const toggleBtn = screen.getByRole('button', { name: '' }); // no accessible name

    expect(passwordInput.type).toBe('password');

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('password');
  });

  test('submits form and logs in on success', async () => {
    render(
      <MockedProvider mocks={[mockSuccess]} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(Auth.login).toHaveBeenCalledWith('mockToken123');
    });
  });

  test('shows alert on login error', async () => {
    render(
      <MockedProvider mocks={[mockError]} addTypename={false}>
        <Login />
      </MockedProvider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});

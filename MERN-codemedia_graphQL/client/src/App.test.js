import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('renders homepage content when user is NOT logged in', () => {
    render(<App />);

    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/signup/i)).toBeInTheDocument();
  });

  test('renders Dashboard and Logout links when user IS logged in', () => {
    localStorage.setItem('id_token', 'mock-token');

    render(<App />);

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});

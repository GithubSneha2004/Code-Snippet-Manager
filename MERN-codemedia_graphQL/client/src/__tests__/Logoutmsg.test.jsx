import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logoutmsg from '../components/Logoutmsg';

describe('Logoutmsg Component', () => {
  test('renders thank you message and login prompt', () => {
    render(
      <MemoryRouter>
        <Logoutmsg />
      </MemoryRouter>
    );

    expect(screen.getByText(/Thank you for using the app!/i)).toBeInTheDocument();
    expect(screen.getByText(/To continue, please log in./i)).toBeInTheDocument();
  });

  test('renders login link with correct href', () => {
    render(
      <MemoryRouter>
        <Logoutmsg />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole('link', { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });
});

import { render, screen } from '@testing-library/react';
import LoginReminder from '../components/LoginReminder';

describe('LoginReminder Component', () => {
  test('renders the reminder heading and paragraph', () => {
    render(<LoginReminder />);
    expect(screen.getByText(/You are not logged in/i)).toBeInTheDocument();
    expect(screen.getByText(/Please log in to access this section./i)).toBeInTheDocument();
  });

  test('renders the reminder image with correct alt text', () => {
    render(<LoginReminder />);
    const img = screen.getByAltText(/Login Reminder/i);
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('login.gif'); // checks if image src includes gif filename
  });
});

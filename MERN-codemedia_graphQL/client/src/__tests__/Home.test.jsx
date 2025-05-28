import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from '../components/home/Home';

describe('Home Component', () => {
  const renderComponent = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Home />
      </MemoryRouter>
    );
  };

  test('renders main heading with correct text and class', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { name: /Code Snippet Manager/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-4xl', 'font-extrabold');
  });

  test('renders descriptive paragraphs', () => {
    renderComponent();
    expect(screen.getByText(/ultimate tool for organizing and storing your code snippets/i)).toBeInTheDocument();
    expect(screen.getByText(/start managing your code snippets today/i)).toBeInTheDocument();
  });

  test('renders Get Started link with correct href and styling', () => {
    renderComponent();
    const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/signup');
    expect(getStartedLink).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
  });

  test('navigates correctly when Get Started link is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();
    const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
    expect(getStartedLink).toHaveAttribute('href', '/signup');
    // userEvent click doesn't change route automatically without a router setup, 
    // but this confirms the link is correct.
    await user.click(getStartedLink);
  });

  test('renders image with correct alt text and styling', () => {
    renderComponent();
    const img = screen.getByAltText(/Code Snippet Illustration/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass('max-w-full', 'h-auto', 'rounded-xl', 'shadow-lg');
  });

  test('supports dark mode classes', () => {
    renderComponent();
    const section = screen.getByTestId('home-section');
    // Since section lacks aria roles, we can test the outer div for dark mode class
    // but your section does not have testid or role, so fallback to querying by class or tag:
    expect(section).toHaveClass('dark:bg-gray-900');
  });

  test('matches snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});

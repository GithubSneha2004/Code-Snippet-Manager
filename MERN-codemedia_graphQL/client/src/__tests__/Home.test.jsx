import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/home/Home';

describe('Home Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
  });

  test('renders main heading', () => {
    const heading = screen.getByRole('heading', { name: /Code Snippet Manager/i });
    expect(heading).toBeInTheDocument();
  });

  test('renders descriptive paragraphs', () => {
    expect(screen.getByText(/ultimate tool for organizing and storing your code snippets/i)).toBeInTheDocument();
    expect(screen.getByText(/start managing your code snippets today/i)).toBeInTheDocument();
  });

  test('renders Get Started link with correct href', () => {
    const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
    expect(getStartedLink).toBeInTheDocument();
    expect(getStartedLink).toHaveAttribute('href', '/signup');
  });

  test('renders image with alt text', () => {
    const img = screen.getByAltText(/Code Snippet Illustration/i);
    expect(img).toBeInTheDocument();
  });
});

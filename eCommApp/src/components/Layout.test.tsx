import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';

const renderWithRouter = (component: React.ReactNode) => render(
    <MemoryRouter>{component}</MemoryRouter>
);

describe('layout components', () => {
    it('renders all header navigation links', () => {
        renderWithRouter(<Header />);

        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
        expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
    });

    it('renders the footer copyright', () => {
        renderWithRouter(<Footer />);

        expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
    });

    it('renders the home page content', () => {
        renderWithRouter(<HomePage />);

        expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
        expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    });
});

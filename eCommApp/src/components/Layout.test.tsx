import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
        expect(screen.getByRole('button', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
    });

    it('opens the contact modal from the header outside of the header element', async () => {
        const user = userEvent.setup();
        renderWithRouter(<Header />);

        expect(screen.queryByRole('heading', { name: 'Contact Us' })).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        expect(screen.getByRole('heading', { name: 'Contact Us' }).closest('.app-header')).toBeNull();
    });

    it('closes the contact modal and starts empty when reopened', async () => {
        const user = userEvent.setup();
        renderWithRouter(<Header />);

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));
        await user.type(screen.getByPlaceholderText('Your name'), 'Maria');
        await user.type(screen.getByPlaceholderText('Your email'), 'maria@example.com');
        await user.type(screen.getByPlaceholderText('Your message'), 'Hello there');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(screen.queryByRole('heading', { name: 'Contact Us' })).not.toBeInTheDocument();
        expect(screen.queryByText('Thank you for your message')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.queryByText('Thank you for your message')).not.toBeInTheDocument();
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

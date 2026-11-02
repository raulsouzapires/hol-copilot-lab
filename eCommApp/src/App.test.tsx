import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/HomePage', () => ({ default: () => <h1>Home Route</h1> }));
vi.mock('./components/ProductsPage', () => ({ default: () => <h1>Products Route</h1> }));
vi.mock('./components/LoginPage', () => ({ default: () => <h1>Login Route</h1> }));
vi.mock('./components/AdminPage', () => ({ default: () => <h1>Admin Route</h1> }));
vi.mock('./components/CartPage', () => ({ default: () => <h1>Cart Route</h1> }));

const renderRoute = (route: string) => render(
    <MemoryRouter initialEntries={[route]}>
        <App />
    </MemoryRouter>
);

describe('App routes', () => {
    it('renders the home route', () => {
        renderRoute('/');
        expect(screen.getByRole('heading', { name: 'Home Route' })).toBeInTheDocument();
    });

    it('renders the products route', () => {
        renderRoute('/products');
        expect(screen.getByRole('heading', { name: 'Products Route' })).toBeInTheDocument();
    });

    it('renders the login route', () => {
        renderRoute('/login');
        expect(screen.getByRole('heading', { name: 'Login Route' })).toBeInTheDocument();
    });

    it('renders the admin route', () => {
        renderRoute('/admin');
        expect(screen.getByRole('heading', { name: 'Admin Route' })).toBeInTheDocument();
    });

    it('renders the cart route', () => {
        renderRoute('/cart');
        expect(screen.getByRole('heading', { name: 'Cart Route' })).toBeInTheDocument();
    });
});

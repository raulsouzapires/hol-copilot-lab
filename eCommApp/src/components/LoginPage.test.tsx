import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LoginPage from './LoginPage';

const renderLogin = (initialPath = '/login') => render(
    <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<h1>Admin destination</h1>} />
        </Routes>
    </MemoryRouter>
);

describe('LoginPage', () => {
    it('renders the admin login form', () => {
        renderLogin();

        expect(screen.getByRole('heading', { name: 'Admin Login' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });

    it('shows an error for invalid credentials', async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Username'), 'user');
        await user.type(screen.getByPlaceholderText('Password'), 'wrong');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('navigates to admin for valid credentials', async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByRole('heading', { name: 'Admin destination' })).toBeInTheDocument();
    });

    it('rejects a correct username with an incorrect password', async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Username'), 'admin');
        await user.type(screen.getByPlaceholderText('Password'), 'password');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('rejects an incorrect username with the correct password', async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByPlaceholderText('Username'), 'user');
        await user.type(screen.getByPlaceholderText('Password'), 'admin');
        await user.click(screen.getByRole('button', { name: 'Login' }));

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});

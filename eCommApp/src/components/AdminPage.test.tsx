import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminPage from './AdminPage';

const renderAdmin = () => render(
    <MemoryRouter>
        <AdminPage />
    </MemoryRouter>
);

describe('AdminPage', () => {
    it('starts with no sale active', () => {
        renderAdmin();

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
        expect(screen.getByLabelText('Set Sale Percent (% off for all items):')).toHaveValue('0');
    });

    it('activates a valid sale percentage', async () => {
        const user = userEvent.setup();
        renderAdmin();

        const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(input);
        await user.type(input, '25');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
        expect(screen.queryByText('No sale active.')).not.toBeInTheDocument();
    });

    it('keeps no sale active when zero is submitted', async () => {
        const user = userEvent.setup();
        renderAdmin();

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });

    it('shows an error for invalid numeric input', async () => {
        const user = userEvent.setup();
        renderAdmin();

        const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(input);
        await user.type(input, 'invalid');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
        expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
    });

    it('ends a sale and resets the input', async () => {
        const user = userEvent.setup();
        renderAdmin();

        const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
        await user.clear(input);
        await user.type(input, '15');
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        await user.click(screen.getByRole('button', { name: 'End Sale' }));

        expect(input).toHaveValue('0');
        expect(screen.getByText('No sale active.')).toBeInTheDocument();
    });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
    it('renders its confirmation prompt', () => {
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
        expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();
    });

    it('calls confirm when Continue Checkout is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(<CheckoutModal onConfirm={onConfirm} onCancel={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Continue Checkout' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls cancel when Return to cart is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<CheckoutModal onConfirm={vi.fn()} onCancel={onCancel} />);

        await user.click(screen.getByRole('button', { name: 'Return to cart' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});

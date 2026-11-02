import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const product = (reviews = [] as Product['reviews']): Product => ({
    id: 'apple',
    name: 'Apple',
    price: 2.5,
    image: 'apple.jpg',
    reviews,
    inStock: true
});

describe('ReviewModal', () => {
    it('renders nothing without a selected product', () => {
        const { container } = render(
            <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders an empty review state', () => {
        render(<ReviewModal product={product()} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();
        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders existing reviews', () => {
        render(<ReviewModal
            product={product([{ author: 'Ana', comment: 'Fresh fruit', date: '2025-01-15T00:00:00.000Z' }])}
            onClose={vi.fn()}
            onSubmit={vi.fn()}
        />);

        expect(screen.getByText('Ana')).toBeInTheDocument();
        expect(screen.getByText('Fresh fruit')).toBeInTheDocument();
    });

    it('submits a review and resets the form', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<ReviewModal product={product()} onClose={vi.fn()} onSubmit={onSubmit} />);

        await user.type(screen.getByPlaceholderText('Your name'), 'Maria');
        await user.type(screen.getByPlaceholderText('Your review'), 'Very tasty');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({
            author: 'Maria',
            comment: 'Very tasty',
            date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
        }));
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your review')).toHaveValue('');
    });

    it('closes from the close button', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<ReviewModal product={product()} onClose={onClose} onSubmit={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes from the backdrop but not from the modal content', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const { container } = render(
            <ReviewModal product={product()} onClose={onClose} onSubmit={vi.fn()} />
        );

        await user.click(screen.getByRole('heading', { name: 'Reviews for Apple' }));
        expect(onClose).not.toHaveBeenCalled();

        await user.click(container.querySelector('.modal-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

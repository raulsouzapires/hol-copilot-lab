import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartProvider } from '../context/CartContext';
import { Product } from '../types';

const products: Product[] = [
    {
        id: 'apple',
        name: 'Apple',
        price: 2.5,
        description: 'Fresh apple',
        image: 'apple.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: 'pear',
        name: 'Pear',
        price: 3.25,
        reviews: [{ author: 'Ana', comment: 'Sweet', date: '2025-01-15T00:00:00.000Z' }],
        image: 'pear.jpg',
        inStock: false
    },
    {
        id: 'grape',
        name: 'Grape',
        price: 4,
        reviews: [],
        inStock: true
    },
    {
        id: 'orange',
        name: 'Orange',
        price: 3,
        description: 'Juicy orange',
        image: 'orange.jpg',
        reviews: [],
        inStock: true
    }
];

const renderProducts = () => render(
    <MemoryRouter>
        <CartProvider>
            <ProductsPage />
        </CartProvider>
    </MemoryRouter>
);

const mockSuccessfulFetch = (loaded = products) => {
    vi.mocked(fetch).mockImplementation(async (input) => {
        const url = String(input);
        const fileName = url.split('/').pop();
        if (fileName === 'apple.json') return { ok: true, json: async () => loaded[0] } as Response;
        if (fileName === 'grapes.json') return { ok: true, json: async () => loaded[1] } as Response;
        if (fileName === 'orange.json') return { ok: true, json: async () => loaded[2] } as Response;
        return { ok: true, json: async () => loaded[3] } as Response;
    });
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('shows the loading state before products finish loading', () => {
        vi.mocked(fetch).mockImplementation(() => new Promise<Response>(() => undefined));

        renderProducts();

        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('loads and renders products, descriptions, images, and stock states', async () => {
        mockSuccessfulFetch();
        renderProducts();

        expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Apple' })).toBeInTheDocument();
        expect(screen.getByText('Fresh apple')).toBeInTheDocument();
        expect(screen.getByText('$2.50')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Add to Cart' })).not.toHaveLength(0);
        expect(screen.getAllByRole('button', { name: 'Add to Cart' }).every(button => !button.hasAttribute('disabled'))).toBe(true);
        expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
        expect(screen.getByRole('img', { name: 'Apple' })).toHaveAttribute(
            'src',
            'products/productImages/apple.jpg'
        );
    });

    it('adds an in-stock product to the cart', async () => {
        const user = userEvent.setup();
        mockSuccessfulFetch();
        renderProducts();

        const addButtons = await screen.findAllByRole('button', { name: 'Add to Cart' });
        await user.click(addButtons[0]);
        await user.click(addButtons[0]);

        expect(await screen.findByText('$2.50')).toBeInTheDocument();
    });

    it('opens the review modal from a product image and submits a review', async () => {
        const user = userEvent.setup();
        mockSuccessfulFetch();
        renderProducts();

        const appleImage = await screen.findByRole('img', { name: 'Apple' });
        await user.click(appleImage);

        expect(screen.getByRole('heading', { name: 'Reviews for Apple' })).toBeInTheDocument();

        await user.type(screen.getByPlaceholderText('Your name'), 'Maria');
        await user.type(screen.getByPlaceholderText('Your review'), 'Excellent');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        await user.click(appleImage);
        expect(await screen.findByText('Maria')).toBeInTheDocument();
        expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('handles an empty set of reviews', async () => {
        mockSuccessfulFetch();
        renderProducts();

        await userEvent.click(await screen.findByRole('img', { name: 'Apple' }));

        expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    });

    it('renders a product with an existing review', async () => {
        mockSuccessfulFetch();
        renderProducts();

        await userEvent.click(await screen.findByRole('img', { name: 'Pear' }));

        expect(screen.getByText('Ana')).toBeInTheDocument();
        expect(screen.getByText('Sweet')).toBeInTheDocument();
    });

    it('handles network failures after ending the loading state', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('network unavailable'));
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        renderProducts();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        expect(screen.queryByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
        expect(consoleError).toHaveBeenCalled();
    });

    it('handles a non-OK HTTP response', async () => {
        vi.mocked(fetch).mockResolvedValue({ ok: false } as Response);
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        renderProducts();

        await waitFor(() => {
            expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
        });
        expect(consoleError).toHaveBeenCalled();
    });

    it('throws when rendered outside CartProvider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(
            <MemoryRouter>
                <ProductsPage />
            </MemoryRouter>
        )).toThrow('CartContext must be used within a CartProvider');

        consoleError.mockRestore();
    });
});

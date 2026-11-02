import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const createCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
    id: '1',
    name: 'Test Product',
    price: 29.99,
    quantity: 1,
    image: 'test.jpg',
    reviews: [],
    inStock: true,
    ...overrides
});

const mockCartItems: CartItem[] = [
    createCartItem({
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg'
    }),
    createCartItem({
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg'
    })
];

const createCartContext = (cartItems: CartItem[] = mockCartItems) => ({
    cartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
});

const renderWithCartContext = (cartContext = createCartContext()) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays all items and checkout controls when the cart has products', () => {
        renderWithCartContext();

        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Test Product 1' })).toHaveAttribute(
            'src',
            'products/productImages/test1.jpg'
        );
        expect(screen.getByRole('img', { name: 'Test Product 2' })).toHaveAttribute(
            'src',
            'products/productImages/test2.jpg'
        );
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('displays an empty state and no checkout controls when the cart is empty', () => {
        renderWithCartContext(createCartContext([]));

        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders a single cart item correctly', () => {
        renderWithCartContext(createCartContext([createCartItem()]));

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Test Product' })).toHaveAttribute(
            'src',
            'products/productImages/test.jpg'
        );
    });

    it('formats a zero price with two decimal places', () => {
        renderWithCartContext(createCartContext([createCartItem({ price: 0 })]));

        expect(screen.getByText('Price: $0.00')).toBeInTheDocument();
    });

    it('renders a zero quantity without changing the displayed value', () => {
        renderWithCartContext(createCartContext([createCartItem({ quantity: 0 })]));

        expect(screen.getByText('Quantity: 0')).toBeInTheDocument();
    });

    it('renders the component fallback image path when an item has no image', () => {
        renderWithCartContext(createCartContext([createCartItem({ image: undefined })]));

        expect(screen.getByRole('img', { name: 'Test Product' })).toHaveAttribute(
            'src',
            'products/productImages/undefined'
        );
    });

    it('opens the checkout modal without clearing the cart', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        expect(cartContext.clearCart).not.toHaveBeenCalled();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('cancels checkout and leaves the cart unchanged', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByTestId('cancel-checkout'));

        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(cartContext.clearCart).not.toHaveBeenCalled();
        expect(screen.getByText('Your Cart')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
    });

    it('confirms checkout once and displays the processed order', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();
        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByTestId('confirm-checkout'));

        expect(cartContext.clearCart).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
        expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('preserves processed items when clearCart empties the context cart', async () => {
        const user = userEvent.setup();
        const clearCart = vi.fn();

        const StatefulCart = () => {
            const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
            return (
                <CartContext.Provider
                    value={{
                        cartItems,
                        addToCart: vi.fn(),
                        clearCart: () => {
                            clearCart();
                            setCartItems([]);
                        }
                    }}
                >
                    <CartPage />
                </CartContext.Provider>
            );
        };

        render(<StatefulCart />);
        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByTestId('confirm-checkout'));

        expect(clearCart).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Your order has been processed!')).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.queryByText('Your cart is empty.')).not.toBeInTheDocument();
    });

    it('throws a clear error when CartPage is rendered outside CartProvider', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => render(<CartPage />)).toThrow(
            'CartContext must be used within a CartProvider'
        );

        consoleError.mockRestore();
    });
});

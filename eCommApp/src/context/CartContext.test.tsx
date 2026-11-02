import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';

const apple: Product = {
    id: 'apple',
    name: 'Apple',
    price: 2.5,
    image: 'apple.jpg',
    reviews: [],
    inStock: true
};

const pear: Product = {
    id: 'pear',
    name: 'Pear',
    price: 3,
    image: 'pear.jpg',
    reviews: [],
    inStock: true
};

const TestConsumer = () => (
    <CartContext.Consumer>
        {context => context ? (
            <>
                <span data-testid="cart-count">{context.cartItems.length}</span>
                <span data-testid="apple-quantity">
                    {context.cartItems.find(item => item.id === 'apple')?.quantity ?? 0}
                </span>
                <button onClick={() => context.addToCart(apple)}>Add Apple</button>
                <button onClick={() => context.addToCart(pear)}>Add Pear</button>
                <button onClick={context.clearCart}>Clear Cart</button>
            </>
        ) : <span>Missing context</span>}
    </CartContext.Consumer>
);

describe('CartProvider', () => {
    it('starts with an empty cart', () => {
        render(<CartProvider><TestConsumer /></CartProvider>);

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('apple-quantity')).toHaveTextContent('0');
    });

    it('adds a new product with quantity one', async () => {
        const user = userEvent.setup();
        render(<CartProvider><TestConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add Apple' }));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('apple-quantity')).toHaveTextContent('1');
    });

    it('increments quantity instead of adding a duplicate product', async () => {
        const user = userEvent.setup();
        render(<CartProvider><TestConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add Apple' }));
        await user.click(screen.getByRole('button', { name: 'Add Apple' }));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
        expect(screen.getByTestId('apple-quantity')).toHaveTextContent('2');
    });

    it('keeps different products independent', async () => {
        const user = userEvent.setup();
        render(<CartProvider><TestConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add Apple' }));
        await user.click(screen.getByRole('button', { name: 'Add Pear' }));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
        expect(screen.getByTestId('apple-quantity')).toHaveTextContent('1');
    });

    it('clears all cart items', async () => {
        const user = userEvent.setup();
        render(<CartProvider><TestConsumer /></CartProvider>);

        await user.click(screen.getByRole('button', { name: 'Add Apple' }));
        await user.click(screen.getByRole('button', { name: 'Clear Cart' }));

        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
        expect(screen.getByTestId('apple-quantity')).toHaveTextContent('0');
    });
});

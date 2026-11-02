import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers', () => {
    it('formats prices as US dollars', () => {
        expect(formatPrice(29.99)).toBe('$29.99');
        expect(formatPrice(0)).toBe('$0.00');
        expect(formatPrice(-1)).toBe('-$1.00');
    });

    it('calculates totals for multiple items', () => {
        expect(calculateTotal([
            { price: 10, quantity: 2 },
            { price: 4.5, quantity: 1 }
        ])).toBe(24.5);
    });

    it('returns zero for empty or zero-quantity totals', () => {
        expect(calculateTotal([])).toBe(0);
        expect(calculateTotal([
            { price: 10, quantity: 0 },
            { price: 20, quantity: 0 }
        ])).toBe(0);
    });

    it('accepts valid email addresses', () => {
        expect(validateEmail('admin@dailyharvest.com')).toBe(true);
        expect(validateEmail('person+orders@example.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
        expect(validateEmail('')).toBe(false);
        expect(validateEmail('admin')).toBe(false);
        expect(validateEmail('admin@')).toBe(false);
        expect(validateEmail('@dailyharvest.com')).toBe(false);
        expect(validateEmail('admin user@dailyharvest.com')).toBe(false);
    });
});

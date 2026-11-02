import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ContactModal from './ContactModal';

const fillForm = async (user: ReturnType<typeof userEvent.setup>, email = 'maria@example.com') => {
    await user.type(screen.getByPlaceholderText('Your name'), 'Maria');
    await user.type(screen.getByPlaceholderText('Your email'), email);
    await user.type(screen.getByPlaceholderText('Your message'), 'Hello there');
};

describe('ContactModal', () => {
    it('renders the contact form with Submit below the message field', () => {
        render(<ContactModal onClose={vi.fn()} />);

        expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your email')).toHaveAttribute('type', 'email');

        const message = screen.getByPlaceholderText('Your message');
        const submit = screen.getByRole('button', { name: 'Submit' });
        expect(message.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        expect(screen.queryByText('Thank you for your message')).not.toBeInTheDocument();
    });

    it('shows the thank you pop-up and clears the fields on submit', async () => {
        const user = userEvent.setup();
        render(<ContactModal onClose={vi.fn()} />);

        await fillForm(user);
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Thank you for your message')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your email')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your message')).toHaveValue('');
    });

    it('does not submit with empty fields', async () => {
        const user = userEvent.setup();
        render(<ContactModal onClose={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.queryByText('Thank you for your message')).not.toBeInTheDocument();
    });

    it('does not submit with an invalid email', async () => {
        const user = userEvent.setup();
        render(<ContactModal onClose={vi.fn()} />);

        await fillForm(user, 'not-an-email');
        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.queryByText('Thank you for your message')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText('Your email')).toHaveValue('not-an-email');
    });

    it('closes from the Continue button', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<ContactModal onClose={onClose} />);

        await fillForm(user);
        await user.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onClose).not.toHaveBeenCalled();

        await user.click(screen.getByRole('button', { name: 'Continue' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes from the close button', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<ContactModal onClose={onClose} />);

        await user.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes from the backdrop but not from the modal content', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const { container } = render(<ContactModal onClose={onClose} />);

        await user.click(screen.getByRole('heading', { name: 'Contact Us' }));
        expect(onClose).not.toHaveBeenCalled();

        await user.click(container.querySelector('.modal-backdrop')!);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

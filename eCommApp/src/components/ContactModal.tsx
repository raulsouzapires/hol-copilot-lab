import { useState } from 'react';

interface ContactModalProps {
    onClose: () => void;
}

const ContactModal = ({ onClose }: ContactModalProps) => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.currentTarget.reset();
        setSubmitted(true);
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input type="text" name="name" placeholder="Your name" required autoFocus />
                        <input type="email" name="email" placeholder="Your email" required />
                        <textarea name="message" placeholder="Your message" required />
                        <button type="submit">Submit</button>
                    </form>
                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
            {submitted && (
                <div className="modal-backdrop">
                    <div className="modal-content contact-thank-you">
                        <p>Thank you for your message</p>
                        <button onClick={onClose}>Continue</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ContactModal;

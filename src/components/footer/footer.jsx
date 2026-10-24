import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const GRIEVANCE_ENDPOINT = '/api/grievances';

const Footer = () => {
    const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const firstFieldRef = useRef(null);
    const grievanceButtonRef = useRef(null);

    useEffect(() => {
        if (!isGrievanceOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        firstFieldRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isSubmitting) {
                setIsGrievanceOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isGrievanceOpen, isSubmitting]);

    useEffect(() => {
        if (!isGrievanceOpen) {
            grievanceButtonRef.current?.focus();
        }
    }, [isGrievanceOpen]);

    const openGrievanceForm = () => {
        setFormMessage('');
        setIsGrievanceOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const form = event.currentTarget;
        const grievance = Object.fromEntries(new FormData(form));

        try {
            const response = await fetch(GRIEVANCE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grievance),
            });

            if (!response.ok) {
                throw new Error('Grievance request failed');
            }

            form.reset();
            setFormMessage('Your grievance was submitted. Our team will review it.');
        } catch (error) {
            console.error('Unable to submit grievance:', error);
            setFormMessage('We could not submit your grievance. Please try again later or contact us.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <footer className="site-footer">
                <div className="footer-main">
                    <div className="footer-container footer-columns">
                        <div className="footer-brand">
                            <Link className="footer-logo" to="/" aria-label="Credit guidance home">
                                Credit<span>Guidance</span>
                            </Link>
                            <p>
                                Clear, responsible guidance to help you understand your credit
                                profile and make informed next steps.
                            </p>
                        </div>

                        <nav className="footer-nav" aria-label="Footer navigation">
                            <h2>Explore</h2>
                            <Link to="/">Home</Link>
                            <Link to="/about">About us</Link>
                            <Link to="/services">Our services</Link>
                        </nav>

                        <div className="footer-contact">
                            <h2>Need assistance?</h2>
                            <p>Questions about your credit report or our process?</p>
                            <Link className="footer-contact-link" to="/contact">
                                Contact us <span aria-hidden="true">→</span>
                            </Link>
                            <button
                                className="footer-grievance-link"
                                onClick={openGrievanceForm}
                                ref={grievanceButtonRef}
                                type="button"
                            >
                                Submit a grievance <span aria-hidden="true">↗</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="footer-container footer-bottom-content">
                        <p>© {new Date().getFullYear()} Credit Guidance. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {isGrievanceOpen && (
                <div
                    className="grievance-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isSubmitting) {
                            setIsGrievanceOpen(false);
                        }
                    }}
                >
                    <section
                        aria-describedby="grievance-description"
                        aria-labelledby="grievance-title"
                        aria-modal="true"
                        className="grievance-dialog"
                        role="dialog"
                    >
                        <div className="grievance-dialog-header">
                            <div>
                                <p className="grievance-eyebrow">We’re here to listen</p>
                                <h2 id="grievance-title">Submit a grievance</h2>
                            </div>
                            <button
                                aria-label="Close grievance form"
                                className="grievance-close"
                                disabled={isSubmitting}
                                onClick={() => setIsGrievanceOpen(false)}
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                        <p className="grievance-description" id="grievance-description">
                            Share the details below and our team will review your concern.
                        </p>

                        <form className="grievance-form" onSubmit={handleSubmit}>
                            <label>
                                Full name
                                <input
                                    autoComplete="name"
                                    maxLength="100"
                                    name="name"
                                    placeholder="Your name"
                                    ref={firstFieldRef}
                                    required
                                />
                            </label>
                            <div className="grievance-form-row">
                                <label>
                                    Email address
                                    <input
                                        autoComplete="email"
                                        maxLength="254"
                                        name="email"
                                        placeholder="you@example.com"
                                        required
                                        type="email"
                                    />
                                </label>
                                <label>
                                    Mobile number
                                    <input
                                        autoComplete="tel"
                                        maxLength="10"
                                        name="mobile"
                                        pattern="[6-9][0-9]{9}"
                                        placeholder="10-digit mobile number"
                                        required
                                        type="tel"
                                        title="Enter a valid 10-digit Indian mobile number."
                                    />
                                </label>
                            </div>
                            <label>
                                Grievance details
                                <textarea
                                    maxLength="5000"
                                    name="grievance"
                                    placeholder="Please describe your concern and any relevant details."
                                    required
                                    rows="5"
                                />
                            </label>

                            {formMessage && (
                                <p
                                    className={`grievance-message grievance-message-${formMessage.startsWith('Your grievance') ? 'success' : 'error'}`}
                                    role="status"
                                >
                                    {formMessage}
                                </p>
                            )}

                            <div className="grievance-form-actions">
                                <button
                                    className="grievance-cancel"
                                    disabled={isSubmitting}
                                    onClick={() => setIsGrievanceOpen(false)}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="grievance-submit"
                                    disabled={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Submitting…' : 'Submit grievance'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
};

export default Footer;
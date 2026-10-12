import { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import { API_BASE_URL } from '../../config/api.js';

const CONSULTATION_API_URL = `${API_BASE_URL}/api/v1/create-credit`;
const loanGoals = [
  { icon: '🏠', title: 'Home loan', text: 'Make a plan for your next home' },
  { icon: '🚗', title: 'Car loan', text: 'Understand your credit options' },
  { icon: '🏢', title: 'Business loan', text: 'Review your company credit profile' },
  { icon: '📊', title: 'Credit report', text: 'Find a clearer way forward' },
];

function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const openConsultation = () => {
    setSubmissionMessage('');
    setIsConsultationOpen(true);
  };

  const handleConsultationSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionMessage('');

    try {
      const formData = Object.fromEntries(new FormData(event.currentTarget));
      const data = {
        email: formData.email,
        fullName: formData.fullName,
        requirement: formData.requirement,
        mobile: formData.mobile,
        status: 'New',
        type: formData.type,
      };

      const response = await fetch(CONSULTATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      setSubmissionMessage('Thank you! Our team will reach you soon.');
    } catch (error) {
      console.error('Consultation request failed:', error);
      setSubmissionMessage('We could not send your request right now. Please try again later.',);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">A fresh start for your finances</p>
          <h1>Worried a low CIBIL score is holding you back?</h1>
          <p className="home-description">
            Loan applications can be affected by your credit profile. Understand
            your report, identify what may need attention, and explore practical
            next steps for healthier credit.
          </p>
        </div>
        <img
          className="home-credit-illustration"
          src='/CreditScore-img.gif'
          alt="Animated illustration about checking and improving a credit score"
        />
        <Link className="getcredit" to="/services">
          Get Credit Support <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="home-audience" aria-labelledby="home-audience-title">
        <p className="home-eyebrow">Credit guidance for your goals</p>
        <h2 id="home-audience-title">Support for individuals and businesses</h2>
        <div className="home-audience-cards">
          <article className="home-audience-card">
            <div
              className="home-audience-illustration home-individual-illustration"
              role="img"
              aria-label="Person reviewing a low credit score report">
              <img
                className="worry-image"
                src='/worry-man.png'
                alt="A person concerned while checking a low CIBIL score"
              />
            </div>
            <h3>For individuals</h3>
            <p>
              Finding it difficult to get a home loan or car loan? Review your
              CIBIL report, understand possible concerns, and learn about
              responsible steps that may help strengthen your credit profile.
            </p>
            <Link to="/services">Guaranteed Credit Score Improvement <span aria-hidden="true">→</span></Link>
          </article>
          <article className="home-audience-card">
            <div
              className="home-audience-illustration home-business-illustration"
              role="img"
              aria-label="Business reviewing a corporate credit monitoring report"
            >
              <img
                className="worry-image"
                
                src="/business-image.png"
                alt="business impacted due to low CIBIL score"
              />
            </div>
            <h3>For businesses</h3>
            <p>
              Need help understanding a business or corporate loan application?
              Review your CMR (Credit Monitoring Report), identify details that
              may need attention, and understand possible next steps.
            </p>
            <Link to="/services">Explore Business Credit Support <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <section className="open-consultation">
        <div>
          <p className="home-eyebrow">Free credit consultation</p>
          <h2>Personal or business credit concerns? Let’s talk.</h2>
          <p>
            Get guidance on your CIBIL report, loans, or business CMR report.
            Share your concern and our team will help you understand possible next steps.
          </p>
        </div>
        <button
          className="home-services-link"
          onClick={openConsultation}
          type="button">
          <span className="home-consultation-label">Free consultation</span>
          <span>Submit your query—we’re here to help</span>
          <span aria-hidden="true">→</span>
        </button>
      </section>

      {isConsultationOpen && (
        <div
          className="consultation-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              setIsConsultationOpen(false);
            }
          }}>
          <section
            aria-describedby="consultation-description"
            aria-labelledby="consultation-title"
            aria-modal="true"
            className="consultation-dialog"
            role="dialog">
            <div className="consultation-header">
              <div>
                <p className="consultation-eyebrow">Complimentary consultation</p>
                <h2 id="consultation-title">Tell us how we can help</h2>
              </div>
              <button
                aria-label="Close consultation form"
                className="consultation-close"
                disabled={isSubmitting}
                onClick={() => setIsConsultationOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <p className="consultation-description" id="consultation-description">
              Submit your query or describe the credit problem you’re facing.
              Our team is here to help and will reach out to discuss possible
              solutions.
            </p>

            {submissionMessage.startsWith('Thank you!') ? (
              <div className="consultation-success" role="status">
                <span aria-hidden="true">✓</span>
                <h3>Request received</h3>
                <p>{submissionMessage}</p>
                <button
                  className="consultation-submit"
                  onClick={() => setIsConsultationOpen(false)}
                  type="button"
                >
                  Done
                </button>
              </div>
            ) : (
              <form className="consultation-form" onSubmit={handleConsultationSubmit}>
                <label>
                  Full Name
                  <input
                    autoComplete="name"
                    maxLength="80"
                    name="fullName"
                    placeholder="Full name"
                    required
                  />
                </label>
                <div className="consultation-form-row">
                  <label>
                    Mobile number (India)
                    <input
                      autoComplete="tel"
                      maxLength="10"
                      name="mobile"
                      pattern="[6-9][0-9]{9}"
                      placeholder="10-digit mobile number"
                      required
                      type="tel"
                      title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
                    />
                  </label>
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
                </div>
                <label>
                  I’m looking for help as an
                  <select defaultValue="" name="type" required>
                    <option disabled value="">Choose one</option>
                    <option value="Individual">Individual</option>
                    <option value="Business">CMR</option>
                    <option value="Loan">Loan</option>
                  </select>
                </label>
                <label>
                  A few details about your requirements
                  <textarea
                    maxLength="2000"
                    name="requirement"
                    placeholder="Share anything that would help us prepare for your consultation."
                    required
                    rows="3"
                  />
                </label>

                {submissionMessage && (
                  <p className="consultation-error" role="alert">
                    {submissionMessage}
                  </p>
                )}

                <button
                  className="consultation-submit"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? 'Sending request…' : 'Submit query for free consultation'}
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      <section className="review" aria-labelledby="review-title">
        <p className="home-eyebrow">Customer feedback</p>
        <h2 id="review-title">What customers say</h2>
        <div className="review-grid">
          <article className="review-card">
            <p className="review-quote">
              “The team explained my credit report in a way I could understand.”
            </p>
            <p className="review-attribution">Zayed</p>
          </article>
          <article className="review-card">
            <p className="review-quote">
              “I got clear guidance on the steps I could take to improve my credit.”
            </p>
            <p className="review-attribution">Cheteswar</p>
          </article>
          <article className="review-card">
            <p className="review-quote">
              “The process was straightforward, and my questions were answered.”
            </p>
            <p className="review-attribution">Venkatesh</p>
          </article>
          <article className="review-card">
            <p className="review-quote">
              “Helpful advice gave me a better understanding of my credit options.”
            </p>
            <p className="review-attribution">Suman Das</p>
          </article>
        </div>
      </section>

      <section className="home-loan-slider"
        aria-label="Credit goals we can help you explore">
        <h3>Working toward a big financial goal?</h3>
        <div className="home-loan-slider-window">
          <div className="home-loan-slider-track">
            {[0, 1].map((group) => (
              <div
                aria-hidden={group === 1}
                className="home-loan-slider-group"
                key={group}
              >
                {loanGoals.map((goal) => (
                  <article className="home-loan-slide" key={goal.title}>
                    <span aria-hidden="true">{goal.icon}</span>
                    <div>
                      <strong>{goal.title}</strong>
                      <p>{goal.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

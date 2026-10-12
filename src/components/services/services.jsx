import { useState } from 'react';
import './services.css';
import { API_BASE_URL } from '../../config/api.js';

const SERVICES_API_URL = `${API_BASE_URL}/api/v1/create-credit`;

async function getRequestErrorMessage(response) {
  const responseBody = (await response.text()).trim();
  const fallbackMessage = `Request failed (${response.status})`;

  if (!responseBody) return fallbackMessage;
  if (response.headers.get('content-type')?.includes('text/html')) {
    return fallbackMessage;
  }

  try {
    const errorData = JSON.parse(responseBody);
    const apiMessage = errorData?.message ?? errorData?.error ?? errorData?.detail;

    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return `${fallbackMessage}: ${apiMessage.trim()}`;
    }
    if (typeof apiMessage?.message === 'string' && apiMessage.message.trim()) {
      return `${fallbackMessage}: ${apiMessage.message.trim()}`;
    }

    return `${fallbackMessage}: ${JSON.stringify(errorData)}`;
  } catch {
    return `${fallbackMessage}: ${responseBody}`;
  }
}

function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessSupport, setIsBusinessSupport] = useState(false);
  const [isLoanSupport, setIsLoanSupport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const form = event.currentTarget;
      const formData = Object.fromEntries(new FormData(form));
      const requestData = {
        email: formData.email,
        fullName: formData.fullName,
        requirement: formData.requirement,
        mobile: formData.mobile,
        status: 'New',
        type: formData.type,
        city: formData.city,
      };

      if (formData.type === 'Business') {
        requestData.businessName = formData.businessName;
        if (formData.gstin) requestData.gstin = formData.gstin;
      }

      if (formData.pan) requestData.pan = formData.pan;


      const response = await fetch(SERVICES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(await getRequestErrorMessage(response));
      }

      setMessage('Thank you! Your request has been submitted. Our team will reach you soon.');
      form.reset();
    } catch (error) {
      console.error('Credit request failed:', error);
      setMessage(error instanceof Error
        ? error.message.replace(/^Request failed \(500\):\s*/, "")
        : 'We could not submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="services-page">
      <section className="services-intro">
        <p className="services-eyebrow">Credit to Fix</p>
        <h1>Credit support for your next steps</h1>
        <p>
          Straightforward guidance to help individuals and businesses better
          understand their credit information.
        </p>
      </section>

      <section className="services-grid" aria-label="Credit support services">
        <article className="service-card">
          <span className="service-card-icon" aria-hidden="true">01</span>
          <h2>Individual Credit Improvement</h2>
          <p>
            Get personalized support to understand your CIBIL/credit report,
            identify potential issues, and follow appropriate steps toward
            improving your credit profile.
          </p>
          <button
            className="service-button"
            onClick={() => {
              setIsBusinessSupport(false);
              setIsLoanSupport(false);
              setMessage('');
              setIsModalOpen(true);
            }}
            type="button">
            Get Individual Support <span aria-hidden="true">→</span>
          </button>
        </article>

        <article className="service-card">
          <span className="service-card-icon service-card-icon-business" aria-hidden="true">02</span>
          <h2>Business CMR Report</h2>
          <p>
            Get support to understand and review your Commercial Credit
            Information or CMR report, along with related business credit
            information.
          </p>
          <button
            className="service-button service-button-secondary"
            onClick={() => {
              setIsBusinessSupport(true);
              setIsLoanSupport(false);
              setMessage('');
              setIsModalOpen(true);
            }}
            type="button">
            Request Business Report <span aria-hidden="true">→</span>
          </button>
        </article>

        <article className="service-card">
          <span className="service-card-icon service-card-icon-business" aria-hidden="true">03</span>
          <h2>Loan Support</h2>
          <p>
            Get expert support to understand and review your
            loan-related information, credit history, and repayment details.
            We help you identify issues that may affect your loan eligibility
            and provide guidance to improve your overall credit profile.
          </p>
          <button
            className="service-button service-button-secondary"
            onClick={() => {
              setIsBusinessSupport(false);
              setIsLoanSupport(true);
              setMessage('');
              setIsModalOpen(true);
            }}
            type="button">
            Loan <span aria-hidden="true">→</span>
          </button>
        </article>

      </section>

      {isModalOpen && (
        <div
          className="services-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              setIsModalOpen(false);
            }
          }}
        >
          <section
            aria-labelledby="support-title"
            aria-modal="true"
            className="services-modal"
            role="dialog"
          >
            <div className="services-modal-header">
              <div>
                <p className="services-eyebrow">
                  {isBusinessSupport
                    ? 'Business CMR report request'
                    : isLoanSupport
                      ? 'Loan support request'
                      : 'Individual credit support'}
                </p>
                <h2 id="support-title">
                  {isBusinessSupport
                    ? 'Request business credit support'
                    : isLoanSupport
                      ? 'Tell us about your loan support needs'
                      : 'Tell us how we can help'}
                </h2>
              </div>
              <button
                aria-label="Close form"
                className="services-modal-close"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <p className="services-modal-description">
              {isBusinessSupport
                ? 'Share your business details and CMR report requirements. Our team will contact you to discuss the request.'
                : isLoanSupport ?
                  'Share your concern and we’ll get in touch to discuss possible Loan steps.' :
                  'Share your concern and we’ll get in touch to discuss possible cibil steps.'}
            </p>

            <form className="services-form" onSubmit={handleSubmit}>
              {isBusinessSupport ? (
                <>
                  <label>
                    Business / Company name
                    <input autoComplete="organization" maxLength="150" name="businessName" required />
                  </label>
                  <label>
                    Contact person
                    <input autoComplete="name" maxLength="100" name="fullName" required />
                  </label>
                </>
              ) : (
                <label>
                  Name As Per PAN
                  <input autoComplete="name" maxLength="100" name="fullName" required />
                </label>
              )}
              <div className="services-form-row">
                <label htmlFor="mobile">
                  Mobile number
                  <input
                    autoComplete="tel"
                    id="mobile"
                    inputMode="numeric"
                    maxLength="10"
                    name="mobile"
                    pattern="[6-9][0-9]{9}"
                    required
                    title="Enter a 10-digit mobile number starting with 6, 7, 8, or 9."
                    type="tel"
                  />
                </label>
                <label>
                  {isBusinessSupport ? 'Business email' : 'Email'}
                  <input autoComplete="email" maxLength="254" name="email" required type="email" />
                </label>
              </div>
              {isBusinessSupport ? (
                <div className="services-form-row">
                  <label>
                    Company PAN
                    <input
                      autoCapitalize="characters"
                      maxLength="10"
                      name="pan"
                      onChange={(event) => { event.currentTarget.value = event.currentTarget.value.toUpperCase(); }}
                      pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                      title="Enter a valid 10-character PAN, or leave this field blank." required
                    />
                  </label>
                  <label>
                    GSTIN <span className="services-optional">(optional)</span>
                    <input autoCapitalize="characters" maxLength="15" name="gstin" />
                  </label>
                </div>
              ) : (
                <label>
                  PAN Number
                  <input
                    autoCapitalize="characters"
                    maxLength="10"
                    name="pan"
                    onChange={(event) => { event.currentTarget.value = event.currentTarget.value.toUpperCase(); }}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]"
                    title="Enter a valid 10-character PAN, or leave this field blank." required
                  />
                </label>
              )}

              <label>
                City
                <input
                  autoCapitalize="characters"
                  maxLength="10"
                  name="city"
                  onChange={(event) => { event.currentTarget.value = event.currentTarget.value.toUpperCase(); }}
                />
              </label>

              <label>
                {isBusinessSupport ? 'CMR report requirements' : 'Message / Requirement'}
                <textarea
                  maxLength="2000"
                  name="requirement"
                  placeholder={isBusinessSupport
                    ? 'Tell us what business credit or CMR report support you need.'
                    : ''}
                  required
                  rows="4" />
              </label>

              <label>
                <input
                  type="hidden"
                  name="type"
                  value={isBusinessSupport ? 'Business' : isLoanSupport ? 'Loan' : 'Individual'}
                />
              </label>

              {message && (
                <p className={message.startsWith('Thank you') ? 'services-success' : 'services-error'} role="status">
                  {message}
                </p>
              )}

              <button className="service-button services-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Submitting…' : 'Submit request'}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Services;

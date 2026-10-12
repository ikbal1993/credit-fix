import { Link } from 'react-router-dom';
import './about.css';

const supportAreas = [
  {
    title: 'CIBIL Score Understanding',
    description:
      'Understand what your credit score means and which factors may influence it.',
  },
  {
    title: 'Credit Report Review',
    description:
      'Review your credit report and make sense of important account information.',
  },
  {
    title: 'Report Discrepancy Identification',
    description:
      'Look for potentially incorrect, duplicate, outdated, or inconsistent information.',
  },
  {
    title: 'Credit Improvement Guidance',
    description:
      'Explore responsible credit use, repayment habits, and credit utilization.',
  },
  {
    title: 'Dispute Guidance',
    description:
      'Understand the appropriate process for raising concerns about potentially inaccurate information.',
  },
  {
    title: 'Personalized Credit Support',
    description:
      'Get guidance shaped around your individual credit profile and concerns.',
  },
];

const approachSteps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Understand your credit report and what your score represents.',
  },
  {
    number: '02',
    title: 'Identify',
    description: 'Identify report information that may require attention.',
  },
  {
    number: '03',
    title: 'Address',
    description: 'Take appropriate steps to address eligible issues.',
  },
  {
    number: '04',
    title: 'Improve',
    description: 'Build responsible credit habits and monitor your progress.',
  },
];

const reasonsToChooseUs = [
  'Easy-to-understand guidance',
  'Personalized support',
  'Transparent communication',
  'Responsible credit practices',
  'A simple, customer-friendly process',
];

function About() {
  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="about-container about-hero-layout">
          <div className="about-hero-copy">
            <p className="about-eyebrow">About Credit to Fix</p>
            <h1 id="about-hero-title">
              Helping You Understand and Improve Your Credit Profile
            </h1>
            <p>
              Credit to Fix helps individuals understand their credit reports,
              identify potential issues, and get personalized guidance for
              responsible credit improvement.
            </p>
            <Link className="about-button about-button-primary" to="/services">
              Get Credit Support <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            className="about-credit-visual"
            role="img"
            aria-label="Illustration of a credit report being reviewed"
          >
            <div className="about-visual-orbit" />
            <div className="about-report">
              <div className="about-report-top">
                <span className="about-report-icon" aria-hidden="true">+</span>
                <span>YOUR CREDIT PROFILE</span>
                <span className="about-report-status">REVIEW</span>
              </div>
              <div className="about-report-score">
                <span className="about-score-ring" aria-hidden="true">
                  <span>↗</span>
                </span>
                <span>
                  <strong>Understand your report</strong>
                  <small>Start with a clearer picture</small>
                </span>
              </div>
              <div className="about-report-rule" />
              <div className="about-report-row">
                <span className="about-report-check" aria-hidden="true">✓</span>
                <span>Review account details</span>
              </div>
              <div className="about-report-row">
                <span className="about-report-check" aria-hidden="true">✓</span>
                <span>Explore appropriate next steps</span>
              </div>
              <div className="about-report-foot">Guidance for informed decisions</div>
            </div>
            <span className="about-visual-dot about-visual-dot-one" />
            <span className="about-visual-dot about-visual-dot-two" />
          </div>
        </div>
      </section>

      <section className="about-who" aria-labelledby="about-who-title">
        <div className="about-container about-who-layout">
          <div>
            <p className="about-eyebrow">Who we are</p>
            <h2 id="about-who-title">Credit guidance built around clarity</h2>
          </div>
          <div className="about-who-copy">
            <p>
              Credit to Fix is focused on helping people better understand
              their credit information and navigate common credit-report
              concerns. Credit reports can be difficult to interpret, so we
              explain the details and possible next steps in simple language.
            </p>
            <p>
              We believe in transparent communication, personalized customer
              guidance, and responsible credit management. We help you
              understand your options; decisions and changes to credit records
              remain with the relevant bureaus, lenders, and service providers.
            </p>
          </div>
        </div>
      </section>

      <section className="about-support" aria-labelledby="about-support-title">
        <div className="about-container">
          <div className="about-section-heading">
            <p className="about-eyebrow">Personalized credit support</p>
            <h2 id="about-support-title">How We Can Help</h2>
            <p>
              Clear, practical support to help you understand your credit
              profile and decide what to do next.
            </p>
          </div>
          <div className="about-support-grid">
            {supportAreas.map((area, index) => (
              <article className="about-support-card" key={area.title}>
                <span className="about-card-icon" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-approach" aria-labelledby="about-approach-title">
        <div className="about-container">
          <div className="about-section-heading">
            <p className="about-eyebrow">A thoughtful process</p>
            <h2 id="about-approach-title">Our Approach to Credit Improvement</h2>
            <p>
              We help make the path forward easier to understand, one step at a
              time.
            </p>
          </div>
          <ol className="about-steps">
            {approachSteps.map((step) => (
              <li className="about-step" key={step.number}>
                <span className="about-step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="about-why" aria-labelledby="about-why-title">
        <div className="about-container about-why-layout">
          <div className="about-why-copy">
            <p className="about-eyebrow">The Credit to Fix difference</p>
            <h2 id="about-why-title">Support you can understand and trust</h2>
            <p>
              Credit matters are personal. We keep our process approachable,
              explain things clearly, and focus on responsible options for your
              circumstances.
            </p>
          </div>
          <ul className="about-reasons">
            {reasonsToChooseUs.map((reason) => (
              <li key={reason}>
                <span aria-hidden="true">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default About;

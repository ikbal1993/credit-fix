import './contact.css';

const socialLinks = [
  { name: 'Facebook', mark: 'f', url: 'https://www.facebook.com/' },
  { name: 'Instagram', mark: '◎', url: 'https://www.instagram.com/' },
  { name: 'LinkedIn', mark: 'in', url: 'https://www.linkedin.com/' },
];

function Contact() {
  return (
    <main className="contact-page">
      <header className="contact-heading">
        <p className="contact-eyebrow">Credit to Fix</p>
        <h1>Contact Us</h1>
        <p>
          Have questions about your credit profile or our services? Get in
          touch with us and our team will be happy to assist you.
        </p>
      </header>

      <div className="contact-layout">
        <div className="contact-details">
          <section className="contact-info-card" aria-labelledby="contact-info-title">
            <h2 id="contact-info-title">Get in touch</h2>
            <dl className="contact-info-list">
              <div>
                <dt><span aria-hidden="true">☎</span> Mobile</dt>
                <dd>[OFFICIAL MOBILE NUMBER]</dd>
              </div>
              <div>
                <dt><span aria-hidden="true">✉</span> Email</dt>
                <dd>[OFFICIAL EMAIL ADDRESS]</dd>
              </div>
              <div>
                <dt><span aria-hidden="true">⌖</span> Address</dt>
                <dd>HSR Layout, Bengaluru - 560106, Karnataka, India</dd>
              </div>
            </dl>
          </section>

          <section className="contact-social-card" aria-labelledby="contact-social-title">
            <h2 id="contact-social-title">Connect With Us</h2>
            <div className="contact-social-links">
              {socialLinks.map((social) => (
                <a
                  aria-label={social.name}
                  href={social.url}
                  key={social.name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span aria-hidden="true">{social.mark}</span>
                  {social.name}
                </a>
              ))}
            </div>
            <p>Replace these links with your official social media pages.</p>
          </section>
        </div>

      </div>
    </main>
  );
}

export default Contact;

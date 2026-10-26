import { useState } from 'react';

export default function ContactPage({ content }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="section-block page-intro contact-page">
      <div className="section-heading center">
        <span className="kicker">Get in touch</span>
        <h1>{content.contact.title}</h1>
      </div>

      <div className="contact-layout">
        <div className="contact-info panel-box">
          <p>{content.contact.intro}</p>

          <div className="contact-list">
            <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
            {content.contact.phone.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
            ))}
            <span>{content.contact.address}</span>
          </div>

          <div className="social-links">
            {content.social.map((social) => (
              <a key={social.name} href={social.href} target="_blank" rel="noreferrer">
                {social.name}
              </a>
            ))}
          </div>
        </div>

        <div className="contact-form panel-box">
          <h3>{content.contact.formTitle}</h3>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Full name" aria-label="Full name" />
            <input type="email" placeholder="Email" aria-label="Email" />
            <textarea placeholder="Message" aria-label="Message" rows="5" />
            <button type="submit" className="primary-btn full-width">
              {content.contact.submit}
            </button>
            {submitted && <p className="success-note">Your message has been prepared and sent to the outreach team.</p>}
          </form>
        </div>
      </div>

      <div className="map-wrap panel-box">
        <iframe
          title="Org location map"
          src="https://www.google.com/maps?q=Addis%20Ababa,%20Ethiopia&z=12&output=embed"
          loading="lazy"
          allowFullScreen
        />
      </div>
    </section>
  );
}

export default function DonationPage({ content }) {
  return (
    <section className="section-block page-intro donation-page">
      <div className="section-heading center">
        <span className="kicker">Support</span>
        <h1>{content.donate.title}</h1>
      </div>

      <div className="coming-soon-box panel-box">
        <h2>Coming soon</h2>
        <p>{content.donate.message}</p>
        <a href="mailto:info@peaceandlove.org" className="primary-btn">
          Contact for donation support
        </a>
      </div>
    </section>
  );
}

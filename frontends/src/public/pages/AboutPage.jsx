export default function AboutPage({ content }) {
  const objectives = content.about?.objectives || content.about?.pillars || [];

  return (
    <section className="section-block page-intro">
      <div className="section-heading center">
        <span className="kicker">Our story</span>
        <h1>{content.about.title}</h1>
      </div>

      <div className="story-panel">
        <p>{content.about.intro}</p>
      </div>

      <div className="mission-grid">
        <div className="mission-card highlight">
          <h3>{content.about.mission}</h3>
        </div>
        <div className="mission-card">
          <h3>{content.about.vision}</h3>
        </div>
      </div>

      {content.about.reasons?.length > 0 && (
        <section className="about-purpose-section">
          <div className="section-heading">
            <span className="kicker">{content.about.reasonsKicker}</span>
            <h2>{content.about.reasonsTitle}</h2>
          </div>
          <div className="card-grid four-col">
            {content.about.reasons.map((reason, index) => (
              <article key={reason.title} className="info-card compact purpose-card">
                <span className="tag">{index + 1}</span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {objectives.length > 0 && (
        <section className="about-purpose-section">
          <div className="section-heading">
            <span className="kicker">{content.about.purposeKicker}</span>
            <h2>{content.about.purposeTitle}</h2>
          </div>
          <div className="card-grid four-col">
            {objectives.map((item, index) => (
              <article key={item.title || `${item}-${index}`} className="info-card compact purpose-card">
                <span className="tag">{index + 1}</span>
                <h3>{item.title || item}</h3>
                <p>{item.text || item}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

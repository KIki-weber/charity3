import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import heroImage from '../../assets/hero.png';
import {
  getCertificates,
  getImpacts,
  getPrograms,
  getProjects,
  getTeamMembers,
} from '../../services/backendApi';
import PublicMedia from '../components/PublicMedia';
import { getPublicMediaItems } from '../../utils/publicMedia';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
};

function CardDetails({ items }) {
  const details = items.filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '');
  if (details.length === 0) return null;

  return (
    <dl className="card-details">
      {details.map(([label, value]) => (
        <div className="card-detail" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function PurposeCarousel({ items }) {
  const railRef = useRef(null);
  if (items.length === 0) return null;

  return (
    <div className="home-purpose-carousel">
      <div className="home-purpose-rail" ref={railRef}>
        {items.map((item) => (
          <article key={item.title} className="home-purpose-card">
            <span className="home-purpose-mark" aria-hidden="true" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="home-purpose-next"
        aria-label="Show next cards"
        title="Next"
        onClick={() => railRef.current?.scrollBy({
          left: railRef.current.firstElementChild
            ? railRef.current.firstElementChild.getBoundingClientRect().width
              + Number.parseFloat(getComputedStyle(railRef.current).columnGap)
            : railRef.current.clientWidth,
          behavior: 'instant',
        })}
      >
        <span aria-hidden="true">&gt;</span>
      </button>
    </div>
  );
}

export default function HomePage({ content }) {
  const [liveStats, setLiveStats] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [impacts, setImpacts] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        const [programsRes, projectsRes, impactsRes, teamRes, certificatesRes] = await Promise.all([
          getPrograms(),
          getProjects(),
          getImpacts(),
          getTeamMembers(),
          getCertificates(),
        ]);

        if (!isMounted) return;

        const nextPrograms = programsRes.data || [];
        const nextProjects = projectsRes.data || [];
        const nextImpacts = impactsRes.data || [];
        const nextTeamMembers = teamRes.data || [];
        const nextCertificates = certificatesRes.data || [];

        setPrograms(nextPrograms);
        setProjects(nextProjects);
        setImpacts(nextImpacts);
        setTeamMembers(nextTeamMembers);
        setCertificates(nextCertificates);

        setLiveStats([
          { label: content.nav.programs, value: String(nextPrograms.length) },
          { label: content.nav.projects, value: String(nextProjects.length) },
          { label: content.nav.impact, value: String(nextImpacts.length) },
          { label: content.nav.team, value: String(nextTeamMembers.length) },
          { label: content.nav.certificates, value: String(nextCertificates.length) },
        ]);
      } catch {
        if (isMounted) {
          setPrograms([]);
          setProjects([]);
          setImpacts([]);
          setTeamMembers([]);
          setCertificates([]);
          setLiveStats([]);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, [content.nav.certificates, content.nav.impact, content.nav.programs, content.nav.projects, content.nav.team]);

  const stats = liveStats.length > 0 ? liveStats : content.home.stats;

  return (
    <div className="home-page">
      <section id="home" className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">{content.home.eyebrow}</span>
          <h1>{content.home.title}</h1>
          <p>{content.home.description}</p>
          <div className="hero-actions">
            <Link to="/donate" className="primary-btn">{content.home.primaryAction}</Link>
            <button type="button" className="secondary-btn" onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}>
              {content.home.secondaryAction}
            </button>
          </div>
          <div className="stat-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-box home-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img src={heroImage} alt="Peace & Love Development Organization" />
            <span className="hero-image-glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section id="about" className="section-block">
        <div className="section-heading">
          <span className="kicker">Mission</span>
          <h2>{content.about.title}</h2>
        </div>
        <div className="story-panel">
          <p>{content.about.intro}</p>
        </div>
        <div className="mission-grid">
          <div className="mission-card highlight home-feature-card">
            <h3>{content.about.mission}</h3>
          </div>
          <div className="mission-card home-feature-card">
            <h3>{content.about.vision}</h3>
          </div>
        </div>
      </section>

      <section id="purpose" className="section-block">
        <div className="section-heading center">
          <span className="kicker">{content.about.reasonsKicker}</span>
          <h2>{content.about.reasonsTitle}</h2>
        </div>
        <PurposeCarousel items={content.about.reasons || []} />
        <div className="section-heading center purpose-objectives-heading">
          <span className="kicker">{content.about.purposeKicker}</span>
          <h2>{content.about.purposeTitle}</h2>
        </div>
        <PurposeCarousel items={content.about.objectives || []} />
      </section>

      <section id="programs" className="section-block">
        <div className="section-heading center">
          <span className="kicker">Programs</span>
          <h2>{content.nav.programs}</h2>
        </div>
        <div className="card-grid three-col">
          {(programs.length > 0 ? programs : content.programs || []).slice(0, 6).map((program) => (
            <div key={program.id || program.programName || program.title || program.name} className="info-card home-media-card home-showcase-card program-card">
              <div className="home-showcase-visual">
                <PublicMedia record={program} title={program.programName || program.title || program.name || 'Program'} />
                <span className="tag home-showcase-badge">{program.status || program.type || 'Program'}</span>
              </div>
              <div className="home-showcase-body">
                <h3>{program.programName || program.title || program.name}</h3>
                <p>{program.description || program.text}</p>
                <CardDetails items={[
                  ['Community', program.communityLocation || program.location],
                  ['Start date', formatDate(program.startDate)],
                ]} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="section-block">
        <div className="section-heading center">
          <span className="kicker">Highlights</span>
          <h2>{content.nav.projects}</h2>
        </div>
        <div className="card-grid three-col">
          {(projects.length > 0 ? projects : content.projects || []).slice(0, 6).map((project) => (
            <div key={project.id || project.projectName || project.title || project.name} className="info-card home-media-card home-showcase-card project-card">
              <div className="home-showcase-visual">
                <PublicMedia record={project} title={project.projectName || project.title || project.name || 'Project'} />
                <span className="meta home-showcase-badge">{project.locationCommunity || project.location || 'Community project'}</span>
              </div>
              <div className="home-showcase-body">
                <h3>{project.projectName || project.title || project.name}</h3>
                <p>{project.description || project.text}</p>
                <CardDetails items={[
                  ['Program ID', project.programId],
                  ['Community', project.locationCommunity || project.location],
                  ['Status', project.status],
                  ['Start date', formatDate(project.startDate)],
                  ['End date', formatDate(project.endDate)],
                ]} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="impact" className="section-block">
        <div className="section-heading center">
          <span className="kicker">Results</span>
          <h2>{content.impact.title}</h2>
        </div>
        <div className="story-panel">
          <p>{content.impact.intro}</p>
        </div>
        <div className="card-grid three-col">
          {(impacts.length > 0 ? impacts : content.impacts || []).slice(0, 6).map((impact) => (
            <div key={impact.id || impact.storyTitle || impact.title || impact.name} className="info-card home-media-card home-showcase-card impact-card">
              <div className="home-showcase-visual">
                <PublicMedia record={impact} title={impact.storyTitle || impact.title || impact.name || 'Impact story'} />
                <span className="tag home-showcase-badge">Impact story</span>
              </div>
              <div className="home-showcase-body">
                <h3>{impact.storyTitle || impact.title || impact.name}</h3>
                <p>{impact.description || impact.text}</p>
                <CardDetails items={[
                  ['Community', impact.beneficiaryOrCommunity],
                  ['Related program or project', impact.relatedProgramOrProject],
                  ['Date', formatDate(impact.date)],
                  ['Results', impact.resultsAchievements || impact.outcome],
                ]} />
                <Link to="/donate" className="primary-btn impact-donate-btn">Donate to support our work</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="team" className="section-block">
        <div className="section-heading center">
          <span className="kicker">People</span>
          <h2>{content.team.title}</h2>
        </div>
        <div className="story-panel">
          <p>{content.team.intro}</p>
        </div>
        <div className="card-grid three-col">
          {(teamMembers.length > 0 ? teamMembers : content.teamMembers || []).slice(0, 6).map((member) => {
            const memberName = member.name || member.fullName || 'Team member';
            const memberPhone = member.phone || member.phoneNumber || member.phone_number || member.mobile;
            const memberPhoto = getPublicMediaItems(member).find((media) => media.kind === 'image');

            return (
              <div key={member.id || member.name || member.fullName} className="info-card home-media-card home-showcase-card team-card home-team-card">
                <div className="home-showcase-visual home-showcase-team-visual">
                  <span className="tag home-showcase-badge">Our team</span>
                  <div className="home-team-photo-frame">
                    {memberPhoto ? (
                      <img
                        src={memberPhoto.url}
                        alt={`${memberName} portrait`}
                        className="home-team-photo"
                        loading="lazy"
                      />
                    ) : (
                      <div className="avatar-circle home-team-avatar" aria-hidden="true">
                        {memberName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="home-showcase-body">
                  <h3>{memberName}</h3>
                  <p>{member.field || member.role}</p>
                  {memberPhone && (
                    <p className="team-phone">
                      <a
                        href={`tel:${String(memberPhone).replace(/[^\d+]/g, '')}`}
                        className="inline-link"
                      >
                        {memberPhone}
                      </a>
                    </p>
                  )}
                  <CardDetails items={[
                    ['City', member.city],
                    ['Country', member.country],
                    ['Experience', member.years !== null && member.years !== undefined && member.years !== '' ? `${member.years} ${Number(member.years) === 1 ? 'year' : 'years'}` : ''],
                  ]} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="certificates" className="section-block">
        <div className="section-heading center">
          <span className="kicker">Accountability</span>
          <h2>{content.certificates.title}</h2>
        </div>
        <div className="story-panel">
          <p>{content.certificates.intro}</p>
        </div>
        <div className="card-grid three-col">
          {(certificates.length > 0 ? certificates : content.certificateList || []).slice(0, 6).map((certificate) => (
            <div key={certificate.id || certificate.organizationName || certificate.title || certificate.name} className="info-card home-media-card certificate-card">
              <span className="tag">{certificate.legalStatus || certificate.type || 'Official'}</span>
              <PublicMedia record={certificate} title={certificate.organizationName || certificate.title || certificate.name || 'Certificate'} />
              <h3>{certificate.organizationName || certificate.title || certificate.name}</h3>
              <CardDetails items={[
                ['Registration number', certificate.registrationNumber],
                ['Issuing authority', certificate.issuingGovernmentAuthority],
                ['Certificate number', certificate.certificateLicenseNumber],
                ['Registered', formatDate(certificate.registrationDate)],
                ['Issued', formatDate(certificate.certificateIssueDate)],
                ['Expires', formatDate(certificate.certificateExpiryDate)],
                ['Last verified', formatDate(certificate.lastVerifiedDate)],
                ['Official address', certificate.officialAddress],
              ]} />
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="section-block">
        <div className="section-heading center">
          <span className="kicker">Talk to us</span>
          <h2>{content.contact.title}</h2>
        </div>
        <div className="contact-layout">
          <div className="panel-box">
            <p>{content.contact.intro}</p>
            <div className="contact-list">
              <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
              {content.contact.phone.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
              ))}
              <span>{content.contact.address}</span>
            </div>
          </div>
          <div className="panel-box contact-form">
            <h3>{content.contact.formTitle}</h3>
            <form>
              <input type="text" placeholder="Full name" />
              <input type="email" placeholder="Email" />
              <textarea rows="4" placeholder="Message" />
              <button type="submit" className="primary-btn">{content.contact.submit}</button>
            </form>
          </div>
        </div>
      </section>

      <section id="donate" className="section-block">
        <div className="coming-soon-box">
          <span className="kicker">Support</span>
          <h2>{content.donate.title}</h2>
          <p>{content.donate.message}</p>
          <Link to="/donate" className="primary-btn">{content.home.primaryAction}</Link>
        </div>
      </section>
    </div>
  );
}


import { useCallback, useEffect, useState } from 'react';
import { getTeamMembers } from '../../services/backendApi';
import { getPublicMediaItems } from '../../utils/publicMedia';

/**
 * Read arrays returned in common API response formats.
 * Adapt this function if your backend uses another format.
 */
const extractTeamMembers = (response) => {
  const candidates = [
    response?.data,
    response?.data?.data,
    response?.data?.teamMembers,
    response?.data?.items,
    response?.teamMembers,
    response?.items,
  ];

  const members = candidates.find(Array.isArray);

  if (members) return members;

  if (Array.isArray(response)) return response;

  throw new Error(
    'The team API did not return a recognizable list of members.'
  );
};

const getMemberName = (member) =>
  member?.name || member?.fullName || 'Team member';

const getMemberPhone = (member) => {
  const value =
    member?.phone ??
    member?.phoneNumber ??
    member?.phone_number ??
    member?.mobile;
  const phone = typeof value === 'object' ? value?.number : value;

  return typeof phone === 'string' || typeof phone === 'number'
    ? String(phone).trim()
    : '';
};

function TeamPhoto({ memberName, image, imageIndex }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="avatar-circle team-avatar" role="img" aria-label={`${memberName} photo unavailable`}>
        {memberName.charAt(0).toUpperCase() || 'T'}
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={`${memberName} photo ${imageIndex + 1}`}
      className="team-photo"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function TeamPage({ content = {} }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [showAllMembers, setShowAllMembers] = useState(false);

  const fetchTeamMembers = useCallback(async () => {
    const response = await getTeamMembers();
    return extractTeamMembers(response);
  }, []);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      setTeamMembers(await fetchTeamMembers());
    } catch (err) {
      console.error('Failed to load team members:', err);

      setTeamMembers([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to load team members. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [fetchTeamMembers]);

  useEffect(() => {
    let isMounted = true;

    fetchTeamMembers()
      .then((members) => {
        if (isMounted) {
          setTeamMembers(members);
        }
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }

        console.error('Failed to load team members:', err);
        setTeamMembers([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Unable to load team members. Please try again.'
        );
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchTeamMembers]);

  const pageCount = Math.ceil(teamMembers.length / 3);

  useEffect(() => {
    if (showAllMembers || pageCount <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setPageIndex((currentPage) => (currentPage + 1) % pageCount);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [pageCount, showAllMembers]);

  const teamContent = content?.team || {};
  const visibleMembers = showAllMembers
    ? teamMembers
    : teamMembers.slice(pageIndex * 3, pageIndex * 3 + 3);

  return (
    <section className="section-block page-intro">
      <div className="section-heading center">
        <span className="kicker">People</span>

        <h1>{teamContent.title || 'Our Team'}</h1>
      </div>

      {teamContent.intro && (
        <div className="story-panel">
          <p>{teamContent.intro}</p>
        </div>
      )}

      {loading ? (
        <div className="panel-box" role="status">
          Loading team members...
        </div>
      ) : error ? (
        <div className="panel-box" role="alert">
          <p>{error}</p>

          <button
            type="button"
            className="primary-btn"
            onClick={loadTeam}
          >
            Try again
          </button>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="panel-box">
          No team members are available yet.
        </div>
      ) : (
        <>
          <div
            className={`card-grid team-cards-grid${showAllMembers ? ' all-members' : ''}`}
            aria-live="polite"
          >
            {visibleMembers.map((member, index) => {
              const memberId = member?.id ?? `team-member-${index}`;
              const memberName = getMemberName(member);
              const memberField =
                member?.field || member?.role || 'Team member';
              const memberCountry = member?.country || '';
              const memberCity = member?.city || '';
              const years = member?.years;
              const phone = getMemberPhone(member);
              const phoneHref = phone.replace(/[^\d+]/g, '');
              const mediaItems = getPublicMediaItems(member);

              const images = mediaItems.filter(
                (item) => item.kind === 'image'
              );

              const videos = mediaItems.filter(
                (item) => item.kind === 'video'
              );

              const documents = mediaItems.filter(
                (item) => item.kind === 'document'
              );

              return (
                <article
                  key={memberId}
                  className="info-card team-card"
                >
                  <div className="team-photo-frame">
                    {images.length > 0 ? (
                      <TeamPhoto
                        memberName={memberName}
                        image={images[0]}
                        imageIndex={0}
                      />
                    ) : (
                      <div className="avatar-circle team-avatar">
                        {memberName.charAt(0).toUpperCase() || 'T'}
                      </div>
                    )}
                  </div>

                  <h3>{memberName}</h3>

                  <p>{memberField}</p>

                  {(memberCountry || memberCity) && (
                    <p className="team-location">
                      {[memberCity, memberCountry]
                        .filter(Boolean)
                        .join(' • ')}
                    </p>
                  )}

                  {years !== null &&
                    years !== undefined &&
                    years !== '' &&
                    Number.isFinite(Number(years)) && (
                      <p className="team-experience">
                        {Number(years)}{' '}
                        {Number(years) === 1 ? 'year' : 'years'} of
                        experience
                      </p>
                    )}

                  {phone && (
                    <p className="team-phone">
                      <a href={`tel:${phoneHref}`} className="inline-link">
                        {phone}
                      </a>
                    </p>
                  )}

                  {videos.length > 0 && (
                    <div className="team-videos">
                      <h4>Videos</h4>

                      {videos.map((video) => (
                        <video
                          key={`${memberId}-video-${video.key}`}
                          src={video.url}
                          controls
                          preload="metadata"
                          className="media-thumb"
                          aria-label={`${memberName} video`}
                        >
                          Your browser does not support video playback.
                        </video>
                      ))}
                    </div>
                  )}

                  {documents.length > 0 && (
                    <div className="team-documents">
                      <h4>Documents and files</h4>

                      <ul>
                        {documents.map((document, documentIndex) => (
                          <li key={`${memberId}-file-${document.key}`}>
                            <a
                              href={document.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-link"
                            >
                              Open document {documentIndex + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {teamMembers.length > 0 && (
            <div className="team-controls">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setPageIndex(0);
                  setShowAllMembers((showingAll) => !showingAll);
                }}
              >
                {showAllMembers ? 'Show featured members' : 'See all members'}
              </button>

              {teamMembers.length > 3 && !showAllMembers && (
                <div className="team-page-controls">
                  <span>
                    Group {pageIndex + 1} of {pageCount}
                  </span>
                  <button
                    type="button"
                    className="secondary-btn team-next-button"
                    onClick={() =>
                      setPageIndex((currentPage) =>
                        (currentPage + 1) % pageCount
                      )
                    }
                    aria-label="Show next team members"
                  >
                    Next members <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

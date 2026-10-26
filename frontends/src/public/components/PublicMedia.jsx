import { getPublicMediaItems } from '../../utils/publicMedia';

export default function PublicMedia({ record, title }) {
  const mediaItems = getPublicMediaItems(record);
  if (mediaItems.length === 0) return null;

  return (
    <div className="media-stack">
      {mediaItems.map((media, index) => {
        const label = `${title} media ${index + 1}`;

        if (media.kind === 'video') {
          return (
            <video
              key={media.key}
              src={media.url}
              controls
              preload="metadata"
              className="media-thumb"
              aria-label={label}
            >
              Your browser does not support video playback.
            </video>
          );
        }

        if (media.kind === 'image') {
          return (
            <img
              key={media.key}
              src={media.url}
              alt={label}
              className="media-thumb"
              loading="lazy"
            />
          );
        }

        return (
          <a
            key={media.key}
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Open {label.toLowerCase()}
          </a>
        );
      })}
    </div>
  );
}

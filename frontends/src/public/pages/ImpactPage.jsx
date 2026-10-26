import { useEffect, useState } from 'react';

import { getImpacts } from '../../services/backendApi';
import PublicMedia from '../components/PublicMedia';

export default function ImpactPage({ content }) {
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadImpacts = async () => {
      try {
        const response = await getImpacts();
        if (!Array.isArray(response.data)) {
          throw new Error('The impact stories API did not return a list.');
        }
        setImpacts(response.data);
      } catch (loadError) {
        console.error('Failed to load impact stories:', loadError);
        setImpacts([]);
        setError(loadError?.response?.data?.message || loadError.message || 'Unable to load impact stories.');
      } finally {
        setLoading(false);
      }
    };

    loadImpacts();
  }, []);

  return (
    <section className="section-block page-intro">
      <div className="section-heading center">
        <span className="kicker">Results</span>
        <h1>{content.impact.title}</h1>
      </div>

      <div className="story-panel">
        <p>{content.impact.intro}</p>
      </div>

      {loading ? (
        <div className="panel-box" role="status">Loading impact stories...</div>
      ) : error ? (
        <div className="panel-box" role="alert">{error}</div>
      ) : (
        <div className="card-grid three-col">
          {impacts.map((impact) => {
            const impactTitle = impact?.storyTitle || impact?.title || 'Impact story';
            const impactDescription = impact?.description || impact?.text || '';
            const impactResults = impact?.resultsAchievements || impact?.outcome || '';

            return (
              <div key={impact.id} className="info-card impact-card">
                <PublicMedia record={impact} title={impactTitle} />
                <h3>{impactTitle}</h3>
                {impactDescription && <p>{impactDescription}</p>}
                {impactResults && <small>{impactResults}</small>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from 'react';

import { getPrograms } from '../../services/backendApi';
import PublicMedia from '../components/PublicMedia';

export default function ProgramsPage({ content }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const response = await getPrograms();
        if (!Array.isArray(response.data)) {
          throw new Error('The programs API did not return a list.');
        }
        setPrograms(response.data);
      } catch (loadError) {
        console.error('Failed to load programs:', loadError);
        setPrograms([]);
        setError(loadError?.response?.data?.message || loadError.message || 'Unable to load programs.');
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  return (
    <section className="section-block page-intro">
      <div className="section-heading center">
        <span className="kicker">Program portfolio</span>
        <h1>{content.nav.programs}</h1>
      </div>

      {loading ? (
        <div className="panel-box" role="status">Loading programs...</div>
      ) : error ? (
        <div className="panel-box" role="alert">{error}</div>
      ) : (
        <div className="card-grid three-col">
          {programs.map((program) => {
            const programName = program?.programName || program?.title || 'Program';
            const programDescription = program?.description || program?.text || '';

            return (
              <div key={program.id} className="info-card program-card">
                <span className="tag">{program?.status || 'Active'}</span>
                <PublicMedia record={program} title={programName} />
                <h3>{programName}</h3>
                {programDescription && <p>{programDescription}</p>}
                {program?.communityLocation && <small>{program.communityLocation}</small>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

import { useEffect, useState } from 'react';

import { getProjects } from '../../services/backendApi';
import PublicMedia from '../components/PublicMedia';

export default function ProjectsPage({ content }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await getProjects();
        if (!Array.isArray(response.data)) {
          throw new Error('The projects API did not return a list.');
        }
        setProjects(response.data);
      } catch (loadError) {
        console.error('Failed to load projects:', loadError);
        setProjects([]);
        setError(loadError?.response?.data?.message || loadError.message || 'Unable to load projects.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <section className="section-block page-intro">
      <div className="section-heading center">
        <span className="kicker">Highlights</span>
        <h1>{content.nav.projects}</h1>
      </div>

      {loading ? (
        <div className="panel-box" role="status">Loading projects...</div>
      ) : error ? (
        <div className="panel-box" role="alert">{error}</div>
      ) : (
        <div className="card-grid three-col">
          {projects.map((project) => {
            const projectName = project?.projectName || project?.title || 'Project';
            const projectLocation = project?.locationCommunity || project?.location || 'Community project';
            const projectDescription = project?.description || project?.text || '';

            return (
              <div key={project.id} className="info-card project-card">
                <span className="meta">{projectLocation}</span>
                <PublicMedia record={project} title={projectName} />
                <h3>{projectName}</h3>
                {projectDescription && <p>{projectDescription}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

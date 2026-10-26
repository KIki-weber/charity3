import { useEffect, useState } from 'react';

import { getCertificates } from '../../services/backendApi';
import PublicMedia from '../components/PublicMedia';

export default function CertificatesPage({ content }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const response = await getCertificates();
        if (!Array.isArray(response.data)) {
          throw new Error('The certificates API did not return a list.');
        }
        setCertificates(response.data);
      } catch (loadError) {
        console.error('Failed to load certificates:', loadError);
        setCertificates([]);
        setError(loadError?.response?.data?.message || loadError.message || 'Unable to load certificates.');
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  return (
    <section className="section-block page-intro">
      <div className="section-heading center">
        <span className="kicker">Accountability</span>
        <h1>{content.certificates.title}</h1>
      </div>

      <div className="story-panel">
        <p>{content.certificates.intro}</p>
      </div>

      {loading ? (
        <div className="panel-box" role="status">Loading certificates...</div>
      ) : error ? (
        <div className="panel-box" role="alert">{error}</div>
      ) : (
        <div className="card-grid three-col">
          {certificates.map((certificate) => {
            const certificateName = certificate?.organizationName || certificate?.title || 'Certificate';
            const certificateLicense = certificate?.certificateLicenseNumber || certificate?.licenseNumber || '';

            return (
              <div key={certificate.id} className="info-card certificate-card">
                <span className="tag">{certificate?.legalStatus || 'Official'}</span>
                <PublicMedia record={certificate} title={certificateName} />
                <h3>{certificateName}</h3>
                {certificateLicense && <p>{certificateLicense}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

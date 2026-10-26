import { getAdminMediaPreview, normalizeMediaValues } from '../../utils/adminMedia';

export default function CertificatesAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  const isEditing = Boolean(formData?.id);
  const photoItems = normalizeMediaValues(formData?.photos);
  const fileItems = normalizeMediaValues(formData?.files);

  const appendSelectedFiles = (event, field, existingItems, maximum) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setFormData({
      ...formData,
      [field]: [...existingItems, ...selectedFiles].slice(0, maximum),
    });
    event.target.value = '';
  };

  const removeItem = (field, existingItems, index) => {
    setFormData({
      ...formData,
      [field]: existingItems.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  return (
    <div className="admin-panel panel-box">
      <h3>Certificates</h3>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No certificates created yet.</div>
        ) : (
          [...items].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)).map((certificate) => {
            const photo = normalizeMediaValues(certificate.photos)[0];
            const preview = getAdminMediaPreview(photo);
            return (
              <div key={certificate.id} className="admin-item-row">
                <div className="admin-item-main">
                  {preview?.kind === 'image' ? (
                    <img src={preview.url} alt={certificate.organizationName || 'Certificate preview'} className="admin-item-thumb" />
                  ) : (
                    <div className="admin-item-thumb empty-thumb">IMG</div>
                  )}
                  <div>
                    <strong>{certificate.organizationName || 'Certificate'}</strong>
                    <small>{certificate.certificateLicenseNumber || 'License not set'}</small>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => onEdit?.(certificate)}>Edit</button>
                  <button type="button" className="danger" onClick={() => onDelete?.(certificate.id, token)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-form-grid">
        <input value={formData.organizationName || ''} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} placeholder="Organization name" />
        <input value={formData.registrationNumber || ''} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} placeholder="Registration number" />
        <input value={formData.issuingGovernmentAuthority || ''} onChange={(e) => setFormData({ ...formData, issuingGovernmentAuthority: e.target.value })} placeholder="Issuing authority" />
        <input value={formData.legalStatus || ''} onChange={(e) => setFormData({ ...formData, legalStatus: e.target.value })} placeholder="Legal status" />
        <input value={formData.certificateLicenseNumber || ''} onChange={(e) => setFormData({ ...formData, certificateLicenseNumber: e.target.value })} placeholder="License number" />
        <input type="date" value={formData.registrationDate || ''} onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })} />
        <input type="date" value={formData.certificateIssueDate || ''} onChange={(e) => setFormData({ ...formData, certificateIssueDate: e.target.value })} />
        <input type="date" value={formData.certificateExpiryDate || ''} onChange={(e) => setFormData({ ...formData, certificateExpiryDate: e.target.value })} />
      </div>
      <textarea value={formData.officialAddress || ''} onChange={(e) => setFormData({ ...formData, officialAddress: e.target.value })} placeholder="Official address" rows="3" />

      <div className="admin-form-grid">
        <div>
          <label htmlFor="certificate-photos">Certificate photos (up to 10)</label>
          <input
            id="certificate-photos"
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.jfif"
            multiple
            onChange={(event) => appendSelectedFiles(event, 'photos', photoItems, 10)}
          />
        </div>
        <div>
          <label htmlFor="certificate-files">Certificate files (up to 10)</label>
          <input
            id="certificate-files"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf"
            multiple
            onChange={(event) => appendSelectedFiles(event, 'files', fileItems, 10)}
          />
        </div>
      </div>

      {photoItems.length > 0 && (
        <div className="admin-gallery-preview">
          {photoItems.map((photo, index) => {
            const preview = getAdminMediaPreview(photo);
            return (
              <div key={`${index}-${typeof photo === 'string' ? photo : photo.name}`} className="admin-gallery-item">
                {preview?.kind === 'image' && <img src={preview.url} alt={`Certificate photo ${index + 1}`} />}
                <button type="button" onClick={() => removeItem('photos', photoItems, index)}>Remove</button>
              </div>
            );
          })}
        </div>
      )}

      {fileItems.length > 0 && (
        <ul className="admin-file-list">
          {fileItems.map((file, index) => {
            const preview = getAdminMediaPreview(file);
            const label = file instanceof File ? file.name : `Certificate file ${index + 1}`;
            return (
              <li key={`${index}-${label}`}>
                <a href={preview?.url} target="_blank" rel="noopener noreferrer" className="inline-link">{label}</a>
                <button type="button" onClick={() => removeItem('files', fileItems, index)}>Remove</button>
              </li>
            );
          })}
        </ul>
      )}

      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : isEditing ? 'Update certificate' : 'Save certificate'}
      </button>
    </div>
  );
}

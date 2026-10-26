import { toApiUrl } from '../utils/apiUrl';

const normalizeGalleryItems = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeGalleryItems(entry));
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return normalizeGalleryItems(parsed);
    } catch {
      return value ? [value] : [];
    }
  }

  return [value].filter((item) => item !== null && item !== undefined && item !== '');
};

const getMediaPreview = (item) => {
  const gallery = normalizeGalleryItems(item?.photos);
  const primary = gallery[0] || item?.photo || item?.video || item?.file;
  return primary ? toApiUrl(primary) : '';
};

export default function CertificatesAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  const galleryItems = normalizeGalleryItems(formData?.photos);

  const handlePhotoSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) {
      return;
    }

    const nextItems = [...galleryItems, ...selectedFiles].slice(0, 7);
    setFormData({ ...formData, photos: nextItems });
    event.target.value = '';
  };

  const removePhoto = (index) => {
    setFormData({
      ...formData,
      photos: galleryItems.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  return (
    <div className="admin-panel panel-box">
      <h3>Certificates</h3>
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
          <label>Photo</label>
          <input type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp" onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || formData.photo })} />
        </div>
        <div>
          <label>Gallery photos (3-7)</label>
          <input type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp" multiple onChange={handlePhotoSelection} />
        </div>
        <div>
          <label>Video</label>
          <input type="file" accept="video/*,.mp4,.mov,.avi,.mkv,.webm" onChange={(e) => setFormData({ ...formData, video: e.target.files?.[0] || formData.video })} />
        </div>
        <div>
          <label>Document / file</label>
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,video/*" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || formData.file })} />
        </div>
      </div>

      {galleryItems.length > 0 && (
        <div className="admin-gallery-preview">
          {galleryItems.map((photo, index) => {
            const previewUrl = photo instanceof File ? URL.createObjectURL(photo) : toApiUrl(photo);
            return (
              <div key={`${index}-${typeof photo === 'string' ? photo : photo.name}`} className="admin-gallery-item">
                <img src={previewUrl} alt={`Gallery preview ${index + 1}`} />
                <button type="button" onClick={() => removePhoto(index)}>Cancel</button>
              </div>
            );
          })}
        </div>
      )}

      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save certificate'}
      </button>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No certificates created yet.</div>
        ) : (
          items.map((certificate) => {
            const previewUrl = getMediaPreview(certificate);
            return (
              <div key={certificate.id} className="admin-item-row">
                <div className="admin-item-main">
                  {previewUrl ? (
                    <img src={previewUrl} alt={certificate.organizationName || 'Certificate preview'} className="admin-item-thumb" />
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
    </div>
  );
}

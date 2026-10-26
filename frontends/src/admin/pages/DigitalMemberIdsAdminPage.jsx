import { toApiUrl } from '../../utils/apiUrl';

const normalizeGalleryItems = (value) => {
  if (!value) return [];

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

export default function DigitalMemberIdsAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  const isEditing = Boolean(formData?.id);
  const galleryItems = normalizeGalleryItems(formData?.photos);

  const handlePhotoSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    const nextItems = [...galleryItems, ...selectedFiles].slice(0, 7);
    setFormData({ ...formData, photos: nextItems });
    event.target.value = '';
  };

  const removePhoto = (index) => {
    setFormData({ ...formData, photos: galleryItems.filter((_, itemIndex) => itemIndex !== index) });
  };

  const renderExistingMedia = (label, value, onRemove) => {
    if (!value) return null;

    const previewUrl = value instanceof File ? URL.createObjectURL(value) : toApiUrl(value);
    const lowerValue = String(previewUrl).toLowerCase();
    const isVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(lowerValue) || lowerValue.includes('video');

    return (
      <div className="admin-media-preview">
        <span className="admin-media-preview-label">{label}</span>
        {isVideo ? <video src={previewUrl} controls className="admin-existing-media" /> : <img src={previewUrl} alt={label} className="admin-existing-media" />}
        <button type="button" onClick={onRemove}>Remove current</button>
      </div>
    );
  };

  return (
    <div className="admin-panel panel-box">
      <h3>Digital member IDs</h3>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No digital IDs added yet.</div>
        ) : (
          [...items].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)).map((digitalId) => {
            const previewUrl = getMediaPreview(digitalId);
            return (
              <div key={digitalId.id} className="admin-item-row">
                <div className="admin-item-main">
                  {previewUrl ? <img src={previewUrl} alt={digitalId.fullName || 'Digital ID preview'} className="admin-item-thumb" /> : <div className="admin-item-thumb empty-thumb">IMG</div>}
                  <div>
                    <strong>{digitalId.fullName || 'Member'}</strong>
                    <small>{digitalId.memberId || 'ID not set'}</small>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => onEdit?.(digitalId)}>Edit</button>
                  <button type="button" className="danger" onClick={() => onDelete?.(digitalId.id, token)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-form-grid">
        <input value={formData.memberId || ''} onChange={(e) => setFormData({ ...formData, memberId: e.target.value })} placeholder="Member ID" />
        <input value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Full name" />
        <input value={formData.country || ''} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
        <input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" />
        <input value={formData.department || ''} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="Department" />
        <input value={formData.organizationName || ''} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} placeholder="Organization name" />
        <input value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
        <input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" />
        <input type="date" value={formData.issueDate || ''} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} />
        <input type="date" value={formData.expiryDate || ''} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
      </div>
      <textarea value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" rows="3" />
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

      {(formData.photo || formData.video || formData.file) && (
        <div className="admin-media-preview-stack">
          {renderExistingMedia('Current photo', formData.photo, () => setFormData({ ...formData, photo: '' }))}
          {renderExistingMedia('Current video', formData.video, () => setFormData({ ...formData, video: '' }))}
          {renderExistingMedia('Current file', formData.file, () => setFormData({ ...formData, file: '' }))}
        </div>
      )}

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
        {saving ? 'Saving...' : isEditing ? 'Update digital ID' : 'Save digital ID'}
      </button>
    </div>
  );
}

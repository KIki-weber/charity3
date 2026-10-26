import { getAdminMediaPreview, normalizeMediaValues } from '../../utils/adminMedia';

export default function ProjectsAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  const isEditing = Boolean(formData?.id);
  const galleryItems = normalizeMediaValues(formData?.photos);

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

  const renderExistingMedia = (label, value, onRemove) => {
    if (!value) {
      return null;
    }

    const media = getAdminMediaPreview(value);
    if (!media) return null;

    return (
      <div className="admin-media-preview">
        <span className="admin-media-preview-label">{label}</span>
        {media.kind === 'video' ? <video src={media.url} controls className="admin-existing-media" /> : media.kind === 'image' ? <img src={media.url} alt={label} className="admin-existing-media" /> : <a href={media.url} target="_blank" rel="noopener noreferrer" className="inline-link">Open file</a>}
        <button type="button" onClick={onRemove}>Remove current</button>
      </div>
    );
  };

  return (
    <div className="admin-panel panel-box">
      <h3>Projects</h3>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No projects added yet.</div>
        ) : (
          [...items].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)).map((project) => {
            const preview = getAdminMediaPreview(normalizeMediaValues(project.photos)[0] || project.video || project.file);
            return (
              <div key={project.id} className="admin-item-row">
                <div className="admin-item-main">
                  {preview?.kind === 'image' ? (
                    <img src={preview.url} alt={project.projectName || 'Project preview'} className="admin-item-thumb" />
                  ) : (
                    <div className="admin-item-thumb empty-thumb">IMG</div>
                  )}
                  <div>
                    <strong>{project.projectName || 'Project'}</strong>
                    <small>{project.locationCommunity || 'Location not set'}</small>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => onEdit?.(project)}>Edit</button>
                  <button type="button" className="danger" onClick={() => onDelete?.(project.id, token)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-form-grid">
        <input value={formData.projectName || ''} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} placeholder="Project name" />
        <input value={formData.locationCommunity || ''} onChange={(e) => setFormData({ ...formData, locationCommunity: e.target.value })} placeholder="Community location" />
        <input type="date" value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
        <input type="date" value={formData.endDate || ''} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
        <select value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
          <option value="active">Active</option>
          <option value="planned">Planned</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows="4" />
      <div className="admin-form-grid">
        <div>
          <label>Photos (up to 7)</label>
          <input type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.jfif" multiple onChange={handlePhotoSelection} />
        </div>
        <div>
          <label>Video</label>
          <input type="file" accept="video/*,.mp4,.mov,.avi,.mkv,.webm" onChange={(e) => setFormData({ ...formData, video: e.target.files?.[0] || formData.video })} />
        </div>
        <div>
          <label>Document / file</label>
          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf" onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || formData.file })} />
        </div>
      </div>

      {(formData.video || formData.file) && (
        <div className="admin-media-preview-stack">
          {renderExistingMedia('Current video', formData.video, () => setFormData({ ...formData, video: '' }))}
          {renderExistingMedia('Current file', formData.file, () => setFormData({ ...formData, file: '' }))}
        </div>
      )}

      {galleryItems.length > 0 && (
        <div className="admin-gallery-preview">
          {galleryItems.map((photo, index) => {
            const preview = getAdminMediaPreview(photo);
            return (
              <div key={`${index}-${typeof photo === 'string' ? photo : photo.name}`} className="admin-gallery-item">
                {preview?.kind === 'image' && <img src={preview.url} alt={`Photo preview ${index + 1}`} />}
                <button type="button" onClick={() => removePhoto(index)}>Cancel</button>
              </div>
            );
          })}
        </div>
      )}

      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : isEditing ? 'Update project' : 'Save project'}
      </button>
    </div>
  );
}

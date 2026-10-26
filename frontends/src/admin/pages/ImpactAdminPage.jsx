import { getAdminMediaPreview } from '../../utils/adminMedia';

export default function ImpactAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  const isEditing = Boolean(formData?.id);
  const preview = getAdminMediaPreview(formData?.media);

  return (
    <div className="admin-panel panel-box">
      <h3>Impact stories</h3>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No impact stories found.</div>
        ) : (
          [...items].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)).map((impact) => {
            const media = getAdminMediaPreview(impact.media);
            return (
              <div key={impact.id} className="admin-item-row">
                <div className="admin-item-main">
                  {media?.kind === 'image' ? (
                    <img src={media.url} alt={impact.storyTitle || 'Impact preview'} className="admin-item-thumb" />
                  ) : media?.kind === 'video' ? (
                    <video src={media.url} className="admin-item-thumb" muted preload="metadata" />
                  ) : (
                    <div className="admin-item-thumb empty-thumb">IMG</div>
                  )}
                  <div>
                    <strong>{impact.storyTitle || 'Impact story'}</strong>
                    <small>{impact.beneficiaryOrCommunity || 'Community'}</small>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => onEdit?.(impact)}>Edit</button>
                  <button type="button" className="danger" onClick={() => onDelete?.(impact.id, token)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-form-grid">
        <input value={formData.storyTitle || ''} onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })} placeholder="Story title" />
        <input value={formData.beneficiaryOrCommunity || ''} onChange={(e) => setFormData({ ...formData, beneficiaryOrCommunity: e.target.value })} placeholder="Community or beneficiary" />
        <input value={formData.relatedProgramOrProject || ''} onChange={(e) => setFormData({ ...formData, relatedProgramOrProject: e.target.value })} placeholder="Related program or project" />
        <input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
      </div>
      <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows="4" />
      <textarea value={formData.resultsAchievements || ''} onChange={(e) => setFormData({ ...formData, resultsAchievements: e.target.value })} placeholder="Results / achievements" rows="4" />
      <div className="admin-form-grid">
        <div>
          <label htmlFor="impact-media">Photo or video</label>
          <input
            id="impact-media"
            type="file"
            accept="image/*,video/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.jfif,.mp4,.mov,.avi,.mkv,.webm"
            onChange={(event) => setFormData({ ...formData, media: event.target.files?.[0] || formData.media })}
          />
        </div>
      </div>

      {preview && (
        <div className="admin-media-preview-stack">
          <div className="admin-media-preview">
            <span className="admin-media-preview-label">Current photo or video</span>
            {preview.kind === 'video' ? (
              <video src={preview.url} controls className="admin-existing-media" />
            ) : (
              <img src={preview.url} alt={formData.storyTitle || 'Impact media'} className="admin-existing-media" />
            )}
            <button type="button" onClick={() => setFormData({ ...formData, media: '' })}>Remove current</button>
          </div>
        </div>
      )}

      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : isEditing ? 'Update impact' : 'Save impact'}
      </button>
    </div>
  );
}

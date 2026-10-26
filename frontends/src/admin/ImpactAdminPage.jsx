export default function ImpactAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  return (
    <div className="admin-panel panel-box">
      <h3>Impact stories</h3>
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
          <label>Photo</label>
          <input type="file" accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp" onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || formData.photo })} />
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
      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save impact'}
      </button>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No impact stories found.</div>
        ) : (
          items.map((impact) => (
            <div key={impact.id} className="admin-item-row">
              <div>
                <strong>{impact.storyTitle || 'Impact story'}</strong>
                <small>{impact.beneficiaryOrCommunity || 'Community'}</small>
              </div>
              <div className="admin-item-actions">
                <button type="button" onClick={() => onEdit?.(impact)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete?.(impact.id, token)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

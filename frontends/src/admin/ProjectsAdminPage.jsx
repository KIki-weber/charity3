export default function ProjectsAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  return (
    <div className="admin-panel panel-box">
      <h3>Projects</h3>
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
        {saving ? 'Saving...' : 'Save project'}
      </button>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No projects added yet.</div>
        ) : (
          items.map((project) => (
            <div key={project.id} className="admin-item-row">
              <div>
                <strong>{project.projectName || 'Project'}</strong>
                <small>{project.locationCommunity || 'Location not set'}</small>
              </div>
              <div className="admin-item-actions">
                <button type="button" onClick={() => onEdit?.(project)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete?.(project.id, token)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

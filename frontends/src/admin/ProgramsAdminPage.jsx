export default function ProgramsAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  return (
    <div className="admin-panel panel-box">
      <h3>Programs</h3>
      <div className="admin-form-grid">
        <input value={formData.programName || ''} onChange={(e) => setFormData({ ...formData, programName: e.target.value })} placeholder="Program name" />
        <input value={formData.communityLocation || ''} onChange={(e) => setFormData({ ...formData, communityLocation: e.target.value })} placeholder="Location" />
        <input type="date" value={formData.startDate || ''} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
        <select value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows="4" />
      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save program'}
      </button>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No programs added yet.</div>
        ) : (
          items.map((program) => (
            <div key={program.id} className="admin-item-row">
              <div>
                <strong>{program.programName || 'Program'}</strong>
                <small>{program.communityLocation || 'Location not set'}</small>
              </div>
              <div className="admin-item-actions">
                <button type="button" onClick={() => onEdit?.(program)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete?.(program.id, token)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

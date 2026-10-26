import { getAdminMediaPreview } from '../../utils/adminMedia';

export default function TeamAdminPage({ items = [], formData, setFormData, onSave, onEdit, onDelete, token, saving }) {
  const isEditing = Boolean(formData?.id);
  const preview = getAdminMediaPreview(formData?.photo);

  return (
    <div className="admin-panel panel-box">
      <h3>Team members</h3>

      <div className="admin-list-block">
        {items.length === 0 ? (
          <div className="empty-state">No team members added yet.</div>
        ) : (
          [...items].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0)).map((member) => {
            const media = getAdminMediaPreview(member.photo);
            return (
              <div key={member.id} className="admin-item-row">
                <div className="admin-item-main">
                  {media?.kind === 'image' ? (
                    <img src={media.url} alt={`${member.name || 'Team member'} preview`} className="admin-item-thumb" />
                  ) : (
                    <div className="admin-item-thumb empty-thumb">{member.name?.charAt(0)?.toUpperCase() || 'T'}</div>
                  )}
                  <div>
                    <strong>{member.name || 'Team member'}</strong>
                    <small>{member.field || 'Field not set'}</small>
                    {member.phone && <small>{member.phone}</small>}
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button type="button" onClick={() => onEdit?.(member)}>Edit</button>
                  <button type="button" className="danger" onClick={() => onDelete?.(member.id, token)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="admin-form-grid">
        <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
        <input value={formData.country || ''} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" />
        <input value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" />
        <label className="team-phone-field">
          <span>Phone (include country calling code)</span>
          <input
            type="tel"
            autoComplete="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555 123 4567"
            pattern="\+[1-9][0-9\s().-]{1,24}"
            title="Enter the phone number with its country calling code, such as +1 555 123 4567."
          />
        </label>
        <input value={formData.field || ''} onChange={(e) => setFormData({ ...formData, field: e.target.value })} placeholder="Field" />
        <input type="number" value={formData.years || 0} onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })} placeholder="Years" />
      </div>

      <div className="admin-form-grid">
        <div>
          <label htmlFor="team-member-photo">Photo</label>
          <input
            id="team-member-photo"
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.jfif"
            onChange={(event) => setFormData({ ...formData, photo: event.target.files?.[0] || formData.photo })}
          />
        </div>
      </div>

      {preview && (
        <div className="admin-media-preview-stack">
          <div className="admin-media-preview">
            <span className="admin-media-preview-label">Photo preview</span>
            <img src={preview.url} alt={`${formData.name || 'Team member'} photo`} className="admin-existing-media" />
            <button type="button" onClick={() => setFormData({ ...formData, photo: '' })}>Remove current</button>
          </div>
        </div>
      )}

      <button type="button" className="primary-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Saving...' : isEditing ? 'Update team member' : 'Save team member'}
      </button>
    </div>
  );
}

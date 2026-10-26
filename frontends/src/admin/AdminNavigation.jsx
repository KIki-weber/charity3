const adminNavItems = [
  { key: 'programs', label: 'Programs' },
  { key: 'projects', label: 'Projects' },
  { key: 'impacts', label: 'Impact' },
  { key: 'teamMembers', label: 'Team' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'digitalIds', label: 'Digital IDs' },
];

export default function AdminNavigation({ activeSection, onChange, menuOpen = false, onToggleMenu }) {
  return (
    <>
      <button
        type="button"
        className="nav-toggle admin-toggle"
        aria-label="Toggle admin menu"
        onClick={onToggleMenu}
      >
        ☰
      </button>

      <nav className={menuOpen ? 'admin-top-nav open' : 'admin-top-nav'} aria-label="Admin navigation">
        {adminNavItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={activeSection === item.key ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => {
              onChange(item.key);
              if (onToggleMenu) onToggleMenu();
              const target = document.getElementById(`admin-section-${item.key}`);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}

export { adminNavItems };

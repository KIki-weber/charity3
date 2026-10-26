import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const navBase = [
  { key: 'home', labelKey: 'home', target: 'home' },
  { key: 'about', labelKey: 'about', target: 'about' },
  { key: 'programs', labelKey: 'programs', target: 'programs' },
  { key: 'projects', labelKey: 'projects', target: 'projects' },
  { key: 'impact', labelKey: 'impact', target: 'impact' },
  { key: 'team', labelKey: 'team', target: 'team' },
  { key: 'certificates', labelKey: 'certificates', target: 'certificates' },
  { key: 'contact', labelKey: 'contact', target: 'contact' },
  { key: 'donate', labelKey: 'donate', target: 'donate' }
];

const themeLabels = {
  en: { light: 'Light', night: 'Night', switchToLight: 'Switch to light mode', switchToNight: 'Switch to night mode' },
  am: { light: 'ብርሃን', night: 'ሌሊት', switchToLight: 'ወደ ብርሃን ሁነታ ቀይር', switchToNight: 'ወደ ሌሊት ሁነታ ቀይር' },
  ti: { light: 'ብርሃን', night: 'ለይቲ', switchToLight: 'ናብ ብርሃን ሁነታ ቀይር', switchToNight: 'ናብ ለይቲ ሁነታ ቀይር' },
  om: { light: 'Ifa', night: 'Halkan', switchToLight: 'Gara haala ifaatti jijjiiri', switchToNight: 'Gara haala halkanitti jijjiiri' }
};

export function PublicLayout({ content, language, onLanguageChange, theme, onThemeChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeThemeLabels = themeLabels[language] || themeLabels.en;

  useEffect(() => {
    document.documentElement.lang = language || 'en';
    document.documentElement.dir = 'ltr';
  }, [language]);

  const scrollToSection = (sectionId) => {
    if (typeof document === 'undefined') return;
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  const handleNavSelect = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => scrollToSection(sectionId), 180);
      return;
    }

    scrollToSection(sectionId);
  };



  return (
    <div className="app-shell" data-theme={theme}>
      <header className="topbar">
        <div className="brand-wrap">
          <Link to="/" className="brand-mark" onClick={() => setMenuOpen(false)}>
            <span className="brand-icon">P</span>
            <div>
              <strong>Peace & Love</strong>
              <small>Development Organization</small>
            </div>
          </Link>
        </div>

        <nav
          id="public-navigation"
          className={menuOpen ? 'topnav open' : 'topnav'}
          aria-label="Main navigation"
        >
          {navBase.map(({ key, labelKey, target }) => (
            <button
              key={key}
              type="button"
              className={location.pathname === '/' && window.location.hash === `#${target}` ? 'nav-link active' : 'nav-link'}
              onClick={() => handleNavSelect(target)}
            >
              {content.nav[labelKey]}
            </button>
          ))}
        </nav>

        <div className="utility-actions">
          <div className="language-switcher" aria-label="Language selector">
            <label htmlFor="site-language-select" className="sr-only">Select language</label>
            <select
              id="site-language-select"
              className="language-select"
              value={language}
              onChange={(event) => onLanguageChange(event.target.value)}
              aria-label="Select language"
            >
              <option value="en">Eng</option>
              <option value="am">አማ</option>
              <option value="ti">ትግ</option>
              <option value="om">AfO</option>
            </select>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? activeThemeLabels.switchToLight : activeThemeLabels.switchToNight}
            title={theme === 'dark' ? activeThemeLabels.switchToLight : activeThemeLabels.switchToNight}
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            <span>{theme === 'dark' ? activeThemeLabels.light : activeThemeLabels.night}</span>
          </button>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-controls="public-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          </button>
        </div>
      </header>

      <main className="page-body">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <strong>Peace & Love Development Organization</strong>
          <p>{content.footer}</p>
        </div>
        <div className="footer-links">
          {content.social.map((social) => (
            <a key={social.name} href={social.href} target="_blank" rel="noreferrer">
              {social.name}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

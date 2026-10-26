import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { siteContent } from './data/siteContent';
import { PublicLayout } from './public/components/Layout';
import HomePage from './public/pages/HomePage';
import AboutPage from './public/pages/AboutPage';
import ProgramsPage from './public/pages/ProgramsPage';
import ProjectsPage from './public/pages/ProjectsPage';
import ImpactPage from './public/pages/ImpactPage';
import TeamPage from './public/pages/TeamPage';
import CertificatesPage from './public/pages/CertificatesPage';
import ContactPage from './public/pages/ContactPage';
import DonationPage from './public/pages/DonationPage';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import './App.css';

function App() {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState(
    () => localStorage.getItem('publicTheme') === 'dark' ? 'dark' : 'light'
  );
  const content = siteContent[language] || siteContent.en;

  const changeTheme = (nextTheme) => {
    localStorage.setItem('publicTheme', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <PublicLayout
              content={content}
              language={language}
              onLanguageChange={setLanguage}
              theme={theme}
              onThemeChange={changeTheme}
            />
          }
        >
          <Route index element={<HomePage content={content} />} />
          <Route path="about" element={<AboutPage content={content} />} />
          <Route path="programs" element={<ProgramsPage content={content} />} />
          <Route path="projects" element={<ProjectsPage content={content} />} />
          <Route path="impact" element={<ImpactPage content={content} />} />
          <Route path="team" element={<TeamPage content={content} />} />
          <Route path="certificates" element={<CertificatesPage content={content} />} />
          <Route path="contact" element={<ContactPage content={content} />} />
          <Route path="donate" element={<DonationPage content={content} />} />
        </Route>

        <Route path="/admin" element={<AdminLoginPage content={content} />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage content={content} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

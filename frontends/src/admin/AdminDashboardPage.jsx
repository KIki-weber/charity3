import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AdminNavigation from './AdminNavigation';
import ProgramsAdminPage from './pages/ProgramsAdminPage';
import ProjectsAdminPage from './pages/ProjectsAdminPage';
import ImpactAdminPage from './pages/ImpactAdminPage';
import TeamAdminPage from './pages/TeamAdminPage';
import CertificatesAdminPage from './pages/CertificatesAdminPage';
import DigitalMemberIdsAdminPage from './pages/DigitalMemberIdsAdminPage';
import {
  createCertificate,
  createDigitalMemberId,
  createImpact,
  createProgram,
  createProject,
  createTeamMember,
  deleteCertificate,
  deleteDigitalMemberId,
  deleteImpact,
  deleteProgram,
  deleteProject,
  deleteTeamMember,
  getAdminProfile,
  getCertificates,
  getDigitalMemberIds,
  getImpacts,
  getPrograms,
  getProjects,
  getTeamMembers,
  updateCertificate,
  updateDigitalMemberId,
  updateImpact,
  updateProgram,
  updateProject,
  updateTeamMember,
} from '../services/backendApi';

const emptyProgram = {
  programName: '',
  description: '',
  communityLocation: '',
  startDate: '',
  status: 'active',
  photos: [],
  video: '',
  file: '',
};

const emptyProject = {
  projectName: '',
  description: '',
  locationCommunity: '',
  startDate: '',
  endDate: '',
  status: 'active',
  photos: [],
  video: '',
  file: '',
};

const emptyImpact = {
  storyTitle: '',
  beneficiaryOrCommunity: '',
  description: '',
  relatedProgramOrProject: '',
  media: '',
  resultsAchievements: '',
  date: '',
};

const emptyTeamMember = {
  name: '',
  country: '',
  city: '',
  phone: '',
  field: '',
  years: 0,
  photo: '',
};

const emptyCertificate = {
  organizationName: '',
  registrationNumber: '',
  issuingGovernmentAuthority: '',
  registrationDate: '',
  legalStatus: '',
  certificateLicenseNumber: '',
  certificateIssueDate: '',
  certificateExpiryDate: '',
  officialAddress: '',
  photos: [],
  files: [],
};

const emptyDigitalId = {
  memberId: '',
  fullName: '',
  photo: '',
  photos: [],
  video: '',
  file: '',
  country: '',
  issueDate: '',
  expiryDate: '',
  membershipType: '',
  title: '',
  department: '',
  organizationName: '',
  email: '',
  phone: '',
  address: '',
  status: 'active',
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('programs');
  const [menuOpen, setMenuOpen] = useState(false);
  const [token] = useState(localStorage.getItem('adminToken') || '');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [impacts, setImpacts] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [digitalIds, setDigitalIds] = useState([]);

  const [programForm, setProgramForm] = useState(emptyProgram);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [impactForm, setImpactForm] = useState(emptyImpact);
  const [teamMemberForm, setTeamMemberForm] = useState(emptyTeamMember);
  const [certificateForm, setCertificateForm] = useState(emptyCertificate);
  const [digitalIdForm, setDigitalIdForm] = useState(emptyDigitalId);

  const dashboardStats = useMemo(
    () => [
      { title: 'Programs', count: programs.length },
      { title: 'Projects', count: projects.length },
      { title: 'Impact stories', count: impacts.length },
      { title: 'Team members', count: teamMembers.length },
      { title: 'Certificates', count: certificates.length },
      { title: 'Digital IDs', count: digitalIds.length },
    ],
    [certificates.length, digitalIds.length, impacts.length, programs.length, projects.length, teamMembers.length]
  );

  const sortByNewest = (items = []) => [...items].sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0));

  const fetchDashboardData = async () => {
    try {
      const [programResponse, projectResponse, impactResponse, teamResponse, certificateResponse, digitalResponse] =
        await Promise.all([
          getPrograms(),
          getProjects(),
          getImpacts(),
          getTeamMembers(),
          getCertificates(),
          getDigitalMemberIds(),
        ]);

      setPrograms(sortByNewest(programResponse.data || []));
      setProjects(sortByNewest(projectResponse.data || []));
      setImpacts(sortByNewest(impactResponse.data || []));
      setTeamMembers(sortByNewest(teamResponse.data || []));
      setCertificates(sortByNewest(certificateResponse.data || []));
      setDigitalIds(sortByNewest(digitalResponse.data || []));
    } catch (fetchError) {
      console.error(fetchError);
      setError('Unable to load dashboard data from the backend.');
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        navigate('/admin');
        return;
      }

      try {
        const profileResponse = await getAdminProfile(token);
        setAdmin(profileResponse.data);
        await fetchDashboardData();
      } catch {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, token]);

  useEffect(() => {
    const target = document.getElementById(`admin-section-${activeSection}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  const hasFileSelection = (values) => {
    if (!values) {
      return false;
    }

    return Object.values(values).some((value) => value instanceof File || (Array.isArray(value) && value.some((item) => item instanceof File)));
  };

  const toFormData = (values) => {
    const formData = new FormData();

    Object.entries(values || {}).forEach(([key, value]) => {
      if (value === null || value === undefined || (value === '' && key !== 'phone')) {
        return;
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          formData.append(key, '[]');
          return;
        }

        value.forEach((entry) => {
          if (entry === null || entry === undefined || entry === '') {
            return;
          }

          if (entry instanceof File) {
            formData.append(key, entry);
            return;
          }

          formData.append(key, typeof entry === 'object' ? JSON.stringify(entry) : String(entry));
        });
        return;
      }

      if (value instanceof File) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
        return;
      }

      formData.append(key, value);
    });

    return formData;
  };

  const handleSaveItem = async (saveFn, payload, label) => {
    if (!token) {
      navigate('/admin');
      return;
    }

    const itemId = payload?.id ?? null;
    const sanitizedPayload = { ...payload };
    delete sanitizedPayload.id;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const requestPayload = hasFileSelection(sanitizedPayload) ? toFormData(sanitizedPayload) : sanitizedPayload;

      if (itemId) {
        await saveFn(itemId, requestPayload, token);
      } else {
        await saveFn(requestPayload, token);
      }

      setSuccess(`${label} saved successfully.`);
      await fetchDashboardData();
      setProgramForm(emptyProgram);
      setProjectForm(emptyProject);
      setImpactForm(emptyImpact);
      setTeamMemberForm(emptyTeamMember);
      setCertificateForm(emptyCertificate);
      setDigitalIdForm(emptyDigitalId);
    } catch (submitError) {
      setError(submitError.response?.data?.message || `Failed to save ${label.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const sections = {
    programs: (
      <ProgramsAdminPage
        items={programs}
        formData={programForm}
        setFormData={setProgramForm}
        onSave={() => handleSaveItem(programForm.id ? updateProgram : createProgram, programForm, 'Program')}
        onEdit={(program) => setProgramForm(program)}
        onDelete={(id) => deleteProgram(id, token).then(() => fetchDashboardData(token))}
        token={token}
        saving={saving}
      />
    ),
    projects: (
      <ProjectsAdminPage
        items={projects}
        formData={projectForm}
        setFormData={setProjectForm}
        onSave={() => handleSaveItem(projectForm.id ? updateProject : createProject, projectForm, 'Project')}
        onEdit={(project) => setProjectForm(project)}
        onDelete={(id) => deleteProject(id, token).then(() => fetchDashboardData(token))}
        token={token}
        saving={saving}
      />
    ),
    impacts: (
      <ImpactAdminPage
        items={impacts}
        formData={impactForm}
        setFormData={setImpactForm}
        onSave={() => handleSaveItem(impactForm.id ? updateImpact : createImpact, impactForm, 'Impact')}
        onEdit={(impact) => setImpactForm(impact)}
        onDelete={(id) => deleteImpact(id, token).then(() => fetchDashboardData(token))}
        token={token}
        saving={saving}
      />
    ),
    teamMembers: (
      <TeamAdminPage
        items={teamMembers}
        formData={teamMemberForm}
        setFormData={setTeamMemberForm}
        onSave={() => handleSaveItem(teamMemberForm.id ? updateTeamMember : createTeamMember, teamMemberForm, 'Team member')}
        onEdit={(member) => setTeamMemberForm(member)}
        onDelete={(id) => deleteTeamMember(id, token).then(() => fetchDashboardData(token))}
        token={token}
        saving={saving}
      />
    ),
    certificates: (
      <CertificatesAdminPage
        items={certificates}
        formData={certificateForm}
        setFormData={setCertificateForm}
        onSave={() => handleSaveItem(certificateForm.id ? updateCertificate : createCertificate, certificateForm, 'Certificate')}
        onEdit={(certificate) => setCertificateForm(certificate)}
        onDelete={(id) => deleteCertificate(id, token).then(() => fetchDashboardData(token))}
        token={token}
        saving={saving}
      />
    ),
    digitalIds: (
      <DigitalMemberIdsAdminPage
        items={digitalIds}
        formData={digitalIdForm}
        setFormData={setDigitalIdForm}
        onSave={() => handleSaveItem(digitalIdForm.id ? updateDigitalMemberId : createDigitalMemberId, digitalIdForm, 'Digital ID')}
        onEdit={(digitalId) => setDigitalIdForm(digitalId)}
        onDelete={(id) => deleteDigitalMemberId(id, token).then(() => fetchDashboardData(token))}
        token={token}
        saving={saving}
      />
    ),
  };

  if (loading) {
    return <section className="section-block admin-shell"><div className="panel-box">Loading admin dashboard...</div></section>;
  }

  return (
    <section className="section-block admin-shell">
      <div className="admin-header">
        <div>
          <span className="kicker">Dashboard</span>
          <h1>Admin Control Panel</h1>
          {admin && <p>Welcome, {admin.name}</p>}
        </div>
        <div className="admin-header-actions">
          <Link to="/" className="secondary-btn">Back to website</Link>
          <button type="button" className="secondary-btn" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin'); }}>Logout</button>
        </div>
      </div>

      <div className="admin-menu-wrap">
        <AdminNavigation
          activeSection={activeSection}
          onChange={setActiveSection}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((current) => !current)}
        />
      </div>

      <div className="card-grid six-col">
        {dashboardStats.map((item) => (
          <div key={item.title} className="info-card compact">
            <span className="tag">{item.count}</span>
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

      {error && <div className="error-banner">{error}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div id={`admin-section-${activeSection}`} className="admin-section-panel">
        {sections[activeSection]}
      </div>
    </section>
  );
}

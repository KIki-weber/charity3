import api from './api';

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getPrograms = () => api.get('/public/programs');
export const getProjects = () => api.get('/public/projects');
export const getImpacts = () => api.get('/public/impacts');
export const getTeamMembers = () => api.get('/public/team-members');
export const getCertificates = () => api.get('/public/certificates');
export const getDigitalMemberIds = () => api.get('/public/digital-member-ids');

export const loginAdmin = (payload) => api.post('/admin/login', payload);
export const registerAdmin = (payload) => api.post('/admin/register', payload);
export const getAdminProfile = (token) => api.get('/admin/me', getAuthHeaders(token));

export const createProgram = (payload, token) => api.post('/programs', payload, getAuthHeaders(token));
export const updateProgram = (id, payload, token) => api.put(`/programs/${id}`, payload, getAuthHeaders(token));
export const deleteProgram = (id, token) => api.delete(`/programs/${id}`, getAuthHeaders(token));

export const createProject = (payload, token) => api.post('/projects', payload, getAuthHeaders(token));
export const updateProject = (id, payload, token) => api.put(`/projects/${id}`, payload, getAuthHeaders(token));
export const deleteProject = (id, token) => api.delete(`/projects/${id}`, getAuthHeaders(token));

export const createImpact = (payload, token) => api.post('/impacts', payload, getAuthHeaders(token));
export const updateImpact = (id, payload, token) => api.put(`/impacts/${id}`, payload, getAuthHeaders(token));
export const deleteImpact = (id, token) => api.delete(`/impacts/${id}`, getAuthHeaders(token));

export const createTeamMember = (payload, token) => api.post('/team-members', payload, getAuthHeaders(token));
export const updateTeamMember = (id, payload, token) => api.put(`/team-members/${id}`, payload, getAuthHeaders(token));
export const deleteTeamMember = (id, token) => api.delete(`/team-members/${id}`, getAuthHeaders(token));

export const createCertificate = (payload, token) => api.post('/certificates', payload, getAuthHeaders(token));
export const updateCertificate = (id, payload, token) => api.put(`/certificates/${id}`, payload, getAuthHeaders(token));
export const deleteCertificate = (id, token) => api.delete(`/certificates/${id}`, getAuthHeaders(token));

export const createDigitalMemberId = (payload, token) => api.post('/digital-member-ids', payload, getAuthHeaders(token));
export const updateDigitalMemberId = (id, payload, token) => api.put(`/digital-member-ids/${id}`, payload, getAuthHeaders(token));
export const deleteDigitalMemberId = (id, token) => api.delete(`/digital-member-ids/${id}`, getAuthHeaders(token));

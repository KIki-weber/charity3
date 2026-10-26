import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginAdmin } from '../services/backendApi';

export default function AdminLoginPage({ content }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('pledevelopmentorg@gmail.com');
  const [password, setPassword] = useState('334433');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginAdmin({ email, password });
      const token = response.data?.token;

      if (!token) {
        throw new Error('No token returned from server');
      }

      localStorage.setItem('adminToken', token);
      navigate('/admin/dashboard');
    } catch (loginError) {
      setError(loginError.response?.data?.message || 'Invalid login details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-block admin-shell">
      <div className="panel-box auth-card">
        <h1>{content.admin.loginTitle}</h1>
        <p>{content.admin.loginText}</p>

        <form className="admin-form" onSubmit={handleLogin}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <div className="error-banner">{error}</div>}
          <button type="submit" className="primary-btn full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}

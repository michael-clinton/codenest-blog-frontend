import React, { useState, useEffect } from 'react';
import axiosInstance from "../../api/axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Login component mounted");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log("📤 Submitting form with:", form);

    try {
      const res = await axiosInstance.post('/api/auth/login', form);
      console.log("✅ Server response:", res.data);

      const { status, token, user, error: errMsg } = res.data;

      if (!status) {
        setError(errMsg || 'Login failed');
        return;
      }

      // Save token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err);
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="card p-4 w-100 shadow"
      style={{ maxWidth: 400, margin: 'auto', marginTop: '100px' }}
    >
      <h3 className="mb-3 text-center">Login</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ← import Link
import axiosInstance from "../../api/axios";

const InitiateRegistration = ({ onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const initiate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/initiate-registration', formData);
      if (res.data.message) {
        setMessage(res.data.message);
        if (onNext) onNext(formData.email);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={initiate} 
      className="card p-4 w-100 shadow-sm" 
      style={{ maxWidth: 400, margin: '100px auto' }}
    >
      <h3 className="text-center mb-4">Register (Step 1)</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <input
        className="form-control mb-3"
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        className="form-control mb-3"
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        className="form-control mb-4"
        type="password"
        name="password"
        placeholder="Create Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button className="btn btn-primary w-100" type="submit" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Sending...
          </>
        ) : (
          'Send OTP'
        )}
      </button>

      {/* 🔗 Login link */}
      <p className="mt-3 text-center">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};

export default InitiateRegistration;

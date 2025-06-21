import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Profile = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = storedUser.id;
  const token = localStorage.getItem('token');

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    axiosInstance
      .get(`/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
        } else {
          setError(err.response?.data?.error || err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate, userId, token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const form = new FormData();
      ['name', 'email', 'phone', 'bio'].forEach(key =>
        form.append(key, user[key] || '')
      );
      if (file) form.append('profileImage', file);

      const { data } = await axiosInstance.patch(`/api/profile/${userId}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data.user);

      // ✅ Scroll to top first
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // ✅ Then show alert
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated.',
          confirmButtonColor: '#3085d6',
        });
      }, 300); // delay to ensure scroll animation starts first

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      } else {
        setError(err.response?.data?.error || 'Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (error) return <div className="alert alert-danger text-center mt-3">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <h3 className="text-center mb-4">Edit Profile</h3>
        <form onSubmit={handleSave} className="profile-form">

          {/* Profile Image First */}
          <div className="mb-4 text-center">
            <img
              src={preview || user.profileImage || '/default-avatar.png'}
              alt="Preview"
              className="rounded-circle border mb-2"
              width="120"
              height="120"
            />
            <div>
              <input
                type="file"
                className="form-control mt-2"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Name, Email, Phone */}
          {['name', 'email', 'phone'].map(key => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                name={key}
                type={key === 'email' ? 'email' : 'text'}
                className="form-control"
                value={user[key] || ''}
                onChange={handleChange}
                required={key === 'name' || key === 'email'}
              />
            </div>
          ))}

          {/* Bio */}
          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              className="form-control"
              rows="3"
              value={user.bio || ''}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="d-grid mt-4">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { facultyAuthAPI } from '../services/api';

const FacultyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    researchArea: '',
    bio: '',
    photo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || 
        !formData.designation || !formData.researchArea) {
      setError('All required fields must be filled');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await facultyAuthAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        designation: formData.designation,
        researchArea: formData.researchArea,
        bio: formData.bio,
        photo: formData.photo,
      });

      setSuccess(response.data.message);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        designation: '',
        researchArea: '',
        bio: '',
        photo: '',
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/faculty-login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-beige rounded-lg shadow-lg p-8 border-l-4 border-darkGreen">
          <h1 className="text-3xl font-bold text-darkGreen mb-2">Faculty Registration</h1>
          <p className="text-gray-600 mb-6">Register as a faculty member</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Dr. John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@university.edu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Designation *
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              >
                <option value="">Select Designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            {/* Research Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Research Area *
              </label>
              <input
                type="text"
                name="researchArea"
                value={formData.researchArea}
                onChange={handleChange}
                placeholder="e.g., Machine Learning, Data Science"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Brief biography"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-darkGreen hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>

            {/* Already have account */}
            <p className="text-center text-gray-600 mt-4">
              Already registered?{' '}
              <Link to="/faculty-login" className="text-gold hover:text-yellow-600 font-semibold">
                Login here
              </Link>
            </p>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> After registration, your account will be reviewed by an admin. 
              You will be notified via email once approved.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FacultyRegister;

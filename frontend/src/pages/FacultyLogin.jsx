import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { facultyAuthAPI } from '../services/api';

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await facultyAuthAPI.login(formData.email, formData.password);

      // Store token and faculty data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('facultyUser', JSON.stringify(response.data.faculty));
      localStorage.setItem('userRole', 'faculty');

      // Redirect to faculty dashboard
      navigate('/faculty-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="bg-beige rounded-lg shadow-lg p-8 border-l-4 border-darkGreen">
          <h1 className="text-3xl font-bold text-darkGreen mb-2">Faculty Login</h1>
          <p className="text-gray-600 mb-6">Access your faculty dashboard</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">{error}</p>
              {error.includes('pending') && (
                <p className="text-sm mt-2">Please wait for admin approval.</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
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

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-darkGreen hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{' '}
              <Link to="/faculty-register" className="text-gold hover:text-yellow-600 font-semibold">
                Register here
              </Link>
            </p>

            {/* Admin Login Link */}
            <p className="text-center text-gray-600 text-sm">
              Admin login?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
                Login here
              </Link>
            </p>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Test Account:</strong> Use any registered and approved faculty email with your password.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FacultyLogin;

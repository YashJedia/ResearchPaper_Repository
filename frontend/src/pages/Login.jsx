import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, facultyAuthAPI } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin'); // 'admin' or 'faculty'
  const [tab, setTab] = useState('login'); // 'login' or 'register' (for faculty)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: '',
  });

  // Faculty login state
  const [facultyLoginForm, setFacultyLoginForm] = useState({
    email: '',
    password: '',
  });

  // Faculty register state
  const [facultyRegisterForm, setFacultyRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    researchArea: '',
    bio: '',
    photo: '',
  });

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFacultyLoginChange = (e) => {
    const { name, value } = e.target;
    setFacultyLoginForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFacultyRegisterChange = (e) => {
    const { name, value } = e.target;
    setFacultyRegisterForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!adminForm.username || !adminForm.password) {
      setError('Username and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(adminForm.username, adminForm.password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', 'admin');

      onLoginSuccess();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Faculty Login
  const handleFacultyLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!facultyLoginForm.email || !facultyLoginForm.password) {
      setError('Email and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await facultyAuthAPI.login(
        facultyLoginForm.email,
        facultyLoginForm.password
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('facultyUser', JSON.stringify(response.data.faculty));
      localStorage.setItem('userRole', 'faculty');

      navigate('/faculty-dashboard');
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Faculty Register
  const handleFacultyRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !facultyRegisterForm.name ||
      !facultyRegisterForm.email ||
      !facultyRegisterForm.password ||
      !facultyRegisterForm.designation ||
      !facultyRegisterForm.researchArea
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (facultyRegisterForm.password !== facultyRegisterForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (facultyRegisterForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await facultyAuthAPI.register(facultyRegisterForm);

      setSuccess(
        'Registration successful! Please wait for admin approval before logging in.'
      );
      setFacultyRegisterForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        designation: '',
        researchArea: '',
        bio: '',
        photo: '',
      });

      setTimeout(() => {
        setTab('login');
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        {/* Role Selection Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setRole('admin');
              setTab('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-3 px-4 font-bold rounded-t-lg transition ${
              role === 'admin'
                ? 'bg-green-950 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => {
              setRole('faculty');
              setTab('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-3 px-4 font-bold rounded-t-lg transition ${
              role === 'faculty'
                ? 'bg-darkGreen text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            Faculty Login
          </button>
        </div>

        <div className="bg-beige rounded-b-lg shadow-lg p-8 border-l-4 border-gold">
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

          {/* ADMIN LOGIN */}
          {role === 'admin' && (
            <>
              <h1 className="text-3xl font-bold text-darkGreen mb-2">Admin Login</h1>
              <p className="text-gray-600 mb-6">Access the admin dashboard</p>

              <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={adminForm.username}
                    onChange={handleAdminChange}
                    placeholder="admin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={adminForm.password}
                    onChange={handleAdminChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Demo Credentials:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: admin123
                </p>
              </div>
            </>
          )}

          {/* FACULTY LOGIN / REGISTER */}
          {role === 'faculty' && (
            <>
              {/* Tabs for Faculty */}
              <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
                <button
                  onClick={() => {
                    setTab('login');
                    setError('');
                    setSuccess('');
                  }}
                  className={`px-4 py-2 font-semibold transition ${
                    tab === 'login'
                      ? 'text-darkGreen border-b-2 border-darkGreen'
                      : 'text-gray-600 hover:text-darkGreen'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setTab('register');
                    setError('');
                    setSuccess('');
                  }}
                  className={`px-4 py-2 font-semibold transition ${
                    tab === 'register'
                      ? 'text-darkGreen border-b-2 border-darkGreen'
                      : 'text-gray-600 hover:text-darkGreen'
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Faculty Login Tab */}
              {tab === 'login' && (
                <>
                  <h1 className="text-3xl font-bold text-darkGreen mb-2">Faculty Login</h1>
                  <p className="text-gray-600 mb-6">Access your faculty dashboard</p>

                  <form onSubmit={handleFacultyLogin}>
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={facultyLoginForm.email}
                        onChange={handleFacultyLoginChange}
                        placeholder="your@university.edu"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={facultyLoginForm.password}
                        onChange={handleFacultyLoginChange}
                        placeholder="Enter password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                  </form>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> You must register first and wait for admin
                      approval before you can login.
                    </p>
                  </div>
                </>
              )}

              {/* Faculty Register Tab */}
              {tab === 'register' && (
                <>
                  <h1 className="text-3xl font-bold text-darkGreen mb-2">
                    Faculty Registration
                  </h1>
                  <p className="text-gray-600 mb-6">Create your faculty account</p>

                  <form onSubmit={handleFacultyRegister} className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={facultyRegisterForm.name}
                        onChange={handleFacultyRegisterChange}
                        placeholder="Dr. John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={facultyRegisterForm.email}
                        onChange={handleFacultyRegisterChange}
                        placeholder="john@university.edu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Designation *
                      </label>
                      <select
                        name="designation"
                        value={facultyRegisterForm.designation}
                        onChange={handleFacultyRegisterChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Research Area *
                      </label>
                      <input
                        type="text"
                        name="researchArea"
                        value={facultyRegisterForm.researchArea}
                        onChange={handleFacultyRegisterChange}
                        placeholder="e.g., Machine Learning"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={facultyRegisterForm.bio}
                        onChange={handleFacultyRegisterChange}
                        placeholder="Brief biography"
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Photo URL
                      </label>
                      <input
                        type="url"
                        name="photo"
                        value={facultyRegisterForm.photo}
                        onChange={handleFacultyRegisterChange}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={facultyRegisterForm.password}
                        onChange={handleFacultyRegisterChange}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={facultyRegisterForm.confirmPassword}
                        onChange={handleFacultyRegisterChange}
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold text-sm"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 mt-4"
                    >
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  </form>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-gray-700">
                      <strong>Note:</strong> After registration, an admin will review your
                      application and approve/reject it.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Login;

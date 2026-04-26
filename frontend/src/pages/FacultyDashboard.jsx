import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { facultyAuthAPI, paperAPI } from '../services/api';
import PaperCard from '../components/PaperCard';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [facultyData, setFacultyData] = useState(null);
  const [papers, setPapers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    researchArea: '',
    bio: '',
    photo: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [paperForm, setPaperForm] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    journal: '',
    abstract: '',
    doi: '',
    link: '',
    researchArea: '',
  });
  const [editingPaperId, setEditingPaperId] = useState(null);
  const [showEditPaper, setShowEditPaper] = useState(false);

  // Fetch faculty profile and papers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Try to get profile from API
        try {
          const profileRes = await facultyAuthAPI.getProfile();
          const profileData = profileRes.data.data;
          setFacultyData(profileData);
          setFormData({
            name: profileData.name,
            designation: profileData.designation,
            researchArea: profileData.researchArea,
            bio: profileData.bio || '',
            photo: profileData.photo || '',
          });
        } catch (profileErr) {
          console.error('Profile fetch error:', profileErr);
          // Fall back to localStorage if API fails
          const storedFaculty = localStorage.getItem('facultyUser');
          if (storedFaculty) {
            const facultyFromStorage = JSON.parse(storedFaculty);
            setFacultyData(facultyFromStorage);
            setFormData({
              name: facultyFromStorage.name,
              designation: facultyFromStorage.designation,
              researchArea: facultyFromStorage.researchArea,
              bio: facultyFromStorage.bio || '',
              photo: facultyFromStorage.photo || '',
            });
          } else {
            throw profileErr;
          }
        }

        // Try to get papers
        try {
          const papersRes = await facultyAuthAPI.getMyPapers();
          setPapers(papersRes.data.data || []);
        } catch (papersErr) {
          console.error('Papers fetch error:', papersErr);
          setPapers([]);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load profile. Please try logging in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handlePaperChange = (e) => {
    const { name, value } = e.target;
    setPaperForm((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleAddPaper = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!paperForm.title || !paperForm.authors || !paperForm.journal) {
      setError('Title, authors, and journal are required');
      return;
    }

    try {
      setLoading(true);
      await paperAPI.create({
        ...paperForm,
        facultyId: facultyData._id,
      });

      // Refresh papers list
      const papersRes = await facultyAuthAPI.getMyPapers();
      setPapers(papersRes.data.data || []);

      // Reset form
      setPaperForm({
        title: '',
        authors: '',
        year: new Date().getFullYear(),
        journal: '',
        abstract: '',
        doi: '',
        link: '',
        researchArea: '',
      });
      setShowAddPaper(false);
      setSuccess('Paper added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add paper');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditPaper = (paper) => {
    setEditingPaperId(paper._id);
    setPaperForm({
      title: paper.title,
      authors: paper.authors || paper.author || '',
      year: paper.year,
      journal: paper.journal,
      abstract: paper.abstract || '',
      doi: paper.doi || '',
      link: paper.link || '',
      researchArea: paper.researchArea || '',
    });
    setShowEditPaper(true);
    setShowAddPaper(false);
  };

  const handleUpdatePaper = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!paperForm.title || !paperForm.authors || !paperForm.journal) {
      setError('Title, authors, and journal are required');
      return;
    }

    try {
      setLoading(true);
      await paperAPI.update(editingPaperId, {
        ...paperForm,
        facultyId: facultyData._id,
      });

      // Refresh papers list
      const papersRes = await facultyAuthAPI.getMyPapers();
      setPapers(papersRes.data.data || []);

      // Reset form
      setPaperForm({
        title: '',
        authors: '',
        year: new Date().getFullYear(),
        journal: '',
        abstract: '',
        doi: '',
        link: '',
        researchArea: '',
      });
      setEditingPaperId(null);
      setShowEditPaper(false);
      setSuccess('Paper updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update paper');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const response = await facultyAuthAPI.updateProfile(formData);
      setFacultyData(response.data.data);
      setEditMode(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await facultyAuthAPI.updateProfile({
        password: passwordForm.password,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      setSuccess('Password changed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (id) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      try {
        await paperAPI.delete(id);
        setPapers(papers.filter((p) => p._id !== id));
        setSuccess('Paper deleted successfully');
      } catch (err) {
        setError('Failed to delete paper');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('facultyUser');
    localStorage.removeItem('userRole');
    navigate('/faculty-login');
  };

  if (!facultyData) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-darkGreen">Faculty Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b-2 border-gray-300">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'profile'
              ? 'text-darkGreen border-b-4 border-darkGreen'
              : 'text-gray-600 hover:text-darkGreen'
          }`}
        >
          Profile ({facultyData?.name})
        </button>
        <button
          onClick={() => setActiveTab('papers')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'papers'
              ? 'text-darkGreen border-b-4 border-darkGreen'
              : 'text-gray-600 hover:text-darkGreen'
          }`}
        >
          My Papers ({papers.length})
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'password'
              ? 'text-darkGreen border-b-4 border-darkGreen'
              : 'text-gray-600 hover:text-darkGreen'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-beige rounded-lg shadow-lg p-8 max-w-2xl">
          <div className="mb-6">
            {facultyData?.photo && (
              <img
                src={facultyData.photo}
                alt={facultyData.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            )}
          </div>

          {!editMode ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="text-lg font-semibold text-darkGreen">{facultyData?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="text-lg text-darkGreen">{facultyData?.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Designation</p>
                <p className="text-lg text-darkGreen">{facultyData?.designation}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Research Area</p>
                <p className="text-lg text-darkGreen">{facultyData?.researchArea}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Bio</p>
                <p className="text-lg text-darkGreen">{facultyData?.bio || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Registration Status</p>
                <p className={`text-lg font-semibold ${
                  facultyData?.registrationStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {facultyData?.registrationStatus?.toUpperCase()}
                </p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="mt-6 bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Research Area</label>
                <input
                  type="text"
                  name="researchArea"
                  value={formData.researchArea}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleProfileChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Papers Tab */}
      {activeTab === 'papers' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 mb-2">
                You have published <strong>{papers.length}</strong> papers.
              </p>
            </div>
            <button
              onClick={() => {
                setShowAddPaper(!showAddPaper);
                setShowEditPaper(false);
              }}
              className=" bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              {showAddPaper ? '✕ Close' : '+ Add Paper'}
            </button>
          </div>

          {/* Edit Paper Form */}
          {showEditPaper && (
            <div className="bg-beige rounded-lg shadow-lg p-8 mb-8 border-2 border-gold">
              <h3 className="text-xl font-bold text-darkGreen mb-6">Edit Paper</h3>
              <form onSubmit={handleUpdatePaper} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={paperForm.title}
                      onChange={handlePaperChange}
                      placeholder="Paper title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Authors *</label>
                    <input
                      type="text"
                      name="authors"
                      value={paperForm.authors}
                      onChange={handlePaperChange}
                      placeholder="Author name(s)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Journal *</label>
                    <input
                      type="text"
                      name="journal"
                      value={paperForm.journal}
                      onChange={handlePaperChange}
                      placeholder="Journal name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={paperForm.year}
                      onChange={handlePaperChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Research Area</label>
                    <input
                      type="text"
                      name="researchArea"
                      value={paperForm.researchArea}
                      onChange={handlePaperChange}
                      placeholder="e.g., Machine Learning"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">DOI</label>
                    <input
                      type="text"
                      name="doi"
                      value={paperForm.doi}
                      onChange={handlePaperChange}
                      placeholder="e.g., 10.1234/example"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Paper Link</label>
                  <input
                    type="url"
                    name="link"
                    value={paperForm.link}
                    onChange={handlePaperChange}
                    placeholder="https://example.com/paper"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Abstract</label>
                  <textarea
                    name="abstract"
                    value={paperForm.abstract}
                    onChange={handlePaperChange}
                    placeholder="Paper abstract"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Paper'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditPaper(false);
                      setEditingPaperId(null);
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Paper Form */}
          {showAddPaper && (
            <div className="bg-beige rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-darkGreen mb-6">Add New Paper</h3>
              <form onSubmit={handleAddPaper} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={paperForm.title}
                      onChange={handlePaperChange}
                      placeholder="Paper title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Authors *</label>
                    <input
                      type="text"
                      name="authors"
                      value={paperForm.authors}
                      onChange={handlePaperChange}
                      placeholder="Author name(s)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Journal *</label>
                    <input
                      type="text"
                      name="journal"
                      value={paperForm.journal}
                      onChange={handlePaperChange}
                      placeholder="Journal name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={paperForm.year}
                      onChange={handlePaperChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Research Area</label>
                    <input
                      type="text"
                      name="researchArea"
                      value={paperForm.researchArea}
                      onChange={handlePaperChange}
                      placeholder="e.g., Machine Learning"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">DOI</label>
                    <input
                      type="text"
                      name="doi"
                      value={paperForm.doi}
                      onChange={handlePaperChange}
                      placeholder="e.g., 10.1234/example"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Paper Link</label>
                  <input
                    type="url"
                    name="link"
                    value={paperForm.link}
                    onChange={handlePaperChange}
                    placeholder="https://example.com/paper"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Abstract</label>
                  <textarea
                    name="abstract"
                    value={paperForm.abstract}
                    onChange={handlePaperChange}
                    placeholder="Paper abstract"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Paper'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPaper(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {papers.length === 0 ? (
            <div className="bg-beige rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 text-lg">No papers published yet</p>
              <p className="text-gray-500 text-sm mt-2">Click "Add Paper" to publish your first paper</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {papers.map((paper) => (
                <div key={paper._id} className="bg-beige rounded-lg shadow-lg p-6 border-l-4 border-gold">
                  <h3 className="text-xl font-bold text-darkGreen mb-2">{paper.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Authors:</strong> {paper.authors || paper.author}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Year:</strong> {paper.year}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Journal:</strong> {paper.journal}
                  </p>
                  {paper.researchArea && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Research Area:</strong> {paper.researchArea}
                    </p>
                  )}
                  {paper.doi && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>DOI:</strong> {paper.doi}
                    </p>
                  )}
                  {paper.link && (
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Link:</strong>{' '}
                      <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Paper
                      </a>
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditPaper(paper)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePaper(paper._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-beige rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-darkGreen mb-6">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="password"
                value={passwordForm.password}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-darkGreen hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </main>
  );
};

export default FacultyDashboard;

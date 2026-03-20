import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { facultyAPI } from '../services/api';

const AddFaculty = () => {
  const navigate = useNavigate();
  const { id: facultyId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    researchArea: '',
    bio: '',
    photo: '',
  });

  useEffect(() => {
    if (facultyId) {
      const fetchFaculty = async () => {
        try {
          const response = await facultyAPI.getById(facultyId);
          setFormData(response.data.data);
        } catch (err) {
          setError('Failed to load faculty');
        }
      };
      fetchFaculty();
    }
  }, [facultyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (facultyId) {
        await facultyAPI.update(facultyId, formData);
      } else {
        await facultyAPI.create(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save faculty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="heading-1 mb-6">{facultyId ? 'Edit Faculty' : 'Add Faculty'}</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg">
          <div className="mb-4">
            <label className="block text-dark-green font-semibold mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-dark-green font-semibold mb-2">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
              />
            </div>
            <div>
              <label className="block text-dark-green font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-dark-green font-semibold mb-2">
              Research Area *
            </label>
            <input
              type="text"
              name="researchArea"
              value={formData.researchArea}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="mb-4">
            <label className="block text-dark-green font-semibold mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="mb-6">
            <label className="block text-dark-green font-semibold mb-2">
              Photo URL
            </label>
            <input
              type="url"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : facultyId ? 'Update Faculty' : 'Add Faculty'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddFaculty;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paperAPI, facultyAPI } from '../services/api';

const AddPaper = () => {
  const navigate = useNavigate();
  const { id: paperId } = useParams();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    journal: '',
    doi: '',
    link: '',
    abstract: '',
    researchArea: '',
    facultyId: '',
  });

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await facultyAPI.getAll();
        setFaculty(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (paperId) {
      const fetchPaper = async () => {
        try {
          const response = await paperAPI.getById(paperId);
          const paper = response.data.data;
          setFormData({
            title: paper.title,
            author: paper.author,
            year: paper.year,
            journal: paper.journal,
            doi: paper.doi || '',
            link: paper.link,
            abstract: paper.abstract || '',
            researchArea: paper.researchArea,
            facultyId: paper.facultyId._id,
          });
        } catch (err) {
          setError('Failed to load paper');
        }
      };
      fetchPaper();
    }
  }, [paperId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (paperId) {
        await paperAPI.update(paperId, formData);
      } else {
        await paperAPI.create(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save paper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="heading-1 mb-6">{paperId ? 'Edit Paper' : 'Add Paper'}</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg">
          <div className="mb-4">
            <label className="block text-dark-green font-semibold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-dark-green font-semibold mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
              />
            </div>
            <div>
              <label className="block text-dark-green font-semibold mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-dark-green font-semibold mb-2">
                Journal *
              </label>
              <input
                type="text"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
              />
            </div>
            <div>
              <label className="block text-dark-green font-semibold mb-2">
                DOI
              </label>
              <input
                type="text"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
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
              Link *
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="mb-4">
            <label className="block text-dark-green font-semibold mb-2">
              Abstract
            </label>
            <textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            />
          </div>

          <div className="mb-6">
            <label className="block text-dark-green font-semibold mb-2">
              Faculty *
            </label>
            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
            >
              <option value="">Select Faculty</option>
              {faculty.map(fac => (
                <option key={fac._id} value={fac._id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? 'Saving...' : paperId ? 'Update Paper' : 'Add Paper'}
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

export default AddPaper;

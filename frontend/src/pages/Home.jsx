import React, { useState, useEffect } from 'react';
import PaperCard from '../components/PaperCard';
import { paperAPI } from '../services/api';

const Home = () => {
  const [papers, setpapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [researchAreaFilter, setResearchAreaFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const isAdmin = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [papersRes, analyticsRes] = await Promise.all([
          paperAPI.getAll(),
          paperAPI.getAnalytics(),
        ]);
        setpapers(papersRes.data.data);
        setFilteredPapers(papersRes.data.data);
        setAnalytics(analyticsRes.data.data);
      } catch (err) {
        setError('Failed to load papers');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = papers;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (researchAreaFilter) {
      filtered = filtered.filter(p => p.researchArea === researchAreaFilter);
    }

    if (yearFilter) {
      filtered = filtered.filter(p => p.year === parseInt(yearFilter));
    }

    setFilteredPapers(filtered);
  }, [searchQuery, researchAreaFilter, yearFilter, papers]);

  const handleDeletePaper = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await paperAPI.delete(id);
        setpapers(papers.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete paper');
      }
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="heading-1">Research Papers</h1>
        <p className="text-lg text-gray-700 mb-4">
          Browse and search our comprehensive collection of research papers published by faculty members.
        </p>
      </section>

      {analytics && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="card bg-gold text-dark-green">
            <h3 className="heading-3">Total Papers</h3>
            <p className="text-4xl font-bold">{analytics.totalPapers}</p>
          </div>
          <div className="card bg-dark-green text-beige">
            <h3 className="heading-3">Research Areas</h3>
            <p className="text-4xl font-bold">{analytics.papersByArea.length}</p>
          </div>
        </section>
      )}

      <section className="mb-8 bg-white p-6 rounded shadow-lg">
        <h2 className="heading-2 mb-4">Filter & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
          />

          <select
            value={researchAreaFilter}
            onChange={(e) => setResearchAreaFilter(e.target.value)}
            className="px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
          >
            <option value="">All Research Areas</option>
            {analytics?.papersByArea.map(area => (
              <option key={area._id} value={area._id}>
                {area._id}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Filter by year..."
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 border border-gold rounded focus:outline-none focus:ring-2 focus:ring-dark-green"
          />
        </div>
      </section>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl">Loading papers...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No papers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map(paper => (
            <PaperCard
              key={paper._id}
              paper={paper}
              isAdmin={isAdmin}
              onDelete={handleDeletePaper}
            />
          ))}
        </div>
      )}

      {analytics?.latestPapers && (
        <section className="mt-16">
          <h2 className="heading-2 mb-6">Latest Publications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.latestPapers.slice(0, 3).map(paper => (
              <PaperCard key={paper._id} paper={paper} isAdmin={isAdmin} onDelete={handleDeletePaper} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;

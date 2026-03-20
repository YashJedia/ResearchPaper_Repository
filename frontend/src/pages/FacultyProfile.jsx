import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaperCard from '../components/PaperCard';
import { facultyAPI, paperAPI } from '../services/api';

const FacultyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [facultyRes, papersRes] = await Promise.all([
          facultyAPI.getById(id),
          paperAPI.search({ facultyId: id }),
        ]);
        setFaculty(facultyRes.data.data);
        setPapers(papersRes.data.data);
      } catch (err) {
        setError('Failed to load faculty profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDeletePaper = async (paperId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await paperAPI.delete(paperId);
        setPapers(papers.filter(p => p._id !== paperId));
      } catch (err) {
        alert('Failed to delete paper');
      }
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-6 py-12">
        <p className="text-center text-xl">Loading...</p>
      </main>
    );
  }

  if (error || !faculty) {
    return (
      <main className="container mx-auto px-6 py-12">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <button onClick={() => navigate('/faculty')} className="mb-6 text-gold hover:text-dark-green">
        ← Back to Faculty
      </button>

      <section className="bg-white p-8 rounded shadow-lg mb-12">
        <div className="flex gap-8 mb-6">
          {faculty.photo && (
            <img
              src={faculty.photo}
              alt={faculty.name}
              className="w-48 h-48 rounded object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="heading-1 mb-2">{faculty.name}</h1>
            <p className="text-xl text-gold font-semibold mb-2">{faculty.designation}</p>
            <p className="text-lg mb-4 font-serif text-dark-green">{faculty.researchArea}</p>
            <a href={`mailto:${faculty.email}`} className="text-gold hover:text-dark-green block mb-4">
              {faculty.email}
            </a>
            {faculty.bio && (
              <p className="text-gray-700 leading-relaxed">
                {faculty.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="heading-2 mb-6">Publications</h2>
        {papers.length === 0 ? (
          <p className="text-gray-600">No publications found for this faculty member.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.map(paper => (
              <PaperCard
                key={paper._id}
                paper={paper}
                isAdmin={isAdmin}
                onDelete={handleDeletePaper}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default FacultyProfile;

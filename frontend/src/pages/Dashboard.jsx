import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaperCard from '../components/PaperCard';
import FacultyCard from '../components/FacultyCard';
import { paperAPI, facultyAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [activeTab, setActiveTab] = useState('papers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [papersRes, facultyRes] = await Promise.all([
          paperAPI.getAll(),
          facultyAPI.getAll(),
        ]);
        setPapers(papersRes.data.data);
        setFaculty(facultyRes.data.data);
      } catch (err) {
        alert('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeletePaper = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await paperAPI.delete(id);
        setPapers(papers.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete paper');
      }
    }
  };

  const handleDeleteFaculty = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await facultyAPI.delete(id);
        setFaculty(faculty.filter(f => f._id !== id));
      } catch (err) {
        alert('Failed to delete faculty');
      }
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <section className="mb-8">
        <h1 className="heading-1 mb-4">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/add-paper')}
            className="btn-primary"
          >
            Add Paper
          </button>
          <button
            onClick={() => navigate('/add-faculty')}
            className="btn-primary"
          >
            Add Faculty
          </button>
        </div>
      </section>

      <section className="mb-8 border-b-2 border-gold">
        <div className="flex gap-6 mb-6">
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 font-semibold ${activeTab === 'papers' ? 'border-b-2 border-gold text-dark-green' : 'text-gray-600'}`}
          >
            Papers ({papers.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 font-semibold ${activeTab === 'faculty' ? 'border-b-2 border-gold text-dark-green' : 'text-gray-600'}`}
          >
            Faculty ({faculty.length})
          </button>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'papers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {papers.map(paper => (
                <PaperCard
                  key={paper._id}
                  paper={paper}
                  isAdmin={true}
                  onDelete={handleDeletePaper}
                />
              ))}
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty.map(fac => (
                <FacultyCard
                  key={fac._id}
                  faculty={fac}
                  isAdmin={true}
                  onDelete={handleDeleteFaculty}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;

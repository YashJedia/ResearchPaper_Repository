import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaperCard from '../components/PaperCard';
import FacultyCard from '../components/FacultyCard';
import { paperAPI, facultyAPI, adminFacultyAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('papers');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [papersRes, facultyRes, registrationsRes] = await Promise.all([
          paperAPI.getAll(),
          facultyAPI.getAll(),
          adminFacultyAPI.getPendingRegistrations(),
        ]);
        setPapers(papersRes.data.data);
        setFaculty(facultyRes.data.data);
        setPendingRegistrations(registrationsRes.data.data);
      } catch (err) {
        setError('Failed to load data');
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

  const handleApproveFaculty = async (id) => {
    try {
      setError('');
      await adminFacultyAPI.approveFaculty(id);
      setSuccess('Faculty approved successfully');
      setPendingRegistrations(pendingRegistrations.filter((f) => f._id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to approve faculty');
    }
  };

  const handleRejectFaculty = async (id) => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setError('');
      await adminFacultyAPI.rejectFaculty(id, rejectReason);
      setSuccess('Faculty rejected successfully');
      setPendingRegistrations(pendingRegistrations.filter((f) => f._id !== id));
      setRejectReason('');
      setSelectedFaculty(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to reject faculty');
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

      <section className="mb-8 border-b-2 border-gold">
        <div className="flex gap-6 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${activeTab === 'papers' ? 'border-b-2 border-gold text-darkGreen' : 'text-gray-600'}`}
          >
            Papers ({papers.length})
          </button>
          <button
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${activeTab === 'faculty' ? 'border-b-2 border-gold text-darkGreen' : 'text-gray-600'}`}
          >
            Faculty ({faculty.length})
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2 font-semibold whitespace-nowrap ${activeTab === 'registrations' ? 'border-b-2 border-gold text-darkGreen' : 'text-gray-600'}`}
          >
            Faculty Registrations ({pendingRegistrations.length})
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

          {activeTab === 'registrations' && (
            <div>
              {pendingRegistrations.length === 0 ? (
                <div className="bg-beige rounded-lg shadow-lg p-8 text-center">
                  <p className="text-gray-600 text-lg">No pending faculty registrations</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {pendingRegistrations.map((fac) => (
                    <div
                      key={fac._id}
                      className="bg-beige rounded-lg shadow-lg p-6 border-l-4 border-gold"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          {fac.photo && (
                            <img
                              src={fac.photo}
                              alt={fac.name}
                              className="w-16 h-16 rounded-full object-cover mb-3"
                            />
                          )}
                          <h3 className="text-xl font-bold text-darkGreen mb-2">{fac.name}</h3>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                <strong>Email:</strong> {fac.email}
                              </p>
                              <p className="text-gray-600">
                                <strong>Designation:</strong> {fac.designation}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">
                                <strong>Research Area:</strong> {fac.researchArea}
                              </p>
                              <p className="text-yellow-600 font-semibold">
                                Status: PENDING
                              </p>
                            </div>
                          </div>

                          {fac.bio && (
                            <p className="text-gray-600 mt-3 text-sm">
                              <strong>Bio:</strong> {fac.bio}
                            </p>
                          )}

                          <p className="text-gray-500 text-xs mt-3">
                            <strong>Registered:</strong>{' '}
                            {new Date(fac.registrationDate).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-6">
                          <button
                            onClick={() => handleApproveFaculty(fac._id)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setSelectedFaculty(fac._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* Rejection Form */}
                      {selectedFaculty === fac._id && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rejection Reason
                          </label>
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Provide reason for rejection..."
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 mb-3"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRejectFaculty(fac._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                            >
                              Confirm Rejection
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFaculty(null);
                                setRejectReason('');
                              }}
                              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;

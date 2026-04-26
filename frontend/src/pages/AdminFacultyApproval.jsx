import React, { useState, useEffect } from 'react';
import { adminFacultyAPI } from '../services/api';

const AdminFacultyApproval = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Fetch pending registrations
  useEffect(() => {
    fetchFacultyData();
  }, [activeTab]);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      
      if (activeTab === 'pending') {
        response = await adminFacultyAPI.getPendingRegistrations();
      } else {
        response = await adminFacultyAPI.getAllRegistrations();
      }
      
      setFacultyList(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load faculty registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFaculty = async (id) => {
    try {
      setError('');
      await adminFacultyAPI.approveFaculty(id);
      setSuccess('Faculty approved successfully');
      setFacultyList(facultyList.filter((f) => f._id !== id));
      setTimeout(() => {
        setSuccess('');
        fetchFacultyData();
      }, 2000);
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
      setSuccess('Faculty registration rejected');
      setRejectReason('');
      setSelectedFaculty(null);
      setFacultyList(facultyList.filter((f) => f._id !== id));
      setTimeout(() => {
        setSuccess('');
        fetchFacultyData();
      }, 2000);
    } catch (err) {
      setError('Failed to reject faculty');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-darkGreen mb-8">Faculty Registration Management</h1>

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
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'pending'
              ? 'text-darkGreen border-b-4 border-darkGreen'
              : 'text-gray-600 hover:text-darkGreen'
          }`}
        >
          Pending Approvals
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'all'
              ? 'text-darkGreen border-b-4 border-darkGreen'
              : 'text-gray-600 hover:text-darkGreen'
          }`}
        >
          All Faculty Registrations
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading faculty registrations...</p>
        </div>
      ) : facultyList.length === 0 ? (
        <div className="bg-beige rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            {activeTab === 'pending' ? 'No pending approvals' : 'No faculty registrations'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {facultyList.map((faculty) => (
            <div
              key={faculty._id}
              className="bg-beige rounded-lg shadow-lg p-6 border-l-4 border-gold"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {faculty.photo && (
                    <img
                      src={faculty.photo}
                      alt={faculty.name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold text-darkGreen mb-2">{faculty.name}</h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">
                        <strong>Email:</strong> {faculty.email}
                      </p>
                      <p className="text-gray-600">
                        <strong>Designation:</strong> {faculty.designation}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">
                        <strong>Research Area:</strong> {faculty.researchArea}
                      </p>
                      <p className={`font-semibold ${
                        faculty.registrationStatus === 'approved'
                          ? 'text-green-600'
                          : faculty.registrationStatus === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        Status: {faculty.registrationStatus?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {faculty.bio && (
                    <p className="text-gray-600 mt-4 text-sm">
                      <strong>Bio:</strong> {faculty.bio}
                    </p>
                  )}

                  <p className="text-gray-500 text-xs mt-4">
                    <strong>Registered:</strong>{' '}
                    {new Date(faculty.registrationDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                {faculty.registrationStatus === 'pending' && (
                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleApproveFaculty(faculty._id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSelectedFaculty(faculty._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {faculty.registrationStatus === 'approved' && (
                  <div className="ml-6 text-green-600 font-semibold text-center py-2 px-4 bg-green-50 rounded">
                    ✓ Approved
                  </div>
                )}

                {faculty.registrationStatus === 'rejected' && (
                  <div className="ml-6 text-red-600 font-semibold text-center py-2 px-4 bg-red-50 rounded">
                    ✗ Rejected
                  </div>
                )}
              </div>

              {/* Rejection Form */}
              {selectedFaculty === faculty._id && (
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
                      onClick={() => handleRejectFaculty(faculty._id)}
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
  );
};

export default AdminFacultyApproval;

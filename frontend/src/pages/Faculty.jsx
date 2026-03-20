import React, { useState, useEffect } from 'react';
import FacultyCard from '../components/FacultyCard';
import { facultyAPI } from '../services/api';

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAdmin = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin';

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const response = await facultyAPI.getAll();
        setFacultyList(response.data.data);
      } catch (err) {
        setError('Failed to load faculty');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const handleDeleteFaculty = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await facultyAPI.delete(id);
        setFacultyList(facultyList.filter(f => f._id !== id));
      } catch (err) {
        alert('Failed to delete faculty');
      }
    }
  };

  return (
    <main className="container mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="heading-1">Faculty Members</h1>
        <p className="text-lg text-gray-700 mb-4">
          Meet our distinguished faculty members and explore their research areas and publications.
        </p>
      </section>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-xl">Loading faculty...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : facultyList.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No faculty found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map(faculty => (
            <FacultyCard
              key={faculty._id}
              faculty={faculty}
              isAdmin={isAdmin}
              onDelete={handleDeleteFaculty}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Faculty;

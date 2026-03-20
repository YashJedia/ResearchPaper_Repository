import React from 'react';
import { Link } from 'react-router-dom';

const FacultyCard = ({ faculty, onDelete, isAdmin }) => {
  return (
    <div className="card hover:shadow-2xl transition text-center">
      {faculty.photo && (
        <img
          src={faculty.photo}
          alt={faculty.name}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
        />
      )}
      
      <h3 className="heading-3 mb-1">{faculty.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{faculty.designation}</p>
      <p className="text-sm text-gold font-semibold mb-2">{faculty.researchArea}</p>
      
      <p className="text-sm text-gray-600 mb-2">
        <a href={`mailto:${faculty.email}`} className="hover:text-gold">
          {faculty.email}
        </a>
      </p>
      
      {faculty.bio && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {faculty.bio}
        </p>
      )}
      
      <div className="flex justify-center gap-3">
        <Link
          to={`/faculty/${faculty._id}`}
          className="btn-primary text-sm"
        >
          View Profile
        </Link>
        {isAdmin && (
          <button
            onClick={() => onDelete(faculty._id)}
            className="btn-secondary text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default FacultyCard;

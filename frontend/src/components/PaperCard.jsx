import React from 'react';
import { Link } from 'react-router-dom';

const PaperCard = ({ paper, onDelete, isAdmin }) => {
  return (
    <div className="card hover:shadow-2xl transition">
      <div className="mb-3 flex justify-between items-start">
        <h3 className="heading-3 flex-1">{paper.title}</h3>
        {isAdmin && (
          <button
            onClick={() => onDelete(paper._id)}
            className="text-red-600 hover:text-red-800 ml-4"
          >
            Delete
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        <strong>Author:</strong> {paper.author}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Journal:</strong> {paper.journal || 'N/A'}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Year:</strong> {paper.year}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Research Area:</strong> {paper.researchArea}
      </p>
      
      {paper.abstract && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          <strong>Abstract:</strong> {paper.abstract}
        </p>
      )}
      
      <div className="flex justify-between items-center">
        <a
          href={paper.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm"
        >
          View Paper
        </a>
        {paper.facultyId && (
          <Link
            to={`/faculty/${paper.facultyId._id}`}
            className="text-sm text-gold hover:text-dark-green"
          >
            View Faculty
          </Link>
        )}
      </div>
    </div>
  );
};

export default PaperCard;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <header className="bg-dark-green text-beige py-6 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="heading-2 text-beige hover:text-gold">
          SCSS Research Archive
        </Link>
        <nav className="flex gap-8 items-center">
          <Link to="/" className="hover:text-gold transition">Home</Link>
          <Link to="/faculty" className="hover:text-gold transition">Faculty</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="hover:text-gold transition">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

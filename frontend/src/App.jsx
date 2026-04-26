import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Faculty from './pages/Faculty';
import FacultyProfile from './pages/FacultyProfile';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddPaper from './pages/AddPaper';
import AddFaculty from './pages/AddFaculty';
import FacultyDashboard from './pages/FacultyDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFacultyLoggedIn, setIsFacultyLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }

    // Check if faculty is logged in
    const facultyUser = localStorage.getItem('facultyUser');
    if (facultyUser) {
      setIsFacultyLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    const user = localStorage.getItem('user');
    const facultyUser = localStorage.getItem('facultyUser');
    
    if (user) {
      setIsLoggedIn(true);
    }
    if (facultyUser) {
      setIsFacultyLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleFacultyLogout = () => {
    setIsFacultyLoggedIn(false);
  };

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  const FacultyProtectedRoute = ({ element }) => {
    return isFacultyLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-beige">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        
        <div className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/faculty/:id" element={<FacultyProfile />} />
            
            {/* Login - Role-based (Admin & Faculty) */}
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            
            {/* Admin Routes */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/add-paper" element={<ProtectedRoute element={<AddPaper />} />} />
            <Route path="/add-paper/:id" element={<ProtectedRoute element={<AddPaper />} />} />
            <Route path="/add-faculty" element={<ProtectedRoute element={<AddFaculty />} />} />
            <Route path="/add-faculty/:id" element={<ProtectedRoute element={<AddFaculty />} />} />
            
            {/* Faculty Routes */}
            <Route path="/faculty-dashboard" element={<FacultyProtectedRoute element={<FacultyDashboard />} />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

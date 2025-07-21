import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="header">
      <div className="header-title">
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
      </div>
    </div>
  );
}

export default Header;

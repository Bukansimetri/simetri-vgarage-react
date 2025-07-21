import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import VirtualAIMechanicChat from './VirtualAIMechanicChat';

function Sidebar() {
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Virtual Garage</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/vehicle-add">Add Vehicle</Link>
          </li>
          <li>
            <button className="sidebar-btn" onClick={() => setAiChatOpen(true)}>
              Virtual AI Mechanic
            </button>
          </li>
          <li>
            <Link to="/self-diagnosis">Self Diagnosis</Link>
          </li>
          {/* <li>
            <button className="logout-btn-sidebar" onClick={handleLogout}>Logout</button>
          </li> */}
        </ul>
      </nav>
      <VirtualAIMechanicChat open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </aside>
  );
}

export default Sidebar;

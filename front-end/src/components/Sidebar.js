import './Sidebar.css'; // Import CSS for styling
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { FaHome, FaTachometerAlt, FaCogs, FaUser } from 'react-icons/fa'; // Icons for links

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <i className="close-btn" onClick={toggleSidebar}>×</i>
      <Link to="/" onClick={toggleSidebar}>
        <FaHome /> Home
      </Link>
      <Link to="/dashboard" onClick={toggleSidebar}>
        <FaTachometerAlt /> Dashboard
      </Link>
      <Link to="/settings" onClick={toggleSidebar}>
        <FaCogs /> Settings
      </Link>
      <Link to="/profile" onClick={toggleSidebar}>
        <FaUser /> Profile
      </Link>
    </div>
  );
};

export default Sidebar;

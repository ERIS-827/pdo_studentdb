import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; 
import logo from './assets/pdo.jpg';
import './App.css';  
import Dashboard from './components/Dashboard';  
import Sidebar from './components/Sidebar';  

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); 
  };

  return (
    <Router>
      <div className="app-container">
        
        {/* Header Section */}
        <header className="header">
          <div className="logo-container">
            <img src={logo} alt="Phaung Daw Oo International University" className="logo" />
            <h1>Phaung Daw Oo Student Database</h1>
          </div>
          <p className="gateway-text">Your gateway to manage student data efficiently</p>
        </header>

        {/* Sidebar and Toggle Button */}
        <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
          <div></div> {/* First line */}
          <div></div> {/* Second line */}
          <div></div> {/* Third line */}
        </button>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="main-content">
          {/* Routes */}
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {token && <Route path="/dashboard" element={<Dashboard />} />}
            <Route path="/" element={<Home />} />
            <Route path="/profile" component={Profile} />
          </Routes>
        </div>

        {/* Footer Section */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Phaung Daw Oo International University. All Rights Reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

// Home Component
const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-section">
        <h2>Welcome to the User Authentication System</h2>
        <div className="auth-links">
          <Link to="/signup" className="auth-link">
            <FaUserPlus /> Sign Up
          </Link>
          <Link to="/login" className="auth-link">
            <FaSignInAlt /> Log In
          </Link>
        </div>
      </div>

      <div className="about-school-container">
        <h3>About Phaung Daw Oo International University</h3>
        <p>
          Phaung Daw Oo International University (PIU) is dedicated to providing a world-class education
          that empowers students to succeed in their academic and professional lives. Our university offers
          a variety of academic programs, cutting-edge resources, and a vibrant campus life that fosters
          personal growth and community engagement.
        </p>
        <p>
          With a team of experienced faculty and modern facilities, PIU aims to nurture the leaders of tomorrow.
          Our commitment to academic excellence and holistic development ensures that our students are well-prepared
          to meet the challenges of an ever-changing world.
        </p>
      </div>
    </div>
  );
};

export default App;

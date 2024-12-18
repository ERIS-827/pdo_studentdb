import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Dashboard.css'; // Ensure the CSS file is imported

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate to navigate

  const getDashboard = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login first.');
        setIsLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserInfo(response.data.user);
      setStudents(response.data.students);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.message || 'An error occurred while fetching data.');
      console.error(error.response?.data || error.message);
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Navigate to login page
  };

  // Function to format date using date-fns
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <button onClick={getDashboard} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Dashboard'}
      </button>

      {error && <p className="error">{error}</p>}

      {userInfo && (
        <div>
          <h3>Welcome!</h3>
          <p>Email: {userInfo.email}</p>
        </div>
      )}

      {students && students.length > 0 && (
        <div className="table-container">
          <h3>Student Data</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>DOB</th>
                <th>Enrollment Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.address}</td>
                  <td>{formatDate(student.dob)}</td> {/* Format DOB */}
                  <td>{formatDate(student.enrollment_date)}</td> {/* Format Enrollment Date */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

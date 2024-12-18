import React, { useEffect, useState } from 'react';
import settings from '../settings'; // Import settings.js

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${settings.apiUrl}/dashboard`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.log('Error:', error));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

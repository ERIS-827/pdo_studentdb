import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info from localStorage on component mount
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log("Stored User Info:", storedUserInfo);  // Log to check the value

    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      console.log("User info is not available.");
    }
  }, []);

  if (!userInfo) {
    return <p>Loading user info...</p>;  // Show a loading message if user info is not yet available
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h3>Welcome, {userInfo.username}!</h3>
        <p>Email: {userInfo.email}</p>
      </div>
    </div>
  );
};

export default Profile;

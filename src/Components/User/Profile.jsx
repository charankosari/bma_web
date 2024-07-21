import React, { useState, useEffect } from 'react';
import './Profile.css';
import Navbar from '../Navbar';
import Footer from '../Footer';
import axios from 'axios';

function Profile({ login, toggleLogin, mobile, setMobile }) {
  const [userDetails, setUserDetails] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
          throw new Error('JWT token not found in localStorage');
        }
  
        const response = await axios.get('https://server.bookmyappointments.in/api/bma/me', {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        });
        setUserDetails(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  return (
    <div>
      <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />
      <div className="profile-container">
        <div className="form-section">
          <h1>Account Information</h1>
          <div className="form-group-email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={userDetails.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-mobile">
            <label htmlFor="mobile">Mobile</label>
            <input
              type="text"
              id="mobile"
              value={userDetails.number}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-section">
          <h1>Personal Information</h1>
          <div className="form-group-name">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={userDetails.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-birthday">
            <label htmlFor="birthday">Birthday</label>
            <input
              type="date"
              id="birthday"
              value={userDetails.birthday}
              onChange={handleChange}
            />
          </div>
          <div className="form-group-gender">
            <label htmlFor="gender">Gender</label>
            <input
              type="text" 
              id="gender"
              value={userDetails.gender}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;

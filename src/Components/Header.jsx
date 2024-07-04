import React, { useState } from 'react';
import './Header.css';
import logo from '../Assets/logo.png';
import { FaUser, FaDotCircle } from 'react-icons/fa';

function Header({ setMobile, mobile, login }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleVerify = () => {
    setMobile(!mobile);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search for Hospitals, Labs" />
      </div>
      <div className="location-selector">
        <span className="location-icon"><FaDotCircle /></span>
        <select>
          <option>Select Location</option>
          <option>Hyderabad</option>
          <option>Banjara Hills</option>
          <option>Jubilee Hills</option>
          <option>Gachibowli</option>
          <option>Ameerpet</option>
          {/* Add more specific locations in Hyderabad */}
        </select>
      </div>
      <div className="user-icon" onClick={toggleDropdown}>
        <FaUser />
        {isDropdownOpen && (
          <div className="dropdown-content">
            <a href="#">Profile</a>
            <a href="#">Bookings</a>
            <a href="#">Favorites</a>
            <a href="#">Medical Records</a>
            <a href="#">Help</a>
            <a href="#">Sign Out</a>
          </div>
        )}
      </div>
      {!login && (
        <button className="login-button" onClick={handleVerify}>Login / Signup</button>
      )}
    </header>
  );
}

export default Header;
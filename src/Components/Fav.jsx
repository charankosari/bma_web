import React, { useState } from 'react';
import './Fav.css'; // Ensure you create this CSS file for styling
import Navbar from './Navbar';

function Fav({ login, toggleLogin, mobile, setMobile }) {
  const [activeTab, setActiveTab] = useState('doctors');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />
      <div className="fav-container">
        <div className="fav-split-button">
          <button
            className={`fav-tab-button left ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => handleTabClick('doctors')}
          >
            Doctors
          </button>
          <button
            className={`fav-tab-button right ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => handleTabClick('tests')}
          >
            Tests
          </button>
        </div>
        <div className="fav-content">
          No records
        </div>
      </div>
    </div>
  );
}

export default Fav;

import React, { useState, useEffect } from 'react';
import './Fav.css'; // Ensure you create this CSS file for styling
import Navbar from './Navbar';

function Fav({ login, toggleLogin, mobile, setMobile }) {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [tests, setTests] = useState([]);
  const [jwt, setJwt] = useState('');
  const [activeTab, setActiveTab] = useState('doctors');

  // Function to fetch doctor and hospital data
  const fetchDoctorAndHospitalData = async (itemId, hospitalId) => {
    setLoading(true);
    try {
      const doctorResponse = await fetch(`https://server.bookmyappointments.in/api/bma/doc/${itemId}`);
      const hospitalResponse = await fetch(`https://server.bookmyappointments.in/api/bma/hospital/hospital/${hospitalId}`);
      
      const doctorData = await doctorResponse.json();
      const hospitalData = await hospitalResponse.json();
      
      setLoading(false);
      return { doctor: doctorData, hospital: hospitalData };
    } catch (error) {
      setLoading(false);
      console.error("Error fetching doctor or hospital data:", error);
      return null;
    }
  };

  // Fetch wishlist items from API
  useEffect(() => {
    const fetchWishlist = async () => {
      const jwtToken = ''; // Replace with your AsyncStorage retrieval logic
      try {
        setJwt(jwtToken);
        const response = await fetch('https://server.bookmyappointments.in/api/bma/me/wishlist', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const responseData = await response.json();
        if (responseData.success) {
          setDoctors(responseData.data.doctors || []);
          setTests(responseData.data.tests || []);
        } else {
          console.error("Error fetching wishlist:", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Handle tab click
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
          {/* Conditional rendering based on activeTab */}
          {activeTab === 'doctors' && (
            <div>
              {loading ? (
                <div>Loading doctors...</div>
              ) : (
                <div>
                  {doctors.length > 0 ? (
                    <div>
                      {doctors.map((doctor) => (
                        <div key={doctor._id} className="doctor-card">
                          <img src="https://example.com/default-image.jpg" alt="Doctor" className="doctor-image" />
                          <div className="doctor-details">
                            <div className="doctor-name">{doctor.name}</div>
                            <div className="doctor-specialist">{doctor.specialist}</div>
                            <div className="doctor-study">{doctor.study}</div>
                            <div className="doctor-experience">Experience: {doctor.experience || 'N/A'} years</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No doctors found.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div>
              {loading ? (
                <div>Loading tests...</div>
              ) : (
                <div>
                  {tests.length > 0 ? (
                    <div>
                      {tests.map((test) => (
                        <div key={test._id} className="test-card">
                          <img src="https://example.com/default-image.jpg" alt="Test" className="test-image" />
                          <div className="test-details">
                            <div className="test-name">{test.name}</div>
                            <div className="test-testName">{test.testName}</div>
                            {/* Add other fields specific to tests as needed */}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>No tests found.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Fav;

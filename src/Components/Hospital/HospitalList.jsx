import React, { useState, useEffect } from "react";
import './HospitalList.css';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const HospitalList = ({ login, toggleLogin, mobile, setMobile }) => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [hospitalsData, setHospitalsData] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/admin/getallhospitals',{
          
        });
        const data = await response.json();
        if (data.success) {
          const formattedData = data.hospitals.map(hospital => ({
            id: hospital._id,
            name: hospital.hospitalName,
            location: hospital.address[0].city,
            image: hospital.image[0] || '',
            taglines: hospital.category.map(category => category.types),
          }));
          setHospitalsData(formattedData);
          console.log(hospitalsData)
          setFilteredHospitals(formattedData);
        }
      } catch (error) {
        console.error("Error fetching hospital data: ", error);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    const currentLocation = localStorage.getItem('currentLocation');
    const areaName = localStorage.getItem('areaName');
    const selectedLocation = localStorage.getItem('selectedLocation');

    if (currentLocation) {
      setCurrentLocation(JSON.parse(currentLocation));
    }
    if (areaName) {
      setAreaName(areaName);
    }
    if (selectedLocation) {
      setSelectedLocation(selectedLocation);
    }
  }, []);

  useEffect(() => {
    if (selectedLocation && selectedLocation !== "Current Location") {
      setAreaName(selectedLocation);
      filterHospitals(selectedLocation);
    } else if (selectedLocation === "Current Location" && currentLocation) {
      fetchAreaName(currentLocation.latitude, currentLocation.longitude);
    } else {
      setFilteredHospitals(hospitalsData);
    }
  }, [selectedLocation, currentLocation, hospitalsData]);

  const fetchAreaName = async (latitude, longitude) => {
    const apiKey = "5938214220714bcc8b8391bf94346dfc"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const area = components.neighbourhood || components.suburb || components.village || "Unknown";
        setAreaName(area);
        setSelectedLocation(area);
        localStorage.setItem("selectedLocation", area);
        filterHospitals(area);
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching area name: ", error);
    }
  };

  const filterHospitals = (location) => {
    const filtered = hospitalsData.filter((hospital) =>
      hospital.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredHospitals(filtered);
  };

  const handleHospitalClick = (hospitalId) => {
    window.location.href = `/hospitaldetail/${hospitalId}`;
  };

  return (
    <div>
      <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />
      <div className="hospital-list-container">
        <div className="hospital-list-inner">
          <div className="hospital-list-scrollable">
            {filteredHospitals.length === 0 ? (
              <div className="no-hospitals-found">
                No hospitals found.
              </div>
            ) : (
              filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="hospital-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2BB673";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#D9D9D9";
                  }}
                  onClick={() => handleHospitalClick(hospital.id)}
                >
                  {hospital.image && (
                    <img
                      src={hospital.image}
                      alt="logo"
                      className="hospital-logo"
                    />
                  )}
                  <div>
                    <div className="hospital-name">{hospital.name}</div>
                    <div className="hospital-location">{hospital.location}</div>
                    <div className="hospital-tagline">{hospital.taglines.join(", ")}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HospitalList;

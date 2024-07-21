import React, { useState, useEffect } from "react";
import './LabList.css';
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

const LabList = ({ login, toggleLogin, mobile, setMobile }) => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/admin/getallhospitals');
        const data = await response.json();
        if (data.success) {
          const formattedData = data.hospitals
            .filter(hospital => hospital.role === "lab")
            .map(lab => ({
              id: lab._id,
              name: lab.hospitalName,
              location: lab.address[0].city,
              image: lab.image[0] || '',
              taglines: lab.category.map(cat => cat.types)
            }));
          setLabsData(formattedData);
          setFilteredLabs(formattedData);
        }
      } catch (error) {
        console.error("Error fetching labs data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
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
      filterLabs(selectedLocation);
    } else if (selectedLocation === "Current Location" && currentLocation) {
      fetchAreaName(currentLocation.latitude, currentLocation.longitude);
    } else {
      setFilteredLabs(labsData);
    }
  }, [selectedLocation, currentLocation, labsData]);

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
        filterLabs(area);
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching area name: ", error);
    }
  };

  const filterLabs = (location) => {
    const filtered = labsData.filter((lab) =>
      lab.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredLabs(filtered);
  };

  const handleLabClick = (labId) => {
    console.log(labId)
    navigate(`/labdetail/${labId}`);
  };

  return (
    <div>
      <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />
      <div className="hospital-list-container">
        <div className="hospital-list-inner">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="hospital-list-scrollable">
              {filteredLabs.length === 0 ? (
                <div className="no-hospitals-found">
                  No labs found.
                </div>
              ) : (
                filteredLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="hospital-card"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2BB673";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#D9D9D9";
                    }}
                    onClick={() => handleLabClick(lab.id)}
                  >
                    {lab.image && (
                      <img
                        src={lab.image}
                        alt="logo"
                        className="hospital-logo"
                      />
                    )}
                    <div>
                      <div className="hospital-name">{lab.name}</div>
                      <div className="hospital-location">{lab.location}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LabList;

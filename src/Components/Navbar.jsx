import { FaChevronDown, FaSearch } from "react-icons/fa";
import logo from "../Assets/logo.png";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file
import { useEffect, useState } from "react";

const Navbar = ({ login, mobile, setMobile, toggleLogin }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    if(isAvatarDropdownOpen){
      setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
    }
  };

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
    if(isLocationDropdownOpen){
      setIsLocationDropdownOpen(!isLocationDropdownOpen);
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem("selectedLocation");
    if (storedLocation && storedLocation !== "Current Location") {
      setSelectedLocation(storedLocation);
      setAreaName(storedLocation);
    } else {
      setSelectedLocation("Select location");
    }
  }, []);

  useEffect(() => {
    if (
      selectedLocation &&
      selectedLocation !== "Select location" &&
      selectedLocation !== "Current Location"
    ) {
      setAreaName(selectedLocation);
    } else if (selectedLocation === "Current Location" && currentLocation) {
      fetchAreaName(currentLocation.latitude, currentLocation.longitude);
    }
  }, [selectedLocation, currentLocation]);

  const handleVerify = () => {
    setMobile(!mobile);
  };

  const handleSelectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          console.log("Current Location: ", { latitude, longitude });
          fetchAreaName(latitude, longitude);
          // Set selected location and store it in local storage
          setSelectedLocation("Current Location");
          localStorage.setItem("selectedLocation", "Current Location");
          // Close the dropdown
          setIsLocationDropdownOpen(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const fetchAreaName = async (latitude, longitude) => {
    const apiKey = "5938214220714bcc8b8391bf94346dfc"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const area =
          components.neighbourhood ||
          components.suburb ||
          components.village ||
          "Unknown";
        // Update area name
        setAreaName(area);
        // Update selected location and store it in local storage
        setSelectedLocation(area);
        localStorage.setItem("AreaName", area);
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching area name: ", error);
    }
  };

  const handleCitySelect = (city) => {
    setAreaName(city);
    setSelectedLocation(city); // Set selected location
    localStorage.setItem("selectedLocation", city); // Store in local storage
    // Close the dropdown
    setIsLocationDropdownOpen(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn"
            onClick={toggleLocationDropdown}
          >
            <div style={{ display: 'flex', marginRight: '-15px' }}>
              <FaLocationDot className="location-icon" />
              <div className="location-title" >{selectedLocation || "Select location"}</div>
              <FaChevronDown className="chevron-icon" />
            </div>
          </div>
          {isLocationDropdownOpen && (
            <div className="location-dropdown">
              <p onClick={handleSelectCurrentLocation}>
                Select Current Location 
              </p>
              <p onClick={() => handleCitySelect("Gachibowli")}>Gachibowli</p>
              <p onClick={() => handleCitySelect("Banjara Hills")}>
                Banjara Hills
              </p>
              <p onClick={() => handleCitySelect("Jubilee Hills")}>
                Jubilee Hills
              </p>
              <p onClick={() => handleCitySelect("Hitech City")}>
                Hitech City
              </p>
              <p onClick={() => handleCitySelect("Secunderabad")}>
                Secunderabad
              </p>
            </div>
          )}
        </div>
      </div>
      {login ? (
        <div className="dropdown-end">
          <div  role="button" className="avatar" onClick={toggleAvatarDropdown}>
            <div className="avatar-image">
              <img
                alt="User Avatar"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          {isAvatarDropdownOpen && (
            <div className="menu-dropdown">
              <Link to="/profile" style={{textAlign:'center'}}>Profile</Link>
              <Link to="/book" style={{textAlign:'center'}}>Bookings</Link>
              <Link to="/fav" style={{textAlign:'center'}}>Favorites</Link>
              <Link to="/records" style={{textAlign:'center'}}>Medical Records</Link>
              <Link>Help</Link>
              <p
                style={{ color: "red", marginLeft: "10px", marginTop: "8px", marginBottom: '0px' }}
                onClick={toggleLogin}
              >
                Sign Out
              </p>
            </div>
          )}
        </div>
      ) : (
        <button className="login-button" onClick={handleVerify}>
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;

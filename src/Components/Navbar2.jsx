import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import logo from "../Assets/logo.png";
import "./Navbar.css";

const Navbar = ({
  mobile,
  setMobile,
  toggleLogin,
  searchQuery,
  setSearchQuery,
  setSelectedLocation,
}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setLogin(true);
    }
  }, []);

  // useEffect(() => {
  //   if (selectedLocation && selectedLocation !== 'Select location') {
  //     setAreaName(selectedLocation);
  //   } else if (selectedLocation === 'Current Location' && currentLocation) {
  //     fetchAreaName(currentLocation.latitude, currentLocation.longitude);
  //   }
  // }, [selectedLocation, currentLocation]);

  useEffect(() => {}, [searchQuery]);

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".dropdown") &&
      !event.target.closest(".dropdown-end")
    ) {
      setIsLocationDropdownOpen(false);
      setIsAvatarDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleVerify = () => {
    setMobile(!mobile);
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
    if (isAvatarDropdownOpen) {
      setIsAvatarDropdownOpen(false);
    }
  };

  const toggleAvatarDropdown = () => {
    setIsAvatarDropdownOpen(!isAvatarDropdownOpen);
    if (isLocationDropdownOpen) {
      setIsLocationDropdownOpen(false);
    }
  };

  const handleSelectCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          fetchAreaName(latitude, longitude);
          setSelectedLocation("Current Location");
          localStorage.setItem("selectedLocation", "Current Location");
          setIsLocationDropdownOpen(false);
        },
        (error) => {
          console.error("Error getting location: ", error);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  const fetchAreaName = async (latitude, longitude) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.locality) {
        const locality = data.locality;
        setAreaName(locality);
        setSelectedLocation(locality);
        localStorage.setItem("selectedLocation", locality);
      } else {
        console.error("Locality not found");
      }
    } catch (error) {
      console.error("Error fetching area name: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setAreaName(city);
    setSelectedLocation(city);
    localStorage.setItem("selectedLocation", city);
    setIsLocationDropdownOpen(false);
  };

  const handleNoneSelect = () => {
    setAreaName("");
    setSelectedLocation("Select location");
    localStorage.removeItem("selectedLocation");
    setIsLocationDropdownOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log("Search query: ", searchQuery);
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="logo"
            style={{ height: "60px", width: "auto" }}
          />
        </Link>

        <h2
          style={{ color: "white", fontWeight: "normal" }}
          className="bookmyappointments"
        >
          BookMyAppointments
        </h2>
      </div>
      {login ? (
        <div className="dropdown-end" style={{ marginRight: "10px" }}>
          <div role="button" className="avatar" onClick={toggleAvatarDropdown}>
            <Avatar name="User" round={true} size="40" />
          </div>
          {isAvatarDropdownOpen && (
            <div className="menu-dropdown">
              <Link to="/profile" style={{ textAlign: "center" }}>
                Profile
              </Link>
              <Link to="/bookings" style={{ textAlign: "center" }}>
                Bookings
              </Link>
              <Link to="/fav" style={{ textAlign: "center" }}>
                Favorites
              </Link>
              <Link to="/records" style={{ textAlign: "center" }}>
                Medical Records
              </Link>
              <Link to="/help-support">help and support</Link>
              <p
                style={{
                  color: "red",
                  marginLeft: "10px",
                  marginTop: "8px",
                  marginBottom: "0px",
                }}
                onClick={() => {
                  localStorage.removeItem("jwtToken");
                  setLogin(false);
                  toggleLogin();
                }}
              >
                Sign Out
              </p>
            </div>
          )}
        </div>
      ) : (
        <button
          className="login-button"
          onClick={handleVerify}
          style={{ marginRight: "10px" }}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;

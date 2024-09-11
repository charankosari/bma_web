import React, { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./Components/LandingPage";
import Profile from "./Components/User/Profile";
import HospitalList from "./Components/Hospital/HospitalList";
import HospitalDetailsPage from "./Components/Hospital/HospitalDetails";
import Records from "./Components/User/Records";
import DoctorScreen from "./Components/Hospital/DoctorScreen";
import Fav from "./Components/User/Fav";
import LabList from "./Components/Lab/LabList";
import LabDetailsPage from "./Components/Lab/LabDetails";
import MobileVerify from "./Components/Auth/MobileVerify";
import Signup from "./Components/Auth/Signup";
import OtpScreen from "./Components/Auth/OtpScreen";
import OtpRegister from "./Components/Auth/OtpRegister";
import Bookings from "./Components/User/Bookings";
import BookingScreen from "./Components/Hospital/BookingScreen";
import TermsAndConditions from "./Components/termsandpolicy/TermsAndConditions";
import PrivacyPolicy from "./Components/termsandpolicy/PrivacyPolicy";
import LabScreen from "./Components/Lab/LabScreen";
import LabBookingScreen from "./Components/Lab/LabBookingScreen";
import HelpAndSupport from "./Components/HelpAndSupport";
import Navbar from "./Components/Navbar"; // Main Navbar
import Navbar2 from "./Components/Navbar2"; // Alternate Navbar

function App() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const [otp, setOtp] = useState(false);
  const [reg, setReg] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleLogin = useCallback(() => setLogin((prev) => !prev), []);
  const toggleMobile = useCallback(() => setMobile((prev) => !prev), []);
  const toggleOtp = useCallback(() => setOtp((prev) => !prev), []);
  const toggleReg = useCallback(() => setReg((prev) => !prev), []);
  const toggleSignup = useCallback(() => setShowSignup((prev) => !prev), []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <LandingPage
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/fav"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <Fav
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/terms-conditions"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <TermsAndConditions
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <PrivacyPolicy
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/help-support"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <HelpAndSupport
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <Profile
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/bookings"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <Bookings
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/doctorbooking"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <BookingScreen
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/labbooking"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <LabBookingScreen
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/doctor/:id"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <DoctorScreen
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/test/:id"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <LabScreen
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />

        <Route
          path="/records"
          element={
            <>
              <Navbar2
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                loggedIn={loggedIn}
              />
              <Records
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />

        {/* Routes with Navbar */}
        <Route
          path="/hospitaldetail/:id"
          element={
            <>
              <Navbar
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                loggedIn={loggedIn}
              />
              <HospitalDetailsPage
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                searchQuery={searchQuery}
                setMobile={setMobile}
              />
            </>
          }
        />
        <Route
          path="/labdetail/:id"
          element={
            <>
              <Navbar
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                loggedIn={loggedIn}
              />
              <LabDetailsPage
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
                searchQuery={searchQuery}
              />
            </>
          }
        />
        <Route
          path="/hospital"
          element={
            <>
              <Navbar
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                loggedIn={loggedIn}
              />
              <HospitalList
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
                searchQuery={searchQuery}
                selectedLocation={selectedLocation}
              />
            </>
          }
        />
        <Route
          path="/lab"
          element={
            <>
              <Navbar
                mobile={mobile}
                setMobile={setMobile}
                toggleLogin={toggleLogin}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                loggedIn={loggedIn}
              />
              <LabList
                login={login}
                toggleLogin={toggleLogin}
                mobile={mobile}
                setMobile={setMobile}
              />
            </>
          }
        />
      </Routes>
      {mobile && (
        <MobileVerify
          toggleMobile={toggleMobile}
          toggleLogin={toggleLogin}
          toggleOtp={toggleOtp}
          setMobileNumber={setMobileNumber}
          mobileNumber={mobileNumber}
          toggleSignup={toggleSignup}
        />
      )}
      {otp && (
        <OtpScreen
          toggleLogin={toggleLogin}
          toggleOtp={toggleOtp}
          mobileNumber={mobileNumber}
          Log={setLoggedIn}
        />
      )}
      {reg && (
        <OtpRegister
          toggleLogin={toggleLogin}
          toggleReg={toggleReg}
          mobileNumber={mobileNumber}
        />
      )}
      {showSignup && (
        <Signup
          toggleReg={toggleReg}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          toggleMobile={toggleMobile}
          toggleSignup={toggleSignup}
        />
      )}
    </BrowserRouter>
  );
}

export default App;

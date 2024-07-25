import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage';
import Profile from './Components/User/Profile';
import HospitalList from './Components/Hospital/HospitalList';
import Navbar from './Components/Navbar';
import HospitalDetailsPage from './Components/Hospital/HospitalDetails';
import Records from './Components/User/Records';
import DoctorScreen from './Components/Hospital/DoctorScreen'
import Fav from './Components/User/Fav';
import LabList from './Components/Lab/LabList';
import LabDetailsPage from './Components/Lab/LabDetails';
import MobileVerify from './Components/Auth/MobileVerify';
import Signup from './Components/Auth/Signup';
import OtpScreen from './Components/Auth/OtpScreen';
import OtpRegister from './Components/Auth/OtpRegister';
import Bookings from './Components/User/Bookings';
import BookingScreen from './Components/Hospital/BookingScreen';
import TermsAndConditions from './Components/termsandpolicy/TermsAndConditions';
import PrivacyPolicy from './Components/termsandpolicy/PrivacyPolicy';
import LabScreen from './Components/Lab/LabScreen'
import LabBookingScreen from './Components/Lab/LabBookingScreen'
import HelpAndSupport from './Components/HelpAndSupport';
function App() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const [otp, setOtp] = useState(false);
  const [reg, setReg] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const toggleLogin = () => setLogin(prev => !prev);
  const toggleMobile = () => setMobile(prev => !prev);
  const toggleOtp = () => setOtp(prev => !prev);
  const toggleReg = () => setReg(prev => !prev);
  const toggleSignup = () => setShowSignup(prev => !prev);

  return (
    <BrowserRouter>
      <Navbar 
        mobile={mobile} 
        setMobile={setMobile} 
        toggleLogin={toggleLogin} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
      />
      <Routes>
        <Route path="/" element={<LandingPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path='/fav' element={<Fav login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}/>
        <Route path="/profile" element={<Profile login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path="/bookings" element={<Bookings login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path="/doctorbooking" element={<BookingScreen login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path="/labbooking" element={<LabBookingScreen login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path="/doctor/:id" element={<DoctorScreen login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path="/test/:id" element={<LabScreen login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path='/terms-conditions' element={<TermsAndConditions login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}  />} />
        <Route path="/lab" element={<LabList login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} searchQuery={searchQuery} selectedLocation={selectedLocation}/>}  /> 
        <Route path='/hospital' element={<HospitalList login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} searchQuery={searchQuery} selectedLocation={selectedLocation} />} />
        <Route exact path="/hospitaldetail/:id" element={<HospitalDetailsPage  login={login} toggleLogin={toggleLogin} mobile={mobile} searchQuery={searchQuery} setMobile={setMobile}/>} />
        <Route exact path="/labdetail/:id" element={<LabDetailsPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} searchQuery={searchQuery} />} />
        <Route exact path="/records" element={<Records login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route exact path="/help-support" element={<HelpAndSupport login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
      </Routes>
      {mobile && <MobileVerify toggleMobile={toggleMobile} toggleLogin={toggleLogin} toggleOtp={toggleOtp} setMobileNumber={setMobileNumber} mobileNumber={mobileNumber} toggleSignup={toggleSignup}/>}
      {otp && <OtpScreen toggleLogin={toggleLogin} toggleOtp={toggleOtp} mobileNumber={mobileNumber}/>}
      {reg && <OtpRegister toggleLogin={toggleLogin} toggleReg={toggleReg} mobileNumber={mobileNumber}/>}
      {showSignup && <Signup toggleReg={toggleReg} mobileNumber={mobileNumber} setMobileNumber={setMobileNumber} toggleMobile={toggleMobile} toggleSignup={toggleSignup}/>}
    </BrowserRouter>
  );
}

export default App;

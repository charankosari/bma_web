import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './Components/LandingPage';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MobileVerify from './Components/Auth/MobileVerify';
import Signup from './Components/Auth/Signup';
import OtpScreen from './Components/Auth/OtpScreen';
import OtpRegister from './Components/Auth/OtpRegister';

import Profile from './Components/User/Profile';
import HospitalList from './Components/Hospital/HospitalList';
import Doctors from './Components/Doctor/Doctors';
import Navbar from './Components/Navbar';
import Bookings from './Components/Bookings';
import HospitalDetailsPage from './Components/Hospital/HospitalDetails';
import Booking from './Components/Booking';
import Checkout from './Components/Checkout';
import Records from './Components/Records'
import LabPage from './Components/Lab';
import Checkout1 from './Components/Checkout1';
import BookingConfirmation from './Components/Confirm';
import Fav from './Components/Fav';
import LabList from './Components/Lab/LabList';
import LabDetailsPage from './Components/Lab/LabDetails';

function App() {
  const [mobile, setMobile] = useState(false);
  const [login, setLogin] = useState(false);
  const [otp, setOtp] = useState(false);
  const [reg, setReg] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('');
  const [showSignup, setShowSignup] = useState(false);


  const toggleLogin = () => setLogin(prev => !prev);
  const toggleMobile = () => setMobile(prev => !prev);
  const toggleOtp = () => setOtp(prev => !prev );   
  const toggleReg = () => setReg(prev => !prev);
  const toggleSignup = () => setShowSignup(prev => !prev);

  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<LandingPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path='/fav' element={<Fav login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}/>
        <Route path="/lab" element={<LabList login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path="/confirm" element={<BookingConfirmation login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />

        <Route path="/profile" element={<Profile login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
        <Route path='/book' element={<Bookings login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}/>
        <Route path='/hospital' element={<HospitalList login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}/>

        <Route path='/doctor' element={<Doctors login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}/>
        <Route exact path="/hospitaldetail/:id" element={<HospitalDetailsPage  login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />

        <Route exact path="/labdetail/:hospitalId" element={<LabDetailsPage login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile} />} />
        <Route exact path="/records" element={<Records login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>} />
<Route path='/checkout1' element={<Checkout1 login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}/>
        <Route
          exact
          path="/hospital/:hospitalId/card/:cardNumber/doctor/:doctorId"
          element={<Booking login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}
        />
        <Route
          exact
          path="/hospital/:hospitalId/card/:cardNumber/doctor/:doctorId/checkout"
          element={<Checkout login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>}
        />
      </Routes>
      {mobile && <MobileVerify toggleMobile={toggleMobile} toggleLogin={toggleLogin} toggleOtp={toggleOtp} setMobileNumber={setMobileNumber} mobileNumber={mobileNumber} toggleSignup={toggleSignup}/>}
      {otp && <OtpScreen toggleLogin={toggleLogin} toggleOtp={toggleOtp} mobileNumber={mobileNumber}/>}
      {reg && <OtpRegister toggleLogin={toggleLogin} toggleReg={toggleReg} mobileNumber={mobileNumber}/>}
     {showSignup && <Signup toggleReg={toggleReg} mobileNumber={mobileNumber} setMobileNumber={setMobileNumber} toggleMobile={toggleMobile} toggleSignup={toggleSignup}/>}
      

    </BrowserRouter>
  );
}

export default App;

import React, { useRef, useState } from 'react';
import './OtpScreen.css';
import { useNavigate, useLocation } from 'react-router-dom';

function OtpScreen({ toggleLogin, toggleOtp, mobileNumber }) {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {number} = Number(mobileNumber); 
  const [otpno, setOtpno] = useState(Array(4).fill(''));
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 3) {
      inputRefs.current[index + 1].focus();
    }
    setOtpno(prevOtp => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const otpNumber = Number(otpno.join(''));
const userid=sessionStorage.getItem('userid')
    try {
      const response = await fetch("https://server.bookmyappointments.in/api/bma/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid, otp: otpNumber }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('jwtToken', data.jwtToken);
        navigate('/');  
        toggleLogin();
        toggleOtp();
      } else {
        alert(data.message || 'Invalid response from server');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp">
        <h3>We have sent you the code to your mobile number</h3>
        <div className="otp-inputs">
          {otpno.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={el => inputRefs.current[index] = el}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
              value={digit}
              disabled={loading}
            />
          ))}
        </div>
        <button className="verify-button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Verifying...' : 'VERIFY'}
        </button>
      </div>
    </div>
  );
}

export default OtpScreen;

import React, { useRef, useState, useEffect } from "react";
import "./OtpScreen.css";
import { useNavigate, useLocation } from "react-router-dom";

function OtpRegister({ toggleLogin, toggleReg, mobileNumber }) {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(Array(4).fill(""));
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtploading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  const number = Number(mobileNumber); // Ensure mobileNumber is parsed as integer

  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  const startCountdown = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setResendDisabled(true);
    setCountdown(30);

    timerRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timerRef.current);
          setResendDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      // Ensure input is a digit
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async () => {
    setOtploading(true);
    const otpNumber = Number(otp.join(""));

    const payload = { number, otp: otpNumber };
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/verifyregisterotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("jwtToken", data.jwtToken);

        toggleLogin();
        toggleReg();
        window.location.reload();
        navigate("/");
      } else {
        alert(data.message || "Invalid response from server");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setOtploading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("OTP has been resent to your mobile number.");
        startCountdown();
      } else {
        alert(data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-overlay">
      <div className="otp">
        <h3>We have sent you the code to your mobile number</h3>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
              value={digit}
              disabled={loading}
            />
          ))}
        </div>
        <button
          className="verify-button"
          onClick={handleSubmit}
          disabled={otpLoading}
        >
          {otpLoading ? "Verifying..." : "VERIFY"}
        </button>
        <button
          className="resend-button"
          onClick={handleResendOtp}
          disabled={resendDisabled || loading}
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: resendDisabled ? "#888888" : "#007BFF",
            backgroundColor: "transparent",
            border: "none",
            cursor: resendDisabled ? "not-allowed" : "pointer",
            textDecoration: resendDisabled ? "none" : "underline",
            padding: 0,
          }}
        >
          {resendDisabled ? `Resend OTP in ${countdown}s` : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default OtpRegister;

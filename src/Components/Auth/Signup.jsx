import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup({
  toggleReg,
  mobileNumber,
  setMobileNumber,
  toggleMobile,
  toggleSignup,
  toggleLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleMobileNumberChange = (e) => {
    let value = e.target.value;
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setMobileNumber(value);
  };
  const log = () => {
    toggleMobile();
    toggleLogin();
  };
  const handleRegister = async () => {
    if (!name || !email || !mobileNumber) {
      alert("Please fill in all fields");
      return;
    }
    if (name.length < 4) {
      alert("Name should be atleast 4 characters");
      return;
    }
    if (mobileNumber.length !== 10) {
      alert("Please enter a valid 10 digits number");
      return;
    }
    if (!email.includes("@" && ".com")) {
      alert("Please provide a valid email");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, number: mobileNumber }),
        }
      );
      const data = await response.json();
      const userDetails = {
        name: name,
        email: email,
        number: mobileNumber,
      };
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      console.log(data);
      console.log(response.ok);
      if (response.ok) {
        toggleSignup();
        toggleReg();
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Failed to register, please try again");
    } finally {
      setLoading(false);
    }
  };
  const login = () => {
    toggleSignup();
    toggleMobile();
  };
  return (
    <div className="signup-overlay">
      <div className="signup">
        <h3>Register</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="number"
          placeholder="Phone Number"
          value={mobileNumber}
          onChange={handleMobileNumberChange}
          disabled={loading}
          required
        />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Send OTP"}
        </button>
        <div className="signin-prompt">
          Already have an account?{" "}
          <span
            onClick={() => {
              login();
            }}
            className="signin-link"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;

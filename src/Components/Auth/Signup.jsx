import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';

function Signup({ toggleReg, mobileNumber, setMobileNumber , toggleMobile, toggleSignup}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !mobileNumber) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://server.bookmyappointments.in/api/bma/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, number: mobileNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                toggleSignup();
                toggleReg();
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            alert('Failed to register, please try again');
        } finally {
            setLoading(false);
        }
    };

    const login=()=>{
        toggleSignup();
        toggleMobile();
    }
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
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={loading}
                />
                <button onClick={handleRegister} disabled={loading}>
                    {loading ? 'Registering...' : 'Send OTP'}
                </button>
                <div className="signin-prompt">
                    Already have an account?{' '}
                    <span onClick={handleRegister} className="signin-link">
                        Login
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Signup;

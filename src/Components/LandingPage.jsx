import React, { useState } from 'react';
import './LandingPage.css';
import { Link,useNavigate } from 'react-router-dom';
import Footer from './Footer';

function LandingPage({ login, toggleLogin, mobile, setMobile }) {
  const [hovered, setHovered] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
const navigate=useNavigate();
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
    <div>
      <div className="homepage">
        <div className='lcontent'>
          <h1>Book Your Appointments</h1>
          <p>at the comfort of your Home.</p>
        </div>
        <div className="button-container">
          <button
            className={`button button-1 ${hovered === 'button1' ? 'expanded' : hovered === 'button2' ? 'contracted' : ''} ${activeButton === 'button1' ? 'active' : ''}`}
            onMouseEnter={() => setHovered('button1')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
               handleButtonClick('button1')
              navigate('/hospital');
            }}
            
          >
            <Link to='/hospital' style={{ textDecoration: 'none',  }}>
              <p>HOSPITALS</p>
            </Link>
          </button>

          <button
            className={`button button-2 ${hovered === 'button2' ? 'expanded' : hovered === 'button1' ? 'contracted' : ''} ${activeButton === 'button2' ? 'active' : ''}`}
            onMouseEnter={() => setHovered('button2')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              handleButtonClick('button2');
              navigate('/lab');
            }}
            
          >
            <Link to='/lab' style={{ textDecoration: 'none',  }}>
              <p>LABS</p>
            </Link>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;

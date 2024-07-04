import React from 'react';
import './ContactUs.css';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <div className="grid-container">
        {/* Contact Us */}
        <div className="contact" >
          <h3 className="section-title">Contact Us:</h3>
          <div className="text-secondary">
            <p>Email: info@example.com</p>
          </div>
          <div className="text-secondary">
            <p>Phone: +1234567890</p>
          </div>
          <div className="text-secondary">
            <p>Address: 123 Street Name</p>
            <p>City, Country</p>
          </div>
        </div>
        {/* Quick Links */}
        <div className="quick-links">
          <h3 className="section-title">Quick Links:</h3>
          <ul className="text-secondary">
            <li>
             <Link to='/' style={{textDecoration:'none', color:'#898989'}}> 
                Home
                </Link>
            </li>
            <li>
              Services
              <ul className="list-disc">
                <li>
                  <Link to='/hospital' style={{textDecoration:'none', color:'#898989'}}>
                    Hospital
                    </Link>
                </li>
                <li>
                  
                    Labs
                  
                </li>
              </ul>
            </li>
            <li>
              
                Privacy Policy
              
            </li>
          </ul>
        </div>
        {/* Follow Us */}
        <div className="follow-us">
        <h3 className="section-title">Follow Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
        {/* Copy Right */}
        <div className="copyright">
          <p>&copy; BookMyAppointments</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

import React, { useState } from "react";
import "./Bookings.css"; // Import the CSS file for styles
import Navbar from "./Navbar";
import Footer from "./Footer";

const Bookings = ({ login, toggleLogin, mobile, setMobile }) => {
  // Dummy data for previous bookings
  const [previousBookings, setPreviousBookings] = useState([
    {
      id: 1,
      date: "2022-05-01",
      day: "Monday",
      time: "10:00 AM",
      hospital: "ABC Hospital",
      doctor: "Dr. Smith",
      domain: "Cardiology",
      amount: 200,
      status: "Completed",
    },
    {
      id: 2,
      date: "2022-06-15",
      day: "Wednesday",
      time: "11:30 AM",
      hospital: "XYZ Hospital",
      doctor: "Dr. Johnson",
      domain: "Orthopedics",
      amount: 250,
      status: "Completed",
    },
    {
      id: 3,
      date: "2022-07-20",
      day: "Friday",
      time: "2:00 PM",
      hospital: "PQR Hospital",
      doctor: "Dr. Lee",
      domain: "Neurology",
      amount: 180,
      status: "Canceled",
    },
  ]);



  return (
    <div>
      <Navbar login={login} mobile={mobile} setMobile={setMobile} />
      <div className="bookings-container">
        <div className="bookings-content">
          <div className="bookings-grid">
            {previousBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-date-time">
                  <h1 className="booking-title" style={{margin:'0px'}}>Booking Date and Time</h1>
                  <p style={{marginTop:'10px'}}>{booking.day}, {booking.date}, {booking.time}</p>
                </div>
                <div className="booking-doctor">
                  <h1 style={{marginBottom:'2px',fontSize:'26px'}}>{booking.hospital}</h1>
                  <h2 style={{fontSize:'25px', marginTop:'0px', marginBottom:'2px', fontWeight:'500'}}>{booking.doctor}</h2>
                  <p style={{marginTop:'0px'}}>{booking.domain}</p>
                </div>
                <div className="booking-details">
                  <p style={{marginBottom:'30px', }}>Booked on: {booking.date}</p>
                  <div className="money">
                     <p style={{fontSize:'26px', fontWeight:'700', margin:'0px 0px', marginTop:'0px'}}>Paid Amount </p>
                  <p style={{fontSize:'26px', fontWeight:'700', margin:'0px 0px'}}>₹{booking.amount}</p>
                  </div>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;

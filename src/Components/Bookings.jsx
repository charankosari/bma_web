import React, { useState, useEffect } from "react";
import "./Bookings.css"; // Import the CSS file for styles
import Navbar from "./Navbar";
import Footer from "./Footer";

const Bookings = ({ login, toggleLogin, mobile, setMobile }) => {
  const [loading, setLoading] = useState(true);
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Simulating AsyncStorage for demo purposes (replace with actual AsyncStorage logic)
        const jwtToken = localStorage.getItem('jwtToken'); // Replace with actual AsyncStorage logic for React Native

        const response = await fetch('https://server.bookmyappointments.in/api/bma/allbookingdetails', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const responseData = await response.json();

        if (response.ok) {
          categorizeBookings(responseData.bookingDetails);
        } else {
          console.error('Error fetching booking details:', responseData.message);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    const categorizeBookings = (bookings) => {
      const today = new Date().toISOString().slice(0, 10); // Today's date in ISO format (YYYY-MM-DD)
      const todayBookings = [];
      const upcomingBookings = [];

      bookings.forEach((item) => {
        const bookingDate = new Date(item.booking.date).toISOString().slice(0, 10);
        if (bookingDate === today) {
          todayBookings.push(item);
        } else if (new Date(bookingDate) > new Date(today)) {
          upcomingBookings.push(item);
        }
      });

      setTodayBookings(todayBookings);
      setUpcomingBookings(upcomingBookings);
    };

    fetchBookingDetails();
  }, []);

  return (
    <div>
      <Navbar login={login} mobile={mobile} setMobile={setMobile} />
      <div className="bookings-container">
        <div className="bookings-content">
          {loading ? (
            <div className="loading-container">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {todayBookings.length > 0 && (
                <>
                  <h2>Today's Bookings</h2>
                  {todayBookings.map((item) => (
                    <div key={item.booking._id} className="booking-card">
                      <div className="booking-date-time">
                        <h1 className="booking-title">Booking Date and Time</h1>
                        <p>{new Date(item.booking.date).toLocaleDateString()}, {item.booking.time}</p>
                      </div>
                      <div className="booking-doctor">
                        <h1>{item.hospital ? item.hospital.hospitalName : 'Hospital Name'}</h1>
                        <h2>{item.doctor ? item.doctor.name : 'Doctor Name'}</h2>
                        <p>{item.test ? item.test.name : 'Domain'}</p>
                      </div>
                      <div className="booking-details">
                        <p>Booked on: {new Date(item.booking.date).toLocaleDateString()}</p>
                        <div className="money">
                          <p>Paid Amount: ₹{item.booking.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {upcomingBookings.length > 0 && (
                <>
                  <h2>Upcoming Bookings</h2>
                  {upcomingBookings.map((item) => (
                    <div key={item.booking._id} className="booking-card">
                      <div className="booking-date-time">
                        <h1 className="booking-title">Booking Date and Time</h1>
                        <p>{new Date(item.booking.date).toLocaleDateString()}, {item.booking.time}</p>
                      </div>
                      <div className="booking-doctor">
                        <h1>{item.hospital ? item.hospital.hospitalName : 'Hospital Name'}</h1>
                        <h2>{item.doctor ? item.doctor.name : 'Doctor Name'}</h2>
                        <p>{item.test ? item.test.name : 'Domain'}</p>
                      </div>
                      <div className="booking-details">
                        <p>Booked on: {new Date(item.booking.date).toLocaleDateString()}</p>
                        <div className="money">
                          <p>Paid Amount: ₹{item.booking.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {todayBookings.length === 0 && upcomingBookings.length === 0 && (
                <p>No bookings found.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import hospitalDetails from "./HospitalData";
import Navbar from "./Navbar";
import './Checkout.css'; // Import the CSS file
import Footer from "./Footer";

function Checkout() {
  const { hospitalId, cardNumber, doctorId } = useParams(); // Retrieve hospitalId, cardNumber, and doctorId from URL params

  const [coupon, setCoupon] = useState("");
  const [consultationFee, setConsultationFee] = useState(250);
  const [serviceFee, setServiceFee] = useState(20);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const storedSlot = localStorage.getItem("selectedSlot");
    const storedText = localStorage.getItem("selectedText");

    if (storedSlot && storedText) {
      setSelectedSlot(storedSlot);
      setSelectedText(storedText);
    }
  }, []);

  const specialData = hospitalDetails[hospitalId]?.cards.find(
    (card) => card.id === parseInt(cardNumber)
  );

  if (!specialData) {
    return <div className="error-message">Specialty not found.</div>;
  }

  const selectedDoctor = specialData.doctors.find(
    (doctor) => doctor.id === parseInt(doctorId)
  );

  if (!selectedDoctor) {
    return <div className="error-message">Doctor not found.</div>;
  }

  const total = consultationFee + serviceFee;

  return (
    <div>
        <Navbar/>
      <div className="checkout-container">
        <div className="checkout-content">
          <div>
            <h2 className="section-title">Booking Date and Time</h2>
            <p className="section-content">
              {selectedText}, {selectedSlot}
            </p>
          </div>
          <div className="checkout-body">
            <div className="checkout-location">
              <div className="info-box">
                <h2 className="info-title">
                  <div>50% of Our Profits are used for</div>
                  <div>Orphan Children Health Care</div>
                </h2>
              </div>
              <p className="location-title">Location</p>
              <iframe
                title="Google Maps Location"
                width="100%"
                height="255px"
                style={{ border: 0 }}
                src={selectedDoctor.location}
                allowFullScreen
              ></iframe>
            </div>
            <div className="checkout-summary">
              <div className="coupon-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="coupon-input"
                />
                <button className="apply-button">APPLY</button>
                <h2 className="summary-title">Bill Details</h2>
                <div className="summary-details">
                  <div className="summary-item">
                    <p>Consultation Fee:</p>
                    <p>₹{consultationFee}</p>
                  </div>
                  <div className="summary-item">
                    <p>Service Fee and Tax:</p>
                    <p>₹{serviceFee}</p>
                  </div>
                </div>
                <div className="summary-total">
                  <p className="total-text">
                    <span>Total Amount:</span>
                    <span>₹{total}</span>
                  </p>
                  <div className="checkout-button-container">
                <Link to='/confirm'>    <button className="checkout-button">Checkout</button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Checkout;

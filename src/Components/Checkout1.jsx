import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import './Checkout.css';

const Checkout1 = ( { login, toggleLogin, mobile, setMobile }) => {
  const location = useLocation();
  const { labName, price } = location.state; // Retrieve lab details from the state

  return (
    <div>
      <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>
      <div className="checkout-container">
        <div className="checkout-content">
          <h2 className="section-title">Lab Name</h2>
          <p className="section-content">{labName}</p>
          <div className="checkout-body">
            <div className="checkout-summary">
              <h2 className="summary-title">Bill Details</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <p>Price:</p>
                  <p>₹{price}</p>
                </div>
              </div>
              <div className="summary-total">
                <div className="checkout-button-container">
                <Link to='/confirm'>  <button className="checkout-button">Checkout</button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout1;

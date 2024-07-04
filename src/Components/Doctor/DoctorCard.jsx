import React from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import "./DoctorCard.css";

const DoctorCard = ({ doctor, hospitalId, cardNumber }) => {
  const handleDoctorBooking = (cardNumber) => {
    window.location.href = `/hospital/${hospitalId}/card/${cardNumber}/doctor/${doctor.id}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < rating ? "dc-star-filled" : "dc-star-empty"}
        />
      );
    }
    return stars;
  };
  
  return (
    <div
      className="dc-doctor-card"
      onClick={() => handleDoctorBooking(cardNumber)}
    >
      <div className="dc-doctor-card-content">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="dc-doctor-image"
        />
        <div className="dc-doctor-info">
          <div className="dc-doctor-header">
            <h1 className="dc-doctor-name">
              {doctor.name}
              <span className="dc-doctor-education">
                {doctor.education}
              </span>
            </h1>
          </div>
          <div className="dc-doctor-rating">
            {renderStars(doctor.rating)}
          </div>
        </div>
        <FaHeart
          className="dc-doctor-heart"
          style={{ color: doctor.heartcolor }}
        />
      </div>
    </div>
  );
};

export default DoctorCard;

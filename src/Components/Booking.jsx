import { useState, useEffect } from "react";
import { useParams, useHistory, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaHeart, FaStar } from "react-icons/fa";
import Navbar from "./Navbar";
import "./Booking.css";

function Booking() {
  const { hospitalId, cardNumber, doctorId } = useParams();
  const history = useNavigate();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [scrollIndexDate, setScrollIndexDate] = useState(0);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayTimes, setSelectedDayTimes] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState("");


  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`https://server.bookmyappointments.in/api/bma/doc/${doctorId}`);
        const data = await response.json();
        setDoctorDetails(data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    const fetchDoctorTimings = async () => {
      try {
        const response = await fetch(`https://server.bookmyappointments.in/api/bma/doc/${doctorId}`);
        const responseData = await response.json();
        const dates = Object.keys(responseData.doctor.bookingsids);
        const formattedDates = dates.map((date) => {
          const dayData = responseData.doctor.bookingsids[date];
          const morningAvailable = dayData.morning.some((slot) => !slot.bookingId);
          const eveningAvailable = dayData.evening.some((slot) => !slot.bookingId);
          const morningTimes = dayData.morning.map((slot) => ({ id: slot.time, time: slot.time, bookingId: slot.bookingId }));
          const eveningTimes = dayData.evening.map((slot) => ({ id: slot.time, time: slot.time, bookingId: slot.bookingId }));

          return {
            date,
            day: new Date(date).toLocaleDateString("en-GB", { weekday: "long" }),
            morningAvailable,
            eveningAvailable,
            morningTimes,
            eveningTimes,
          };
        });

        setWeekDates(formattedDates);
      } catch (error) {
        console.error("Error fetching doctor timings:", error);
      }
    };

    const fetchWishlist = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await fetch(`https://server.bookmyappointments.in/api/bma/me/wishlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const responseData = await response.json();
        const isDoctorFavorite = responseData.data.doctors.some((item) => item._id === doctorId);
        setIsFavorite(isDoctorFavorite);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setFavoriteLoading(false);
      }
    };

    fetchDoctorDetails();
    fetchDoctorTimings();
    fetchWishlist();
  }, [doctorId]);

  const handleFavouritePress = async () => {
    try {
      setFavoriteLoading(true);
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await fetch(`https://server.bookmyappointments.in/api/bma/me/wishlist/${doctorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ type: "doctor" }),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert("Success", responseData.message);
        setIsFavorite(!isFavorite); // Toggle favorite status
      } else {
        alert("Error", responseData.message);
      }
    } catch (error) {
      console.error("Error adding doctor to favorites:", error);
      alert("Error", "An error occurred while adding to favorites.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDay(day);
    setSelectedDayTimes(day);
    setSelectedTime(null);
  };

  const handleTimePress = (time) => {
    if (time.bookingId) {
      alert("Slot Booked", "This slot is already booked. Please select another time.");
    } else {
      setSelectedTime(time);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedButton && selectedText) {
      localStorage.setItem("selectedSlot", selectedButton);
      localStorage.setItem("selectedText", selectedText);
      alert(`Booking confirmed at ${selectedButton} on ${selectedText}`);
      history(`/hospital/${hospitalId}/card/${cardNumber}/doctor/${doctorId}/checkout`);
    } else {
      alert("Please select a time slot and day for booking.");
    }
  };

  if (!doctorDetails) {
    return <div>Loading...</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className={i < rating ? "star-filled" : "star-empty"} />);
    }
    return stars;
  };

  const TimeDetails = ({ morningTimes, eveningTimes }) => {
    if (!morningTimes || !eveningTimes) return null;

    const allTimes = [...morningTimes, ...eveningTimes];

    return (
      <div className="time-selection">
        <div className="time-buttons">
          {allTimes.map((time) => (
            <button key={time.id} className={`time-button ${selectedTime && selectedTime.id === time.id ? "selected" : ""}`} onClick={() => handleTimePress(time)}>
              {time.time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const WeekDetails = ({ weekDates }) => {
    if (!weekDates || weekDates.length === 0) {
      return <div>No available slots at the moment</div>;
    }

    return (
      <div className="day-selection">
        <div className="days">
          {weekDates.map((day, index) => (
            <div key={index} className={`day ${selectedDay === day ? "selected" : ""}`} onClick={() => handleDayPress(day)}>
              <div className={`day-text ${selectedDay === day ? "selected" : ""}`}>{day.day.slice(0, 3)}</div>
              <div className={`day-number ${selectedDay === day ? "selected" : ""}`}>{day.date}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="booking-container">
        <div className="doctor-details">
          <div className="doctor-image">
            <img src={doctorDetails.image || "/default-avatar.png"} alt={doctorDetails.name} />
          </div>
          <div className="doctor-description">
            <div className="doctor-header">
              <h1 className="doctor-name">
                {doctorDetails.name}
                <h2 className="doctor-education" style={{ margin: '0px' }}>{doctorDetails.study}</h2>
              </h1>
              <FaHeart size={30} className="heart-icon" style={{ color: isFavorite ? "red" : "gray" }} onClick={handleFavouritePress} />
            </div>
            <p className="doctor-specialty">{doctorDetails.specialty}</p>
            <p className="doctor-description-text">{doctorDetails.description}</p>
            <div className="doctor-rating">{renderStars(doctorDetails.rating)}</div>
          </div>
        </div>

        <WeekDetails weekDates={weekDates} />

        {selectedDayTimes && <TimeDetails morningTimes={selectedDayTimes.morningTimes} eveningTimes={selectedDayTimes.eveningTimes} />}

        <div className="confirm-button-container">
          <button className="confirm-button" onClick={handleConfirmBooking}>CONFIRM</button>
        </div>
      </div>
    </div>
  );
}

export default Booking;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  useTheme,
  Alert,
  useMediaQuery,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import Footer from "../Footer";
import {
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
const DoctorScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [doctor, setDoctor] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken"); // Retrieve JWT token from localStorage
        const response = await fetch(
          `https://server.bookmyappointments.in/api/bma/getsingledoc/${id}`,
          {
            // const response = await fetch(
            // `http://localhost:9999/api/bma/getsingledoc/${id}`,
            // {
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Use JWT token in request headers
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctor details");
        }

        const data = await response.json();
        const doctor = data.doctor;

        setDoctor(doctor);
        setHospital(location.state.hospital);

        const currentTime = moment();
        const filteredDates = Object.keys(doctor.bookingsids).filter((date) => {
          const dateMoment = moment(date, "DD-MM-YYYY");
          const availableTimes = [
            ...doctor.bookingsids[date].morning,
            ...doctor.bookingsids[date].evening,
          ].filter((slot) => {
            const slotTime = moment(slot.time, "HH:mm");
            const slotDateTime = moment(dateMoment).set({
              hour: slotTime.hour(),
              minute: slotTime.minute(),
            });
            return slotDateTime.isAfter(currentTime);
          });
          return availableTimes.length > 0;
        });

        setDates(filteredDates);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false); // Stop loading spinner once fetch is complete
      }
    };

    fetchDoctorDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/me",
          // "http://localhost:9999/api/bma/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const data = await response.json();
        setUserDetails(data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/me",
          // "http://localhost:9999/api/bma/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const wishList = data.user.wishList;
          const doctorIds = wishList.map((item) => item.doctor);
          const isWishlisted = doctorIds.includes(doctor.id);
          setIsFavorite(isWishlisted);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (doctor) {
      fetchUserDetails();
      fetchFavoriteStatus();
      setLoading(false);
    }
  }, [doctor]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    const currentTime = moment();
    const selectedDateMoment = moment(date, "DD-MM-YYYY");

    const availableTimes = [
      ...doctor.bookingsids[date].morning.map((slot) => ({
        ...slot,
        session: "morning",
      })),
      ...doctor.bookingsids[date].evening.map((slot) => ({
        ...slot,
        session: "evening",
      })),
    ].filter((slot) => {
      const slotTime = moment(slot.time, "HH:mm");
      const slotDateTime = moment(selectedDateMoment).set({
        hour: slotTime.hour(),
        minute: slotTime.minute(),
      });

      return slotDateTime.isAfter(currentTime);
    });

    setTimes(availableTimes);
  };

  const toggleFavorite = async () => {
    try {
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/me/wishlist/${doctor.id}`,
        // `http://localhost:9999/api/bma/me/wishlist/${doctor.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "doctor" }),
        }
      );
      if (response.ok) {
        const message = isFavorite
          ? "Removed from favorites"
          : "Added to favorites";
        setSnackbarMessage(message);
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }
    const selectedSlot = doctor.bookingsids[selectedDate].morning
      .concat(doctor.bookingsids[selectedDate].evening)
      .find(
        (slot) =>
          slot.session === selectedTime.session &&
          slot.time === selectedTime.time
      );
    console.log(selectedTime, doctor.bookingsids, doctor);

    if (selectedSlot && selectedSlot.booked) {
      alert(
        "The selected time slot is already booked. Please choose another slot."
      );
      return;
    }

    const bookingData = {
      doctorId: doctor.id,
      hospitalId: hospital._id,
      date: moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
      time: selectedTime.time,
      session: selectedTime.session,
      name: userDetails.name,
      phonenumber: userDetails.number,
      email: userDetails.email,
      amountpaid: doctor.price.consultancyfee + doctor.price.servicefee,
    };
    navigate("/doctorbooking", { state: { bookingData, hospital, doctor } });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          minHeight: isMobile ? "100%" : "70vh",
          height: "auto",
          padding: isMobile ? 2 : 4,
        }}
      >
        {doctor && (
          <>
            <Card
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                width: "100%",
                mb: 2,
                padding: 3,
                boxShadow: 3,
                gap: isMobile ? 0 : "50px",
                position: "relative",
                height: "auto",
              }}
            >
              {doctor.image ? (
                <CardMedia
                  component="img"
                  sx={{
                    width: isMobile ? "100%" : 180,
                    height: isMobile ? "auto" : 180,
                    borderRadius: "10px",
                    objectFit: "contain",
                    mb: isMobile ? 2 : 0,
                    mt: isMobile ? 4 : 0,
                  }}
                  image={doctor.image}
                  alt={doctor.name}
                />
              ) : (
                <Box
                  sx={{
                    width: isMobile ? "100%" : 180,
                    height: isMobile ? 120 : 180,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#e0e0e0",
                    fontSize: isMobile ? 40 : 60,
                    mb: isMobile ? 2 : 0,
                  }}
                >
                  {doctor.name.charAt(0)}
                </Box>
              )}
              <Box
                sx={{
                  flex: 1,
                  marginLeft: isMobile ? 0 : 2,
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ textTransform: "capitalize", color: "text.primary" }}
                >
                  Doctor: {doctor.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ textTransform: "capitalize", color: "text.primary" }}
                >
                  Hospital: {hospital.hospitalName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ textTransform: "capitalize", color: "text.secondary" }}
                >
                  Speciality: {doctor.specialist}
                </Typography>
              </Box>
              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: isFavorite ? "red" : "default",
                }}
                onClick={toggleFavorite}
              >
                <FavoriteIcon />
              </IconButton>
            </Card>

            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography variant="h6" align="center">
                Select Date
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  gap: 2,
                  padding: 2,
                }}
              >
                {dates.map((date) => (
                  <Card
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    sx={{
                      minWidth: isMobile ? 80 : 120,
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor:
                        selectedDate === date ? "#2BB673" : "background.paper",
                      color:
                        selectedDate === date
                          ? "primary.contrastText"
                          : "text.primary",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{
                          color: selectedDate === date ? "white" : "#2BB673",
                        }}
                      >
                        {moment(date, "DD-MM-YYYY").format("ddd D")}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>

            {selectedDate && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography variant="h6" align="center">
                  Select Time
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    overflowX: "auto",
                    marginLeft: "15px",
                    gap: 2,
                  }}
                >
                  {times.map((time) => (
                    <Card
                      key={time.time}
                      onClick={() => {
                        if (time.bookingId) {
                          alert("This time slot is already booked.");
                        } else {
                          setSelectedTime(time);
                        }
                      }}
                      style={{
                        minWidth: 80,
                        maxWidth: 120,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "40px",
                        backgroundColor:
                          selectedTime === time ? "#2BB673" : "white",
                        color: selectedTime === time ? "white" : "black",
                        position: "relative",
                        borderRadius: "4px",
                        margin: "5px",
                        padding: "0",
                      }}
                    >
                      <CardContent style={{ padding: "0", margin: "0" }}>
                        <Typography
                          variant="body2"
                          style={{
                            color: selectedTime === time ? "white" : "#2BB673",
                            textAlign: "center",
                            fontSize: "14px",
                            width: "100%",
                          }}
                        >
                          {time.time}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleBookNow}
              sx={{
                mt: 2,
                width: "250px",
                backgroundColor: "#2BB673",
                "&:hover": {
                  backgroundColor: "#239c5f",
                },
              }}
            >
              Book Now
            </Button>
          </>
        )}
        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={6000}
          onClose={() => setSnackbarMessage("")}
        >
          <Alert
            onClose={() => setSnackbarMessage("")}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </>
  );
};

export default DoctorScreen;

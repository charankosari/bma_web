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

const LabScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [test, setTest] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const url = "https://server.bookmyappointments.in";

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await fetch(`${url}/api/bma/getsinglelab/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch test details");
        }

        const data = await response.json();
        const test = data.lab;

        setTest(test);
        setHospital(location.state.hospital);
        const currentTime = moment();
        const filteredDates = Object.keys(test.bookingsids).filter((date) => {
          const dateMoment = moment(date, "DD-MM-YYYY");
          const availableTimes = [
            ...test.bookingsids[date].morning,
            ...test.bookingsids[date].evening,
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
        console.error("Error fetching test details:", error);
        localStorage.removeItem("jwtToken");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id, location.state.hospital]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${url}/api/bma/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        const data = await response.json();
        setUserDetails(data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    };

    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(`${url}/api/bma/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const wishList = data.user.wishList;
          const testIds = wishList.map((item) => item.test);
          const isWishlisted = testIds.includes(test.id);
          setIsFavorite(isWishlisted);
        } else {
          console.error("Failed to fetch user details");
          localStorage.removeItem("jwtToken");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    };

    if (test) {
      fetchUserDetails();
      fetchFavoriteStatus();
    }
  }, [test]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    const currentTime = moment();
    const selectedDateMoment = moment(date, "DD-MM-YYYY");

    const availableTimes = [
      ...test.bookingsids[date].morning.map((slot) => ({
        ...slot,
        session: "morning",
      })),
      ...test.bookingsids[date].evening.map((slot) => ({
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
      const response = await fetch(`${url}api/bma/me/wishlist/${test.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "test" }),
      });
      if (response.ok) {
        const message = isFavorite
          ? "Removed from favorites"
          : "Added to favorites";
        setSnackbarMessage(message);
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      localStorage.removeItem("jwtToken");
      navigate("/");
    }
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    const selectedSlot = test.bookingsids[selectedDate].morning
      .concat(test.bookingsids[selectedDate].evening)
      .find(
        (slot) =>
          slot.session === selectedTime.session &&
          slot.time === selectedTime.time
      );

    if (selectedSlot && selectedSlot.booked) {
      alert(
        "The selected time slot is already booked. Please choose another slot."
      );
      return;
    }

    const bookingData = {
      testId: test.id,
      hospitalId: hospital._id,
      date: moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
      time: selectedTime.time,
      session: selectedTime.session,
      name: userDetails.name,
      phonenumber: userDetails.number,
      email: userDetails.email,
      amountpaid: test.price.consultancyfee + test.price.servicefee,
    };
    navigate("/labbooking", { state: { bookingData, hospital, test } });
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
          height: isMobile ? "100%" : "70vh",
          padding: isMobile ? 2 : 4,
        }}
      >
        {test && (
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
              {test.image ? (
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
                  image={test.image}
                  alt={test.name}
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
                  {test.name.charAt(0)}
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
                  <b> Test:</b> {test.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ textTransform: "capitalize", color: "text.primary" }}
                >
                  <b> Hospital:</b> {hospital.name}
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
        {/* <Card
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
              {test.image ? (
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
                  image={test.image}
                  alt={test.name}
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
                  {test.name.charAt(0)}
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
                  Test: {test.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ textTransform: "capitalize", color: "text.primary" }}
                >
                  Hospital: {hospital.name}
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
            </Card> */}
        {/* <Box sx={{ width: "100%", mb: 4 }}>
          <Typography
            variant="h6"
            sx={{ marginBottom: 2 }}
            color="text.secondary"
          >
            Select a Date
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {dates.map((date) => (
              <Button
                key={date}
                sx={{
                  backgroundColor: selectedDate === date ? "#2BB673" : "white",
                  color: selectedDate === date ? "white" : "#2BB673",
                  "&:hover": {
                    backgroundColor:
                      selectedDate === date ? "#239c5f" : "#f0f0f0",
                    color: selectedDate === date ? "white" : "#2BB673",
                  },
                }}
                variant={selectedDate === date ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleDateSelect(date)}
              >
                {date}
              </Button>
            ))}
          </Box>
        </Box>

        {selectedDate && times.length > 0 && (
          <Box sx={{ width: "100%", mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ marginBottom: 2 }}
              color="text.secondary"
            >
              Select a Time
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {times.map((slot) => (
                <Button
                  key={slot.time}
                  sx={{
                    backgroundColor:
                      selectedTime === slot ? "#2BB673" : "white",
                    color: selectedTime === slot ? "white" : "#2BB673",
                    "&:hover": {
                      backgroundColor:
                        selectedTime === slot ? "#239c5f" : "#f0f0f0",
                      color: selectedTime === slot ? "white" : "#2BB673",
                    },
                  }}
                  variant={selectedTime === slot ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedTime(slot)}
                  disabled={slot.booked}
                  startIcon={slot.booked ? <CancelIcon /> : <AccessTimeIcon />}
                >
                  {slot.time} {slot.booked ? "(Booked)" : ""}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {selectedDate && selectedTime && (
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
        )} */}
      </Box>

      <Footer />

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage("")}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
};

export default LabScreen;

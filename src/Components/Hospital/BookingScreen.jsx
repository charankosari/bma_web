import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Footer from "../Footer";

// Default icon settings for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const SuccessScreen = () => {
  const navigate = useNavigate();

  // const goto = () => {
  //     navigate('/bookings', { replace: true });
  //   };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          padding: 3,
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 100, color: "green", mb: 2 }} />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Booking Confirmed!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Your appointment has been successfully booked.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/bookings", { replace: true });
          }} // Reload the page to refresh state
        >
          Go to Bookings
        </Button>
      </Box>
    </>
  );
};

const BookingScreen = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false); // State to manage success status
  const { bookingData, hospital, doctor } = location.state;
  const navigate = useNavigate();
  const { date, time, name, amountpaid } = bookingData;
  const { latitude, longitude } = hospital.address[0];
  const { consultancyfee, servicefee } = doctor.price;

  const handleViewOnGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/addbooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify(bookingData),
        }
      );
      if (response.ok) {
        setBookingConfirmed(true); // Set bookingConfirmed to true
      } else {
        alert("Booking failed. Please try again.");
        localStorage.removeItem("jwtToken");
        navigate("/");
      }
    } catch (error) {
      console.error("Error making booking:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
    return <SuccessScreen />; // Render SuccessScreen if booking is confirmed
  }

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Card
          sx={{ padding: 3, borderRadius: "15px", backgroundColor: "#f5f5f5" }}
        >
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Booking date and time
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(date).toDateString()} {time}
                </Typography>
                <Typography variant="h5" sx={{ my: 3 }}>
                  50% of Our Profits are used for Orphan Children Health Care
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Location
                </Typography>
                <Box
                  sx={{
                    height: "300px",
                    width: "100%",
                    mb: 2,
                    position: "relative",
                  }}
                >
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={15}
                    style={{ height: "100%", borderRadius: "10px" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[latitude, longitude]}>
                      <Popup>
                        {hospital.hospitalName} <br /> {doctor.name}
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewOnGoogleMaps}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: "999",
                    }}
                  >
                    View on Google Maps
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Booking Details
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Hospital: {hospital.hospitalName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Doctor: {doctor.name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Specialty: {doctor.specialist}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <TextField
                    variant="outlined"
                    label="Coupon"
                    size="small"
                    sx={{ flexGrow: 1, mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ height: "40px" }}
                  >
                    APPLY
                  </Button>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Bill Details
                  </Typography>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Consultation Fee</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">₹ {consultancyfee}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Service Fee and Tax</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">₹ {servicefee}</Typography>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 1 }} />
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography variant="h6">Total amount</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right" variant="h6">
                        ₹ {amountpaid}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: "100%", height: "50px", borderRadius: "25px" }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "CheckOut"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Footer />
    </>
  );
};

export default BookingScreen;

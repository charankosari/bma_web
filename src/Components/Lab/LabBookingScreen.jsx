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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
// const url = "http://localhost:9999";
const url = "https://server.bookmyappointments.in";

const SuccessScreen = () => {
  const navigate = useNavigate();

  return (
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
        }}
      >
        Go to Bookings
      </Button>
    </Box>
  );
};

const BookingScreen = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const { bookingData, hospital, test } = location.state;
  const { date, time, name, amountpaid } = bookingData;
  const { latitude, longitude } = hospital.address;
  const { consultancyfee, servicefee } = test.price;
  const handleViewOnGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank");
  };
  console.log(hospital);
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const updatedBookingData = {
        ...bookingData,
        hospitalId: test.hospitalid,
      };
      const response = await fetch(
        // "https://server.bookmyappointments.in/api/bma/addlabbooking",
        "https://server.bookmyappointments.in/api/bma/addlabbooking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify(updatedBookingData),
        }
      );
      if (response.ok) {
        setBookingConfirmed(true); // Set bookingConfirmed to true
      } else {
        alert("Booking failed. Please try again.");
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
                        {hospital.name} <br /> {test.name}
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
                <Typography
                  variant="body2"
                  sx={{ mb: 1, textTransform: "capitalize" }}
                >
                  Hospital: {hospital.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, textTransform: "capitalize" }}
                >
                  Test: {test.name}
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

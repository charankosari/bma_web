import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  CardMedia,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Footer from "../Footer";
import moment from "moment";
import doctorimg from "../../Assets/image1.png";

const HospitalDetailsPage = ({
  login,
  toggleLogin,
  mobile,
  setMobile,
  searchQuery,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { taglines } = location.state;

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await fetch(
          `https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`
        );
        // const response = await fetch(
        // `http://localhost:9999/api/bma/user/doctors/${hospitalId}`
        // );
        const data = await response.json();
        setHospital(data.hospital);
        setDoctors(data.hospital.doctors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospital details:", error);
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [hospitalId]);

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        (doctor.name &&
          doctor.name.toLowerCase().includes(searchQuery?.toLowerCase())) ||
        (doctor.specialist &&
          doctor.specialist.toLowerCase().includes(searchQuery?.toLowerCase()))
    );

    if (selectedCategory) {
      setFilteredDoctors(
        filtered.filter((doctor) => doctor.specialist === selectedCategory)
      );
    } else {
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors, selectedCategory]);

  const hasFutureBookings = (bookingids) => {
    const today = moment().startOf("day");
    return Object.keys(bookingids || {}).some((date) =>
      moment(date, "DD-MM-YYYY").isSameOrAfter(today)
    );
  };

  const filteredDoctorsList = filteredDoctors.filter(
    (doctor) => doctor.specialist && hasFutureBookings(doctor.bookingsids)
  );

  const handleDoctorCardClick = (doctor) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("You must be logged in to view this page.");
      window.location.href = "/";
    } else {
      navigate(`/doctor/${doctor._id}`, {
        state: {
          doctor,
          hospital,
        },
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: isMobile ? "50vh" : "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Container maxWidth="2xl">
        <Box sx={{ pt: 8, pb: 6 }}>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            hospital && (
              <>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {hospital.hospitalName.charAt(0).toUpperCase() +
                      hospital.hospitalName.slice(1)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    mb: 4,
                    display: "flex",
                    gap: 2,
                    padding: 1,
                  }}
                >
                  {taglines.map((tagline, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 1,
                        cursor: "pointer",
                        border: "2px solid",
                        borderRadius: 1,
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        borderColor:
                          selectedCategory === tagline ? "#2BB673" : "#ccc",
                        width: 100,
                      }}
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === tagline ? null : tagline
                        );
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        image={doctorimg}
                        alt={tagline}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {tagline}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {filteredDoctorsList.length === 0 ? (
                  <Typography variant="h6" color="textSecondary" align="center">
                    No doctors match your search.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {filteredDoctorsList.map((doctor) => (
                      <Grid item key={doctor._id} xs={12}>
                        <Card
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: isMobile ? 1 : 2,
                            transition:
                              "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
                            backgroundColor: "transparent",
                            color: "inherit",
                            "&:hover": {
                              backgroundColor: "#2BB673",
                              color: "white",
                              transform: "scale(1.03)",
                            },
                            cursor: "pointer",
                          }}
                          onClick={() => handleDoctorCardClick(doctor)}
                        >
                          {doctor.image ? (
                            <CardMedia
                              component="img"
                              sx={{
                                width: {
                                  xs: 80,
                                  sm: 90,
                                  md: 100,
                                  lg: 110,
                                  xl: 120,
                                },
                                height: {
                                  xs: 80,
                                  sm: 90,
                                  md: 100,
                                  lg: 110,
                                  xl: 120,
                                },
                                borderRadius: "5px",
                              }}
                              image={doctor.image}
                              alt={doctor.name}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: {
                                  xs: 80,
                                  sm: 90,
                                  md: 100,
                                  lg: 110,
                                  xl: 120,
                                },
                                height: {
                                  xs: 80,
                                  sm: 90,
                                  md: 100,
                                  lg: 110,
                                  xl: 120,
                                },
                                borderRadius: "50%",
                                display: "flex",
                                backgroundColor: "#e0e0e0",
                                fontSize: {
                                  xs: 30,
                                  sm: 35,
                                  md: 40,
                                  lg: 45,
                                  xl: 50,
                                },
                              }}
                            >
                              {doctor.name.charAt(0)}
                            </Box>
                          )}
                          <CardContent sx={{ flexGrow: 1, marginLeft: 2 }}>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{
                                fontSize: {
                                  xs: "1rem",
                                  sm: "1.2rem",
                                  md: "1.4rem",
                                  lg: "1.6rem",
                                  xl: "1.8rem",
                                },
                              }}
                            >
                              {doctor.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: {
                                  xs: "0.8rem",
                                  sm: "0.9rem",
                                  md: "1rem",
                                  lg: "1.1rem",
                                  xl: "1.2rem",
                                },
                              }}
                            >
                              {doctor.specialist}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )
          )}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default HospitalDetailsPage;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import doctorimg from '../../Assets/image1.png';

const HospitalDetailsPage = ({ login, toggleLogin, mobile, setMobile, searchQuery }) => {
  const navigate = useNavigate();
  const { id: hospitalId } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await fetch(`https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`);
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
    const filtered = doctors.filter((doctor) =>
      (doctor.name && doctor.name.toLowerCase().includes(searchQuery?.toLowerCase())) ||
      (doctor.specialist && doctor.specialist.toLowerCase().includes(searchQuery?.toLowerCase()))
    );

    if (selectedCategory) {
      setFilteredDoctors(filtered.filter(doctor => doctor.specialist === selectedCategory));
    } else {
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors, selectedCategory]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("https://server.bookmyappointments.in/api/bma/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        const data = await response.json();
        setFavorites(data.wishList || []);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const hasFutureBookings = (bookingids) => {
    const today = moment().startOf("day");
    return Object.keys(bookingids || {}).some((date) =>
      moment(date, "DD-MM-YYYY").isSameOrAfter(today)
    );
  };

  const filteredDoctorsList = filteredDoctors.filter(
    (doctor) =>
      doctor.specialist && hasFutureBookings(doctor.bookingsids)
  );

  const handleDoctorCardClick = (doctor) => {
    navigate(`/doctor/${doctor._id}`, {
      state: {
        doctor,
        hospital,
      },
    });
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
                    {hospital.hospitalName.charAt(0).toUpperCase() + hospital.hospitalName.slice(1)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    mb: 4,
                    display: 'flex',
                    gap: 2,
                    padding: 1,
                  }}
                >
                  {hospital.category.map((category, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 1, 
                        cursor: 'pointer',
                        border: '1px solid',
                        borderRadius: 1,
                        textAlign: 'center',
                        alignItems:'center' ,
                        justifyContent: 'center',
                        backgroundColor: selectedCategory === category.types ? '#e0f7fa' : '#fff',
                        borderColor: selectedCategory === category.types ? '#00bcd4' : '#ccc',
                        width: 100, 
                      }}
                      onClick={() => setSelectedCategory(category.types)}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 50, 
                          height: 50, 
                          objectFit: 'cover',
                          borderRadius: '5px',
                        }}
                        image={doctorimg}
                        alt={category.types}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}> 
                        {category.types}
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
                            '&:hover': {
                              cursor: 'pointer',
                              backgroundColor: '#2BB673',
                            }
                          }}
                          onClick={() => handleDoctorCardClick(doctor)}
                        >
                          {doctor.image ? (
                            <CardMedia
                              component="img"
                              sx={{
                                width: isMobile ? 80 : 100,
                                height: isMobile ? 80 : 100,
                                borderRadius: "5px"
                              }}
                              image={doctor.image}
                              alt={doctor.name}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: isMobile ? 80 : 100,
                                height: isMobile ? 80 : 100,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#e0e0e0",
                                fontSize: 40,
                              }}
                            >
                              {doctor.name.charAt(0)}
                            </Box>
                          )}
                          <CardContent sx={{ flexGrow: 1, marginLeft: 2 }}>
                            <Typography variant="h6" component="div">
                              {doctor.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {doctor.specialist}
                            </Typography>
                          </CardContent>
                          {favorites?.includes(doctor._id) && (
                            <IconButton color="secondary">
                              <FavoriteIcon />
                            </IconButton>
                          )}
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

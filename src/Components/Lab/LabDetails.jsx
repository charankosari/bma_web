import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import testimg from '../../Assets/image1.png';

const HospitalDetailsPage = ({ login, toggleLogin, mobile, setMobile, searchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hospital = location.state || {};  
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (hospital.id) {
      const fetchHospitalDetails = async () => {
        try {
          const testRequests = hospital.tests?.map(test =>
            fetch(`https://server.bookmyappointments.in/api/bma/tests/${test.testid}`)
          ) || [];
          const testResponses = await Promise.all(testRequests);
          const testData = await Promise.all(testResponses.map(res => res.json()));
          const allTests = testData.map(data => data.test);
          setTests(allTests);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching test details:", error);
          setLoading(false);
        }
      };

      fetchHospitalDetails();
    }
  }, [hospital]);
  useEffect(() => {
    
    const filtered = tests.filter((test) =>
      test.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (selectedCategory) {
      const categoryFiltered = filtered.filter((test) =>
        test.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredTests(categoryFiltered);
    } else {
      setFilteredTests(filtered);
    }
  }, [searchQuery, tests, selectedCategory]);
  
  
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

  const filteredTestsList = filteredTests.filter(
    (test) =>
      hasFutureBookings(test.bookingsids || {})
  );

  const handleTestCardClick = (test) => {
    navigate(`/test/${test._id}`, {
      state: {
        test,
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
                    {hospital.name?.charAt(0).toUpperCase() + hospital.name?.slice(1)}
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
                  {hospital.taglines?.map((tagline, index) => (
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
                        alignItems: 'center' ,
                        justifyContent: 'center',
                        backgroundColor: selectedCategory === tagline ? '#e0f7fa' : '#fff',
                        borderColor: selectedCategory === tagline ? '#00bcd4' : '#ccc',
                        width: 100, 
                      }}
                      onClick={() => setSelectedCategory(tagline)}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 50, 
                          height: 50, 
                          objectFit: 'cover',
                          borderRadius: '5px',
                        }}
                        image={testimg}
                        alt={tagline}
                      />
                      <Typography variant="body2" sx={{ mt: 0.5 }}> 
                        {tagline}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {filteredTestsList.length === 0 ? (
                  <Typography variant="h6" color="textSecondary" align="center">
                    No tests match your search.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {filteredTestsList.map((test) => (
                      <Grid item key={test._id} xs={12}>
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
                          onClick={() => handleTestCardClick(test)}
                        >
                          {test.image?.length > 0 ? (
                            <CardMedia
                              component="img"
                              sx={{
                                width: isMobile ? 80 : 100,
                                height: isMobile ? 80 : 100,
                                borderRadius: "5px"
                              }}
                              image={test.image[0]}
                              alt={test.name}
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
                              {test.name?.charAt(0)}
                            </Box>
                          )}
                          <CardContent sx={{ flexGrow: 1, marginLeft: 2 }}>
                            <Typography variant="h6" component="div">
                              {test.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {test.price ? `Consultancy Fee: ${test.price.consultancyfee}, Service Fee: ${test.price.servicefee}` : "No price information available"}
                            </Typography>
                          </CardContent>
                          {favorites?.includes(test._id) && (
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

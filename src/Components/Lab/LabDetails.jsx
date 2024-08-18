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
import testimg from "../../Assets/image1.png";

const HospitalDetailsPage = ({
  login,
  toggleLogin,
  mobile,
  setMobile,
  searchQuery,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hospital } = location.state || {};
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { taglines = [] } = location.state || {};
  useEffect(() => {
    if (hospital.id) {
      const fetchHospitalDetails = async () => {
        try {
          const testRequests =
            hospital.tests?.map(async (test) => {
              try {
                const response = await fetch(
                  `http://localhost:9999/api/bma/tests/${test.testid}`
                );
                if (!response.ok) {
                  throw new Error(`Failed to fetch test ${test.testid}`);
                }
                const data = await response.json();
                return data.test;
              } catch (error) {
                console.error(`Error fetching test ${test.testid}:`, error);
                return null;
              }
            }) || [];
          const testData = await Promise.all(testRequests);
          const allTests = testData.filter((test) => test !== null);
          setTests(allTests);
        } catch (error) {
          console.error("Error fetching test details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHospitalDetails();
    }
  }, [hospital]);

  useEffect(() => {
    let filtered = tests;

    if (searchQuery) {
      filtered = tests.filter((test) =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (test) => test.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredTests(filtered);
  }, [searchQuery, tests, selectedCategory]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:9999/api/bma/me", {
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

  const filteredTestsList = filteredTests.filter((test) =>
    hasFutureBookings(test.bookingsids || {})
  );

  const handleTestCardClick = (test) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("You must be logged in to view this page.");
      navigate("/");
    } else {
      navigate(`/test/${test._id}`, {
        state: {
          test,
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
                    {hospital.name?.charAt(0).toUpperCase() +
                      hospital.name?.slice(1)}
                  </Typography>
                </Box>
                {taglines.length > 0 && (
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
                          image={testimg}
                          alt={tagline}
                        />
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {tagline}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
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
                          onClick={() => handleTestCardClick(test)}
                        >
                          {test.image?.length > 0 ? (
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
                              image={test.image[0]}
                              alt={test.name}
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
                              {test.name?.charAt(0)}
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
                              {test.name}
                            </Typography>
                          </CardContent>
                          {favorites?.includes(test._id) ? (
                            <IconButton color="error">
                              <FavoriteIcon sx={{ color: "red" }} />
                            </IconButton>
                          ) : (
                            <IconButton color="default">
                              <FavoriteIcon sx={{ color: "grey" }} />
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

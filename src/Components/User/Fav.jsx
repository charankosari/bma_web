import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
const Fav = () => {
  const [favorites, setFavorites] = useState({ doctors: [], tests: [] });
  const [view, setView] = useState("doctors");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
          setError("No JWT token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://server.bookmyappointments.in/api/bma/me/wishlist",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.success) {
          setFavorites(data.data);
        } else {
          setError("Failed to fetch favorites");
        }
      } catch (error) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleDoctorCardClick = async (doctor) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/hospital/${doctor.hospitalid}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hospital details");
      }
      const details = await response.json();
      const hospital = details.hosp;
      navigate(`/doctor/${doctor._id}`, { state: { hospital } });
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      localStorage.removeItem("jwtToken");
      navigate("/");
    }
  };

  const handleTestClicked = async (test) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/hospital/hospital/${test.hospitalid}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hospital details");
      }
      const details = await response.json();
      const hospital = details.hosp;
      navigate(`/test/${test._id}`, { state: { hospital } });
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      localStorage.removeItem("jwtToken");
      navigate("/");
    }
  };

  return (
    <>
      <Box sx={{ padding: 2, height: isMobile ? "auto" : "70vh" }}>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Button
            variant={view === "doctors" ? "contained" : "outlined"}
            color={view === "doctors" ? "success" : "inherit"}
            sx={{
              flexGrow: 1,
              mr: 1,
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: view === "doctors" ? "#28a745" : "inherit",
              color: view === "doctors" ? "white" : "inherit",
            }}
            onClick={() => setView("doctors")}
          >
            Doctors
          </Button>
          <Button
            variant={view === "tests" ? "contained" : "outlined"}
            color={view === "tests" ? "success" : "inherit"}
            sx={{
              flexGrow: 1,
              ml: 1,
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: view === "tests" ? "#28a745" : "inherit",
              color: view === "tests" ? "white" : "inherit",
            }}
            onClick={() => setView("tests")}
          >
            Tests
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            {view === "doctors" ? (
              favorites.doctors.length > 0 ? (
                <Grid container spacing={2}>
                  {favorites.doctors.map((doctor) => (
                    <Grid item key={doctor._id} xs={12}>
                      <Card
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: 2,
                          backgroundColor: "#e0e0e0",
                          borderRadius: "15px",
                          "&:hover": {
                            cursor: "pointer",
                            backgroundColor: "#28a745",
                            color: "white",
                          },
                          "&:hover .MuiTypography-body2": {
                            color: "white",
                          },
                        }}
                        onClick={() => handleDoctorCardClick(doctor)}
                      >
                        {doctor.image ? (
                          <CardMedia
                            component="img"
                            sx={{
                              width: isMobile ? 80 : 100,
                              height: isMobile ? 80 : 100,
                              borderRadius: "5px",
                              objectFit: "cover",
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
                              backgroundColor: "#bdbdbd",
                              fontSize: isMobile ? 30 : 40,
                              color: "white",
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
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography
                  variant="body1"
                  align="center"
                  sx={{ width: "100%" }}
                >
                  No doctors in wishlist
                </Typography>
              )
            ) : favorites.tests.length > 0 ? (
              <Grid container spacing={2}>
                {favorites.tests.map((test, index) => (
                  <Grid item key={test._id} xs={12}>
                    <Card
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        backgroundColor: "#e0e0e0",
                        borderRadius: "15px",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "#28a745",
                          color: "white",
                        },
                        "&:hover .MuiTypography-body2": {
                          color: "white",
                        },
                      }}
                      onClick={() => handleTestClicked(test)}
                    >
                      {test.image ? (
                        <CardMedia
                          component="img"
                          sx={{
                            width: isMobile ? 80 : 100,
                            height: isMobile ? 80 : 100,
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                          image={test.image}
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
                            backgroundColor: "#bdbdbd",
                            fontSize: isMobile ? 30 : 40,
                            color: "white",
                          }}
                        >
                          {test.name.charAt(0)}
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1, marginLeft: 2 }}>
                        <Typography variant="h6" component="div">
                          {test.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" align="center" sx={{ width: "100%" }}>
                No tests in wishlist
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Fav;

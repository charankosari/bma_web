import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import image1 from "../../Assets/image1.png";
import image2 from "../../Assets/image1.png";
import image3 from "../../Assets/image1.png";
import image4 from "../../Assets/image1.png";
import image5 from "../../Assets/image1.png";
import defaultImage from "../../Assets/image1.png";

const categoryImages = {
  "General Physician": image1,
  "Dental Care": image2,
  Homeopathy: image2,
  Ayurveda: image3,
  "Mental Wellness": image4,
  Physiotherapy: image5,
};

const processHospitals = (data) => {
  const doctorMap = new Map();
  const allSpecialists = new Set();

  data.c.forEach((doctorData) => {
    const doctor = doctorData.doctor;
    const hasBookings = Object.keys(doctor.bookingsids || {}).length > 0;
    if (hasBookings) {
      doctorMap.set(doctor._id, doctor);
      allSpecialists.add(doctor.specialist);
    }
  });

  const updatedHospitals = data.hospitals
    .filter((hospital) => hospital.role === "hospital")
    .map((hospital) => {
      const updatedDoctors = hospital.doctors
        .map((doc) => {
          const doctor = doctorMap.get(doc.doctorid);
          return doctor ? { doctorid: doc.doctorid } : null;
        })
        .filter((doc) => doc !== null);
      const taglines = Array.from(
        new Set(
          updatedDoctors.map(
            (doc) => doctorMap.get(doc.doctorid)?.specialist || ""
          )
        )
      );
      const image = Array.isArray(hospital.image)
        ? hospital.image.length > 0
          ? hospital.image[0]
          : ""
        : hospital.image || "";
      return {
        id: hospital._id,
        name: hospital.hospitalName,
        location: hospital.address[0].city,
        image: image,
        taglines: taglines,
        doctors: updatedDoctors,
      };
    })
    .filter((hospital) => hospital.doctors.length > 0);
  return {
    updatedHospitals,
    categories: Array.from(allSpecialists),
  };
};

const HospitalList = ({
  login,
  toggleLogin,
  mobile,
  setMobile,
  searchQuery,
  selectedLocation,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [hospitalsData, setHospitalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cat, setCat] = useState([]);


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        // const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/admin/getallhospitals');
        const response = await fetch(
          "http://localhost:9999/api/bma/hospital/admin/getallhospitalsrem"
        );
        const data = await response.json();
        if (data.success) {
          const formattedData = data.hospitals
            .filter((hospital) => hospital.role === "hospital")
            .map((hospital) => ({
              id: hospital._id,
              name: hospital.hospitalName,
              location: hospital.address[0].city,
              image: hospital.image[0] || "",
              taglines: hospital.category.map((category) => category.types),
              doctors: hospital.doctors,
            }));
          const s = processHospitals(data);
          setCat(s.categories);
          setHospitalsData(s.updatedHospitals);
          setFilteredHospitals(s.updatedHospitals);
        }
      } catch (error) {
        console.error("Error fetching hospital data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedLocation && selectedLocation !== "Current Location") {
      filterHospitals(selectedLocation);
    } else if (selectedLocation === "Current Location" && currentLocation) {
      fetchAreaName(currentLocation.latitude, currentLocation.longitude);
    } else {
      setFilteredHospitals(hospitalsData);
    }
  }, [selectedLocation, currentLocation, hospitalsData]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = hospitalsData.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hospital.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitalsData);
    }
  }, [searchQuery, hospitalsData]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = hospitalsData.filter((hospital) =>
        hospital.taglines.some((tagline) =>
          tagline.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );
      setFilteredHospitals(filtered);
    }
  }, [selectedCategory, hospitalsData]);

  const fetchAreaName = async (latitude, longitude) => {
    const apiKey = "YOUR_OPENCAGE_API_KEY";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const area =
          components.neighbourhood ||
          components.suburb ||
          components.village ||
          "Unknown";
        setAreaName(area);
        const filtered = hospitalsData.filter((hospital) =>
          hospital.location.toLowerCase().includes(area.toLowerCase())
        );
        if (filtered.length === 0 && selectedLocation === 'Select location') {
          setWarningMessage(null);
          setFilteredHospitals(hospitalsData);
        } else if (filtered.length === 0) {
          setWarningMessage("No hospitals found in your area");
          setFilteredHospitals([]);
        } else {
          setWarningMessage(null);
          setFilteredHospitals(filtered);
        }
        
        
      } else {
        console.error("No results found");
      }
    } catch (error) {
      console.error("Error fetching area name: ", error);
    }
  };
  const filterHospitals = (location) => {
    if (location === 'Select location') {
      setWarningMessage(null); 
      setFilteredHospitals(hospitalsData); 
      return; 
    }
  
    const filtered = hospitalsData.filter((hospital) =>
      hospital.location.toLowerCase().includes(location.toLowerCase())
    );
  
    if (filtered.length === 0) {
      setWarningMessage("No hospitals found at your selected location.");
      setFilteredHospitals(hospitalsData);
    } else {
      setWarningMessage(""); 
      setFilteredHospitals(filtered);
    }
  };
  

  const handleHospitalClick = (hospitalId, taglines) => {
    navigate(`/hospitaldetail/${hospitalId}`, {
      state: { taglines }
    });
  };
  

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
      setFilteredHospitals(hospitalsData);
    } else {
      setSelectedCategory(category);
      const filtered = hospitalsData.filter((hospital) =>
        hospital.taglines.some((tagline) =>
          tagline.toLowerCase().includes(category.toLowerCase())
        )
      );
      setFilteredHospitals(filtered);
    }
  };
  

  return (
    <>
      <Container maxWidth="2xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "auto",
            minHeight: isMobile ? "50vh" : "65vh",
            width: "100%",
            borderRadius: "20px",
            p: 3,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.map((category, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "8px",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                      padding: "5px",
                      border:
                        selectedCategory === category
                          ? "2px solid #2bb673"
                          : "none",
                    }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <img
                      src={categoryImages[category] || defaultImage}
                      alt={category}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "10px",
                      }}
                    />
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {category}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {warningMessage && (
                <Typography variant="h6" color="error" gutterBottom>
                  {warningMessage}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <Card
                      key={hospital.id}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        mb: 2,
                        cursor: "pointer",
                        alignItems: "center",
                        gap: "10px",
                        transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
                        backgroundColor: "transparent", 
                        color: "inherit",
                        "&:hover": {
                          backgroundColor: "#2BB673", 
                          color: "white", 
                          transform: "scale(1.03)", 
                        },
                      }}
                      onClick={() => handleHospitalClick(hospital.id,hospital.taglines)}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: isMobile ? "80px" : "120px",
                          height: isMobile ? "80px" : "120px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          padding: "10px",
                        }}
                        image={hospital.image || defaultImage}
                        alt={hospital.name}
                      />
                      <CardContent
                        sx={{
                          paddingLeft: isMobile ? "8px" : "16px",
                        }}
                      >
                        <Typography variant={isMobile ? "subtitle1" : "h6"}>
                          {hospital.name}
                        </Typography>
                        <Typography
                          variant={isMobile ? "caption" : "body2"}
                        >
                          {hospital.location}
                        </Typography>
                        {hospital.taglines.map((tagline, idx) => (
                          <Typography
                            key={idx}
                            variant={isMobile ? "caption" : "body2"}
                          >
                            {tagline}
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    No hospitals found.
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default HospitalList;

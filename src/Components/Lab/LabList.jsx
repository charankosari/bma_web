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
  Homeopathy: image3,
  Ayurveda: image4,
  "Mental Wellness": image5,
  Physiotherapy: defaultImage,
};

const processHospitals = (data) => {
  const testMap = new Map();
  const allcat = new Set();

  data.d.forEach((testData) => {
    const test = testData.test;
    if (test.bookingsids && Object.keys(test.bookingsids).length > 0) {
      testMap.set(test._id, test);
      allcat.add(test.name);
    }
  });

  const updatedHospitals = data.hospitals
    .filter((hospital) => hospital.role === "lab")
    .map((hospital) => {
      const updatedTest = hospital.tests
        .map((test) => {
          const tests = testMap.get(test.testid);
          return tests ? { testid: test.testid } : null;
        })
        .filter((test) => test !== null);

      const taglines = Array.from(
        new Set(updatedTest.map((doc) => testMap.get(doc.testid)?.name || ""))
      );

      const image =
        Array.isArray(hospital.image) && hospital.image.length > 0
          ? hospital.image[0]
          : defaultImage;

      return {
        id: hospital._id,
        name: hospital.hospitalName,
        location: hospital.address[0].city,
        image: image,
        taglines: taglines,
        tests: updatedTest,
        address: hospital.address[0],
      };
    })
    .filter((hospital) => hospital.tests.length > 0);

  return {
    updatedHospitals,
    categories: Array.from(allcat),
  };
};

const LabList = ({
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
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [hospitalsData, setHospitalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:9999/api/bma/hospital/admin/getallhospitalsrem"
        );
        const data = await response.json();
        if (data.success) {
          const { updatedHospitals, categories } = processHospitals(data);
          setCategories(categories);
          setHospitalsData(updatedHospitals);
          setFilteredHospitals(updatedHospitals);
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
    } else {
      setFilteredHospitals(hospitalsData);
    }
  }, [selectedCategory, hospitalsData]);

  const handleHospitalClick = (hospitalId, taglines, hospital) => {
    navigate(`/labdetail/${hospitalId}`, {
      state: { taglines, hospital },
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
                  width: "100%",
                  marginLeft: "10px",
                  marginBottom: "15px",
                }}
              >
                {categories.map((category, index) => (
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
                        selectedCategory === category ? "#2BB673" : "#ccc",
                      width: 100,
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
                <Typography variant="h6" color="red">
                  {warningMessage}
                </Typography>
              )}
              {filteredHospitals.length === 0 ? (
                <Typography variant="h6">No Labs found</Typography>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  {filteredHospitals.map((hospital) => (
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
                        transition:
                          "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
                        backgroundColor: "transparent",
                        color: "inherit",
                        "&:hover": {
                          backgroundColor: "#2BB673",
                          color: "white",
                          transform: "scale(1.03)",
                        },
                      }}
                      onClick={() =>
                        handleHospitalClick(
                          hospital.id,
                          hospital.taglines,
                          hospital
                        )
                      }
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
                        <Typography variant={isMobile ? "caption" : "body2"}>
                          {hospital.location}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default LabList;

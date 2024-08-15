import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

// Import images for categories
import image1 from "../../Assets/dental.png";
import image2 from "../../Assets/dental.png";
import image3 from "../../Assets/dental.png";
import image4 from "../../Assets/dental.png";
import image5 from "../../Assets/dental.png";
import image6 from "../../Assets/dental.png";

const categoryImages = {
  "General Physician": image1,
  "Dental Care": image2,
  "Homeopathy": image3,
  "Ayurveda": image4,
  "Mental Wellness": image5,
  "Physiotherapy": image6,
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
    .filter(hospital => hospital.role === "hospital")
    .map(hospital => {
      const updatedDoctors = hospital.doctors
        .map(doc => {
          const doctor = doctorMap.get(doc.doctorid);
          return doctor ? { doctorid: doc.doctorid } : null;
        })
        .filter(doc => doc !== null);
      const taglines = Array.from(new Set(
        updatedDoctors.map(doc => doctorMap.get(doc.doctorid)?.specialist || '')
      ));
      const image = Array.isArray(hospital.image) 
        ? (hospital.image.length > 0 ? hospital.image[0] : '') 
        : hospital.image || '';
      return {
        id: hospital._id,
        name: hospital.hospitalName,
        location: hospital.address[0].city,
        image: image,
        taglines: taglines,
        doctors: updatedDoctors
      };
    })
    .filter(hospital => hospital.doctors.length > 0); 
  return {
    updatedHospitals,
    categories: Array.from(allSpecialists)
  };
};

const HospitalList = ({ login, toggleLogin, mobile, setMobile, searchQuery, selectedLocation }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [hospitalsData, setHospitalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cat,setCat]=useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        // const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/admin/getallhospitals');
        const response = await fetch('http://localhost:9999/api/bma/hospital/admin/getallhospitalsrem');
        const data = await response.json();
        if (data.success) {
          const formattedData = data.hospitals
            .filter(hospital => hospital.role === 'hospital')
            .map(hospital => ({
              id: hospital._id,
              name: hospital.hospitalName,
              location: hospital.address[0].city,
              image: hospital.image[0] || '',
              taglines: hospital.category.map(category => category.types),
              doctors: hospital.doctors 
            }));
            const s = processHospitals(data);
            setCat(s.categories)
          setHospitalsData(s.updatedHospitals);
          setFilteredHospitals(s.updatedHospitals);
        }
      } catch (error) {
        console.error('Error fetching hospital data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedLocation && selectedLocation !== 'Current Location') {
      filterHospitals(selectedLocation);
    } else if (selectedLocation === 'Current Location' && currentLocation) {
      fetchAreaName(currentLocation.latitude, currentLocation.longitude);
    } else {
      setFilteredHospitals(hospitalsData);
    }
  }, [selectedLocation, currentLocation, hospitalsData]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = hospitalsData.filter(hospital =>
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
      const filtered = hospitalsData.filter(hospital =>
        hospital.taglines.some(tagline => tagline.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
      setFilteredHospitals(filtered);
    }
  }, [selectedCategory, hospitalsData]);

  const fetchAreaName = async (latitude, longitude) => {
    const apiKey = 'YOUR_OPENCAGE_API_KEY'; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const components = data.results[0].components;
        const area = components.neighbourhood || components.suburb || components.village || 'Unknown';
        setAreaName(area);
        const filtered = hospitalsData.filter(hospital =>
          hospital.location.toLowerCase().includes(area.toLowerCase())
        );
        if (filtered.length === 0) {
          setWarningMessage('No hospitals found at your location.');
          setFilteredHospitals(hospitalsData); 
        } else {
          setWarningMessage('');
          setFilteredHospitals(filtered);
        }
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error fetching area name: ', error);
    }
  };

  const filterHospitals = (location) => {
    const filtered = hospitalsData.filter(hospital =>
      hospital.location.toLowerCase().includes(location.toLowerCase())
    );
    if (filtered.length === 0) {
      setWarningMessage('No hospitals found at your selected location.');
      setFilteredHospitals(hospitalsData); 
    } else {
      setWarningMessage('');
      setFilteredHospitals(filtered);
    }
  };

  const handleHospitalClick = (hospitalId) => {
    navigate(`/hospitaldetail/${hospitalId}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Container maxWidth="2xl">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'auto',
            minHeight: isMobile ? '50vh' : '65vh',
            width: '100%',
            borderRadius: '20px',
            p: 3
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  mb: 2,
                  p: 1,
                  borderBottom: '1px solid #ddd'
                }}
              >
                {Object.keys(cat).map((category, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'inline-block',
                      mx: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedCategory === category ? '2px solid #000' : 'none',
                    }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <img 
                      src={categoryImages[category]} 
                      alt={category} 
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '10px' 
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
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <Card 
                      key={hospital.id} 
                      sx={{
                        display: 'flex',
                        mb: 2,
                        width: '100%',
                        borderRadius: '12px',
                        overflow: 'hidden'
                      }}
                      onClick={() => handleHospitalClick(hospital.id)}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: 150, height: 150 }}
                        image={hospital.image}
                        alt={hospital.name}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {hospital.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {hospital.location}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {hospital.taglines.map((tagline, index) => (
                            <Typography key={index} variant="body2" color="textSecondary">
                              {tagline}
                            </Typography>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="h6">No hospitals found.</Typography>
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

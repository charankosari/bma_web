import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia, Container, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

const LabList = ({  searchQuery, selectedLocation }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
  const [currentLocation, setCurrentLocation] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [hospitalsData, setHospitalsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState('');
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://server.bookmyappointments.in/api/bma/hospital/admin/getallhospitals');
        const data = await response.json();
        if (data.success) {
          const formattedData = data.hospitals
            .filter(hospital => hospital.role === 'lab')
            .map(hospital => ({
              id: hospital._id,
              name: hospital.hospitalName,
              location: hospital.address[0].city,
              image: hospital.image[0] || '',
              taglines: hospital.category.map(category => category.types),
              tests:hospital.tests,
              address:hospital.address[0],
            }));
          setHospitalsData(formattedData);
          setFilteredHospitals(formattedData);
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

  const handleHospitalClick = (hospital) => {
    navigate(`/labdetail/${hospital.id}`,{state:hospital});
  };

  return (
    <>
      <Container maxWidth="2xl">
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: isMobile ? '60vh' : '70vh', // Minimum height for mobile and PC screens
            width: '100%',
            backgroundColor: '#f5f5f5',
            borderRadius: '20px',
            boxShadow: 3,
            p: 3
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <>
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
                {filteredHospitals.length === 0 && !warningMessage ? (
                  <Typography variant="h6" color="textSecondary">
                    No Labs found.
                  </Typography>
                ) : (
                  filteredHospitals.map(hospital => (
                    <Card
                      key={hospital.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        mb: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                        height: isMobile ? '100px' : '120px', 
                        '&:hover': {
                          cursor: 'pointer',
                          backgroundColor: '#2BB673',
                        }
                      }}
                      onClick={() => handleHospitalClick(hospital)}
                    >
                      <Box
                        sx={{
                          width: isMobile ? 90 : 120, 
                          height: isMobile ? 90 : 120,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          padding: isMobile ? '5px' : '10px', 
                          backgroundColor: 'transparent'
                        }}
                      >
                        {hospital.image ? (
                          <CardMedia
                            component="img"
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                            image={hospital.image}
                            alt={hospital.name}
                          />
                        ) : (
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              textAlign: 'center', 
                              color: '#555', 
                              lineHeight: isMobile ? '90px' : '120px', 
                              backgroundColor: '#e0e0e0',
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5px'
                            }}
                          >
                            {hospital.name.charAt(0)}
                          </Typography>
                        )}
                      </Box>
                      <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                        <Typography variant="h6" sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                          {hospital.name}
                        </Typography>
                        <Typography color="textSecondary" sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                          {hospital.location}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
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

export default LabList;
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // Icon for no bookings
import moment from 'moment';
import Footer from '../Footer';

const Bookings = () => {
  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
          setError('No JWT token found');
          setLoading(false);
          return;
        }

        const response = await fetch('https://server.bookmyappointments.in/api/bma/allbookingdetails', {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
          setBookingDetails(data.bookingDetails);
        } else {
          setError('Failed to fetch booking details');
        }
      } catch (error) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleNavigate = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('MMM DD, YYYY');
  };

  const categorizeBookings = () => {
    const now = moment();
    return bookingDetails.reduce((acc, bookingDetail) => {
      const { booking } = bookingDetail;
      const bookedOn = moment(booking.bookedOn);

      if (bookedOn.isSame(now, 'day')) {
        acc.today.push(bookingDetail);
      } else if (bookedOn.isAfter(now)) {
        acc.upcoming.push(bookingDetail);
      } else if (bookedOn.isBefore(now)) {
        acc.past.push(bookingDetail);
      }

      return acc;
    }, { past: [], today: [], upcoming: [] });
  };

  const categorizedBookings = bookingDetails.length > 0 ? categorizeBookings() : { past: [], today: [], upcoming: [] };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box>
            {bookingDetails.length <= 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60vh',
                  textAlign: 'center',
                }}
              >
                <EmojiEmotionsIcon sx={{ fontSize: 80, color: '#ffb300' }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  No bookings available
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  It looks like you have no bookings at the moment. Check back later!
                </Typography>
              </Box>
            ) : (
              Object.keys(categorizedBookings).map((category) => {
                const bookings = categorizedBookings[category];
                return bookings.length > 0 ? (
                  <Box key={category} sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      {category.charAt(0).toUpperCase() + category.slice(1)} Bookings
                    </Typography>
                    <Grid container spacing={2}>
                      {bookings.map((bookingDetail) => {
                        const { booking, hospital, doctor, test } = bookingDetail;
                        const { latitude, longitude } = hospital?.location?.[0] || {};

                        return (
                          <Grid item key={booking._id} xs={12}>
                            <Card
                              sx={{
                                padding: isMobile ? 1 : 2,
                                backgroundColor: '#d9d9d9',
                                color: 'black',
                                fontWeight: 'bold',
                                borderRadius: '15px',
                              }}
                            >
                              <CardContent>
                                <Box sx={{
                                  display: 'flex',
                                  flexDirection: isMobile ? 'column' : 'row',
                                  justifyContent: 'space-between',
                                  alignItems: isMobile ? 'flex-start' : 'center',
                                  gap: 2
                                }}>
                                  <Box>
                                    <Typography variant="h6" component="div">
                                      Booking Date and Time
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'black' }}>
                                      {formatDate(booking.date)} {booking.time}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: isMobile ? 'left' : 'center' }}>
                                    <Typography variant="h6" component="div" sx={{textTransform:'capitalize'}}>
                                      {hospital?.hospitalName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'black',textTransform:'capitalize' }}>
                                      {doctor ? `${doctor.name} - ${doctor.specialist}` : test?.name}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                                    <Typography variant="body2" sx={{ color: 'black' }}>
                                      Booked on {formatDate(booking.bookedOn)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                                      Paid Amount
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                                      ₹ {booking.amountpaid}
                                    </Typography>
                                  </Box>
                                </Box>
                                {hospital && (
                                  <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                      mt: 2,
                                      borderRadius: '20px',
                                      textTransform: 'none',
                                      backgroundColor: '#4CAF50',
                                      color: 'white',
                                      '&:hover': {
                                        backgroundColor: '#45a049',
                                      },
                                    }}
                                    onClick={() => handleNavigate(latitude, longitude)}
                                  >
                                    Navigate to Hospital
                                  </Button>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ) : null;
              })
            )}
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Bookings;

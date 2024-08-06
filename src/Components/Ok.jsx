import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [location, setLocation] = useState('Fetching location...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async (latitude, longitude) => {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      try {
        const response = await axios.get(url);
        const data = response.data;

        if (data && data.address) {
          // Extract the city, town, or village
          const city = data.address.city || data.address.town || data.address.village || 'City not found';
          setLocation(city);
        } else {
          setLocation('No address found');
        }
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocation('Error fetching location name');
      }
    };

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchLocation(latitude, longitude);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setError('Error getting location: ' + error.message);
            setLocation('Location not available');
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        setLocation('Location not available');
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <div>
      <h1>Current City</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{location}</p>
    </div>
  );
};

export default App;

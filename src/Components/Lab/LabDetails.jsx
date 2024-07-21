import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LabDetails.css';
import Navbar from '../Navbar';
import Footer from '../Footer';

const LabDetailsPage = ({ login, toggleLogin, mobile, setMobile }) => {
  const { hospitalId } = useParams();
  const history = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState({});
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch(`https://server.bookmyappointments.in/api/bma/user/labs/${hospitalId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();

        if (response.ok) {
          setTests(responseData.hospital.tests);
          const wishlist = await fetchWishlist();
          const favoriteTests = wishlist.data.tests.reduce((acc, test) => {
            acc[test._id] = true;
            return acc;
          }, {});
          setIsFavorite(favoriteTests);
        } else {
          alert('Error: ' + responseData.message);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        alert('Error: An error occurred while fetching tests.');
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          console.log('No token found');
          return { data: { tests: [] } };
        }

        const response = await fetch('https://server.bookmyappointments.in/api/bma/me/wishlist', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        return { data: { tests: [] } };
      }
    };

    fetchTests();
  }, [hospitalId]);

  const handleFavouritePress = async (test) => {
    try {
      setFavoriteLoading(true);
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await fetch(`https://server.bookmyappointments.in/api/bma/me/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          type: 'test',
          testId: test._id,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert('Success: ' + responseData.message);
        setIsFavorite(prev => ({ ...prev, [test._id]: !prev[test._id] }));
      } else {
        alert('Error: ' + responseData.message);
      }
    } catch (error) {
      console.error('Error adding test to favorites:', error);
      alert('Error: An error occurred while adding to favorites.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBookNow = (test) => {
    history.push({
      pathname: '/detailed-lab-booking',
      state: {
        testDetails: test,
        hospitalId: hospitalId,
      },
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  console.log(tests)
  return (
    <div>      <Navbar login={login} mobile={mobile} setMobile={setMobile} />

    <div className="lab-details-page">
      {tests.map(test => (
        <div key={test._id} className="test-card">
          <div className="test-card-content">
            <img src={test.image} alt={test.name} className="test-image" />
            <div className="test-info">
              <div className="test-header">
                <h3 className="test-name">{test.name}</h3>
                <h4 className="test-price">{`$${test.price.consultancyfee}`}</h4>
              </div>
              <button
                className="test-heart"
                onClick={() => handleFavouritePress(test)}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? 'Loading...' : (isFavorite[test._id] ? '❤️' : '🤍')}
              </button>
            </div>
          </div>
          
        </div>
      ))}
    </div>
    <Footer/>
    </div>
  );
};

export default LabDetailsPage;

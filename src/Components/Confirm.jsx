import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const BookingConfirmation = ({ login, toggleLogin, mobile, setMobile }) => {
    return (
        <div>
            <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>
        <div style={styles.container}>
            <h1 style={styles.title} >YOUR BOOKING HAS CONFIRMED</h1>
            <p style={styles.bookingId}>Booking ID 232455667</p>
            <p style={styles.thankYou}>THANK YOU FOR CHOOSING US</p>
            <a href="#" style={styles.link}>Book another service?</a>
        </div>
        <Footer/>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        textalign:'center',
    },
    title: {
        color: '#2ecc71',
        fontSize: '24px',
        textalign:'center',
        margin: '10px 0'
    },
    bookingId: {
        fontSize: '18px',
        margin: '5px 0'
    },
    thankYou: {
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '10px 0'
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        marginTop: '15px'
    }
};

export default BookingConfirmation;

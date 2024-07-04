import React from "react";
import DoctorCard from "./DoctorCard";
import Header from "../Header";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Doctors = ({hospital, login, toggleLogin, mobile, setMobile}) => {
    const doctors = [
      { name: 'Dr. Akil Shaikh', degree: 'MBBS, PhD.', rating: 3, image: 'https://via.placeholder.com/50', favorite: true },
      { name: 'Dr. Ashish Garg', degree: 'MBBS, PhD.', rating: 3, image: 'https://via.placeholder.com/50', favorite: false },
      { name: 'Dr. Akil Shaikh', degree: 'MBBS, PhD.', rating: 3, image: 'https://via.placeholder.com/50', favorite: true },
    ];
  
    return (
      <div>
        <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>
      <div className="doctor-list">
        <h1>{hospital}</h1>
        {doctors.map((doctor, index) => (
          <DoctorCard 
            key={index} 
            name={doctor.name} 
            degree={doctor.degree} 
            rating={doctor.rating} 
            image={doctor.image} 
            favorite={doctor.favorite} 
          />
        ))}
      </div>
      <Footer/>
      </div>
    );
  }
  
  export default Doctors;
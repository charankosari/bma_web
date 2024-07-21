import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import DoctorCard from '../Doctor/DoctorCard'; // Adjust the path as necessary
import './HospitalDetails.css'; // Import the CSS file
import Footer from "../Footer";
import moment from "moment";

const HospitalDetailsPage = ({ login, toggleLogin, mobile, setMobile }) => {
const navigate = useNavigate()

  const { id: hospitalId } = useParams(); // Get the hospitalId from the URL params
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await fetch(`https://server.bookmyappointments.in/api/bma/user/doctors/${hospitalId}`);
        const data = await response.json();
        setHospital(data.hospital);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hospital details:", error);
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, [hospitalId]);

  useEffect(() => {
    if (hospital) {
      // Fetch doctor details for the hospital
      const fetchDoctors = async () => {
        try {
          const response = await fetch(`https://server.bookmyappointments.in/api/bma/user/doctors/${hospital._id}`);
          const data = await response.json();
          setDoctors(data.hospital.doctors);
          console.log(data)
        } catch (error) {
          console.error("Error fetching doctors:", error);
        }
      };

      fetchDoctors();
    }
  }, [hospital]);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const hasFutureBookings = (bookingids) => {
    const today = moment().startOf('day');
    return Object.keys(bookingids).some(date => moment(date, "DD-MM-YYYY").isSameOrAfter(today));
  };

  const filteredDoctorsList = (searchText ? filteredDoctors : doctors).filter(
    (doctor) =>
      doctor.specialist &&
      hasFutureBookings(doctor.bookingsids)
  );

  const handleDoctorCardClick = (doctor) => {
    navigate(`/booking/${hospitalId}/${doctor._id}`, {
      state: {
        doctor,
        hospital
      }
    });
  };

  return (
    <div>
      <div className="navbar-sticky">
        <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>
      </div>
      <div className="main-content">
        {loading ? (
          <div>Loading hospital details...</div>
        ) : (
          hospital && (
            <>
              <div className="hospital-header">
                <h1>{hospital.hospitalName}</h1>
                
              </div>
              {doctors.length === 0 ? (
                <div>No doctors available at the moment</div>
              ) : (
                <div className="doctor-list">
                  {doctors.length === 0 ? (
                    <div>No doctors match your search</div>
                  ) : (
                    doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        hospitalId={hospitalId}
                        onClick={() => handleDoctorCardClick(doctor)}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default HospitalDetailsPage;

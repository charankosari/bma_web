import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import Navbar from "./Navbar";
import './Lab.css';

const LabPage = ( { login, toggleLogin, mobile, setMobile }) => {
  const labsData = [
    { id: 1, name: "Done", price: 250 },
    { id: 2, name: "Working", price: 300 },
    { id: 3, name: "LabCorp", price: 350 },
    { id: 4, name: "Quest Diagnostics", price: 400 },
    { id: 5, name: "Mayo Clinic Laboratories", price: 450 },
    { id: 6, name: "ARUP Laboratories", price: 500 },
    { id: 7, name: "Sonic Healthcare", price: 550 },
    { id: 8, name: "Genomic Health", price: 600 },
    { id: 9, name: "Myriad Genetics", price: 650 },
    { id: 10, name: "Invitae", price: 700 },
    { id: 11, name: "Foundation Medicine", price: 750 },
    { id: 12, name: "Ambry Genetics", price: 800 },
    { id: 13, name: "LabCorp Diagnostics", price: 850 },
    { id: 14, name: "Eurofins Scientific", price: 900 },
    { id: 15, name: "LabCorp Specialty Testing", price: 950 },
    { id: 16, name: "AmeriPath", price: 1000 },
    { id: 17, name: "Quest Diagnostics Employer Solutions", price: 1050 },
    { id: 18, name: "Cleveland HeartLab", price: 1100 },
    { id: 19, name: "Miraca Life Sciences", price: 1150 },
    { id: 20, name: "LabCorp Drug Development", price: 1200 },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [filteredLabs, setFilteredLabs] = useState(labsData);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = labsData.filter((lab) =>
      lab.name.toLowerCase().includes(value)
    );
    setSearchValue(e.target.value);
    setFilteredLabs(filtered);
  };

  const handleLabClick = (lab) => {
    navigate("/checkout1", { state: { labName: lab.name, price: lab.price } });
  };

  return (
    <div>
      <Navbar  login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>
      <div className="container">
        <div className="content">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="lab-list">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="lab-item"
                onClick={() => handleLabClick(lab)}
              >
                <span className="lab-link">{lab.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPage;

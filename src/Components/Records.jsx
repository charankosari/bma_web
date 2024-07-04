import { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "./Navbar";
import './Records.css'

const Records = ({ login, toggleLogin, mobile, setMobile }) => {
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [fileType, setFileType] = useState(""); // To store the type of file selected
  const fileInputRef = useRef(null); // Ref for file input

  const handleFileUpload = (type) => {
    setFileType(type);
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    setShowModal(false);
  };

  return (
    <>
      <Navbar login={login} toggleLogin={toggleLogin} mobile={mobile} setMobile={setMobile}/>
      <div className="container">
        <div className="content">
          <div className="no-records">
            {files.length === 0 ? (
              <p className="no-records-text">
                No records
              </p>
            ) : (
              <ul>
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="file-item"
                  >
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="add-button-container">
            <div
              className="add-button"
              onClick={() => setShowModal(!showModal)} // Toggle modal on click
            >
              <FaPlus className="plus-icon" />
            </div>
            {showModal && (
              <div
                className="modal"
              >
                <div className="modal-content">
                  <input
                    type="file"
                    accept={
                      fileType === "image" ? "image/*" : ".pdf,.doc,.docx,.txt"
                    }
                    onChange={handleFileChange}
                    className="file-input"
                    ref={fileInputRef} // Reference to the input element
                  />
                  <button
                    className="upload-button"
                    onClick={() => handleFileUpload("image")}
                  >
                    Image
                  </button>
                  <div className="separator"></div>
                  <button
                    className="upload-button"
                    onClick={() => handleFileUpload("file")}
                  >
                    File
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Records;

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Fab,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  InsertDriveFile as F,
  PictureAsPdf as FileIcon,
} from "@mui/icons-material";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useNavigate } from "react-router";
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif"];

const isImage = (filename) => {
  const ext = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  return imageExtensions.includes(`.${ext.toLowerCase()}`);
};

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [deletingFile, setDeletingFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (type) => {
    if (type === "image") {
      imageInputRef.current.click();
    } else if (type === "pdf") {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    if (file.type !== "application/pdf" && !isImage(file.name)) {
      alert("Please upload a valid image or PDF file.");
      return;
    }
    console.log(file);

    setUploadingFile(true);
    const jwtToken = localStorage.getItem("jwtToken");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/upload",
        // "http://localhost:9999/api/bma/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        fetchFiles(jwtToken);
      } else {
        alert("Upload failed, please try again.");
        localStorage.removeItem("jwtToken");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error occurred, please try again.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/";
    } finally {
      setUploadingFile(false);
      setShowUploadOptions(false);
    }
  };

  const handleDelete = async (filename) => {
    console.log(filename);
    if (!deleteConfirmation) {
      setDeleteConfirmation(filename);
      return;
    }

    if (deleteConfirmation !== filename) {
      setDeleteConfirmation(null);
      return;
    }

    setDeletingFile(filename);
    setDeleteConfirmation(null);

    const jwtToken = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `https://server.bookmyappointments.in/api/bma/delete/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (response.ok) {
        const updatedFiles = files.filter((file) => file.name !== filename);
        setFiles(updatedFiles);
      } else {
        alert("Delete failed, please try again.");
        localStorage.removeItem("jwtToken");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      localStorage.removeItem("jwtToken");
      window.location.href = "/";
    } finally {
      setDeletingFile(null);
    }
  };

  const fetchFiles = async (jwtToken) => {
    try {
      const response = await fetch(
        "https://server.bookmyappointments.in/api/bma/me",
        // "http://localhost:9999/api/bma/me",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      const data = await response.json();
      setFiles(data.user.files);
    } catch (error) {
      console.error("Error fetching files:", error);
      localStorage.removeItem("jwtToken");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    fetchFiles(jwtToken);
  }, []);

  const handleViewFile = (file) => {
    setViewingFile(file);
  };

  const handleCloseFile = () => {
    setViewingFile(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {files.length}/10 files
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            width: "100%",
            textAlign: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography>No files or images in medical reports</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {files.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleViewFile(file)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px",
                }}
              >
                <FileIcon sx={{ fontSize: 40, marginRight: "16px" }} />
                <CardContent
                  sx={{
                    flex: 1,
                    padding: 0,
                    overflow: "hidden", // Prevent content overflow
                    maxWidth: { xs: "65%", sm: "80%" }, // Adjust width for mobile
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    noWrap
                    sx={{
                      textOverflow: "ellipsis", // Ensure text truncation
                      overflow: "hidden",
                    }}
                  >
                    {file.name}
                  </Typography>
                </CardContent>
                <IconButton
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.name);
                  }}
                  sx={{ padding: "8px" }}
                >
                  {deletingFile === file.name ? (
                    <CircularProgress size={24} />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {showUploadOptions && (
        <Box
          sx={{
            position: "fixed",
            bottom: 96,
            right: 16,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            startIcon={<ImageIcon />}
            onClick={() => handleUpload("image")}
            disabled={uploadingFile || files.length >= 10}
            sx={{
              backgroundColor: "#28a745",
              "&:hover": {
                backgroundColor: "#218838",
              },
            }}
          >
            Image
          </Button>
          <Button
            variant="contained"
            startIcon={<F />}
            onClick={() => handleUpload("pdf")}
            disabled={uploadingFile || files.length >= 10}
            sx={{
              backgroundColor: "#28a745",
              "&:hover": {
                backgroundColor: "#218838",
              },
            }}
          >
            PDF
          </Button>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setShowUploadOptions(!showUploadOptions)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#28a745",
          "&:hover": {
            backgroundColor: "#218838",
          },
        }}
      >
        <AddIcon />
      </Fab>

      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={imageInputRef}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {viewingFile && (
        <Dialog
          open={Boolean(viewingFile)}
          onClose={handleCloseFile}
          maxWidth="xl"
          fullWidth
          fullScreen
        >
          <DialogTitle>{viewingFile.name}</DialogTitle>
          <DialogContent>
            {isImage(viewingFile.name) ? (
              <img
                src={viewingFile.location}
                alt={viewingFile.name}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}
                >
                  <Viewer
                    fileUrl={`https://server.bookmyappointments.in/api/bma/downloadb?url=${viewingFile.location}`}
                    // fileUrl={`http://localhost:9999/api/bma/downloadb?url=${viewingFile.location}`}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Worker>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFile}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default FileUpload;

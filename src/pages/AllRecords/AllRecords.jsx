import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import Loader from "../../component/Loader/Loader"; // Import the loader component
import "./AllRecords.css";
import policelogo from "../../assets/policelogo.png";
import { Link, useNavigate } from "react-router-dom";

const AllRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true); // Show loader while fetching
      try {
        const response = await axios.get(
          "https://policecrimeserver.onrender.com/get-all-record",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecords(response.data);
        setError("");
      } catch (err) {
        console.error("Error:", err.response || err.message);
        setError("Failed to fetch records.");
      } finally {
        setLoading(false); // Hide loader when done
      }
    };

    fetchRecords();
  }, [token]);

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
  };

  const handleUpdateClick = (recordId) => {
    navigate(`/update/${recordId}`);
  };

  return (
    <div className="AllRecordsBody">
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <h2>All Records</h2>
      {loading && <Loader />} {/* Show loader while loading */}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ul className="recordsList">
          {records.map((record) => (
            <li
              key={record._id}
              className="recordItem"
              onClick={() => handleRecordClick(record)}
            >
              {record.name}
            </li>
          ))}
        </ul>
      )}
      {selectedRecord && (
        <div className="recordDetailsOverlay">
          <div className="recordDetailsBox">
            <h3>{selectedRecord.name}</h3>
            <p id="displaystatus">Status: {selectedRecord.status.join(", ")}</p>
            <div className="photosContainer">
              {selectedRecord.photos.map((photo, index) => (
                <img
                  key={index}
                  src={`https://policecrimeserver.onrender.com/${photo}`}
                  alt="Photo"
                  className={`photo ${index === 0 ? "mainPhoto" : "sidePhoto"}`}
                />
              ))}
            </div>
            <ul>
              {selectedRecord.crimes.map((crime, index) => (
                <li key={index}>
                  <p>Type: {crime.type}</p>
                  <p>Date: {new Date(crime.date).toLocaleDateString()}</p>
                  <p>Status: {crime.status}</p>
                </li>
              ))}
            </ul>
            <button
              id="updatebutton"
              onClick={() => handleUpdateClick(selectedRecord._id)}
            >
              Update
            </button>
            <button onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRecords;

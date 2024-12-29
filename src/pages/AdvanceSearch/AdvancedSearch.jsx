import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import "./AdvancedSearch.css";
import policelogo from "../../assets/policelogo.png";
import { Link } from "react-router-dom";
import Loader from "../../component/Loader/Loader"; // Import the Loader component

const AdvancedSearch = () => {
  const [crimeType, setCrimeType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { token } = useAuth();

  const handleSearch = async () => {
    setLoading(true); // Show loader
    setError(""); // Clear previous errors
    try {
      const response = await axios.get(
        "https://policecrimeserver.onrender.com/record/advanced-search",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            crimeType,
            startDate,
            endDate,
            status,
          },
        }
      );
      setRecords(response.data);
    } catch (err) {
      console.error("Error:", err.response || err.message);
      setError("No records found or an error occurred.");
      setRecords([]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="AdvancedSearch">
      {loading && <Loader />} {/* Show loader when loading */}
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <h2>Advanced Search for Records</h2>
      <div className="searchCriteria">
        <input
          type="text"
          value={crimeType}
          onChange={(e) => setCrimeType(e.target.value)}
          placeholder="Crime Type"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder="Status"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {records.length > 0 && (
        <div className="searchResults">
          <h3>Results</h3>
          <ul>
            {records.map((record) => (
              <li key={record._id} className="SearchrecordItem">
                <h4>{record.name}</h4>
                <p>Status: {record.status.join(", ")}</p>
                <ul>
                  {record.crimes.map((crime, index) => (
                    <li key={index}>
                      <p>Type: {crime.type}</p>
                      <p>Date: {new Date(crime.date).toLocaleDateString()}</p>
                      <p>Status: {crime.status}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

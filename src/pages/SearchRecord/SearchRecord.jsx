import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import Loader from "../../component/Loader/Loader"; // Import the loader component
import "./SearchRecord.css";
import policelogo from "../../assets/policelogo.png";
import { Link, useNavigate } from "react-router-dom";

const SearchRecord = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { token } = useAuth();

  const handleSearch = async () => {
    setLoading(true); // Show loader when search starts
    try {
      const response = await axios.get(
        `https://policecrimeserver.onrender.com/record/search`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { name },
        }
      );
      setRecords(response.data);
      setError("");
    } catch (err) {
      console.error("Error:", err.response || err.message);
      setError("No records found.");
      setRecords([]);
    } finally {
      setLoading(false); // Hide loader when search completes
    }
  };

  const advancesearch = () => {
    navigate("/advance-search");
  };

  return (
    <div className="SearchRecordComponent">
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <div className="toFind">
        <h2>Search for a Record</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={advancesearch}>Advance Search</button>

        {error && <p className="error">{error}</p>}
      </div>
      {loading ? (
        <Loader />
      ) : (
        records.length > 0 && (
          <div className="SearchRecordComponentresults">
            <h3>Results</h3>
            <ul>
              {records.map((record) => (
                <li key={record._id} className="record-card">
                  <h4>{record.name}</h4>
                  <p className="status">{record.status.join(", ")}</p>
                  <div className="photos">
                    {record.photos.length > 0 && (
                      <img
                        src={`https://policecrimeserver.onrender.com/${record.photos[0]}`}
                        alt="facecard"
                        width="200"
                      />
                    )}
                    <div className="Recordphoto-grid">
                      {record.photos.slice(1).map((photo, index) => (
                        <img
                          key={index}
                          src={`https://policecrimeserver.onrender.com/${photo}`}
                          alt="facecard"
                          width="200"
                          id="gridimages"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="Recordcrimes">
                    <ul>
                      {record.crimes.map((crime, index) => (
                        <li key={index}>
                          <p>Type: {crime.type}</p>
                          <p>
                            Date: {new Date(crime.date).toLocaleDateString()}
                          </p>
                          <p>Status: {crime.status}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default SearchRecord;

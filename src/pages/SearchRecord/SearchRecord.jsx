import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import Loader from "../../component/Loader/Loader";
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./SearchRecord.css";
import policelogo from "../../assets/policelogo.png";

const SearchRecord = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const { token, user } = useAuth();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://policecrimeserver.onrender.com/record/search`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: searchTerm },
        }
      );
      setRecords(response.data);
      setError("");
    } catch (err) {
      console.error("Search error:", err.response || err.message);
      setError("No matching records found");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecord = (id) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  const advanceSearch = () => {
    navigate("/advance-search");
  };

  const createNewRecord = () => {
    navigate("/create");
  };

  return (
    <div className="searchRecord-container">
      {/* Header Section */}
      <header className="searching-header">
        <Link to="/" className="logo-link">
          <img
            src={policelogo}
            alt="Police Department Logo"
            className="searching-logo"
          />
        </Link>
        <div className="header-controls">
          {user?.role === "admin" && (
            <button className="create-btn" onClick={createNewRecord}>
              + New Record
            </button>
          )}
        </div>
      </header>

      {/* Main Search Area */}
      <main className="searching-main">
        <div className="searching-panel">
          <h1 className="searching-title">
            <FaSearch className="title-icon" />
            Criminal Records Search
          </h1>

          <form onSubmit={handleSearch} className="searching-form">
            <div className="searching-input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter suspect name, alias or ID"
                required
                className="searching-input"
              />
              <button type="submit" className="searching-button">
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            <div className="searching-options">
              <button
                type="button"
                className="advanced-searching-btn"
                onClick={advanceSearch}
              >
                Advanced Search Options
              </button>
            </div>
          </form>

          {error && (
            <div className="error-message">
              <FaExclamationTriangle className="error-icon" />
              {error}
            </div>
          )}
        </div>

        {/* Search Results */}
        {records.length > 0 && (
          <div className="results-container">
            <h2 className="results-header">
              Search Results: {records.length}{" "}
              {records.length === 1 ? "Match" : "Matches"}
            </h2>

            <div className="records-grid">
              {records.map((record) => (
                <div key={record._id} className="record-card">
                  <div
                    className="record-summary"
                    onClick={() => toggleRecord(record._id)}
                  >
                    <div className="record-photo">
                      {record.photos.length > 0 ? (
                        <img
                          src={`https://policecrimeserver.onrender.com/${record.photos[0]}`}
                          alt={`${record.name} mugshot`}
                        />
                      ) : (
                        <div className="photo-placeholder">
                          <FaUser />
                        </div>
                      )}
                    </div>

                    <div className="record-info">
                      <h3 className="record-name">{record.name}</h3>
                      <div className="record-meta">
                        <span className="record-status">
                          {record.status.join(", ")}
                        </span>
                        <span className="record-crimes">
                          {record.crimes.length}{" "}
                          {record.crimes.length === 1 ? "offense" : "offenses"}
                        </span>
                      </div>
                    </div>

                    <div className="record-toggle">
                      {expandedRecord === record._id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </div>
                  </div>

                  {expandedRecord === record._id && (
                    <div className="record-details">
                      {/* Additional Photos */}
                      {record.photos.length > 1 && (
                        <div className="additional-photos">
                          <h4>Additional Images:</h4>
                          <div className="photo-grid">
                            {record.photos.slice(1).map((photo, index) => (
                              <img
                                key={index}
                                src={`https://policecrimeserver.onrender.com/${photo}`}
                                alt={`${record.name} additional ${index + 1}`}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Criminal History */}
                      <div className="criminal-history">
                        <h4>Criminal History:</h4>
                        <ul className="crimes-list">
                          {record.crimes.map((crime, index) => (
                            <li key={index} className="crime-item">
                              <div className="crime-type">
                                <FaExclamationTriangle className="crime-icon" />
                                <strong>{crime.type}</strong>
                              </div>
                              <div className="crime-details">
                                <span className="crime-date">
                                  <FaCalendarAlt className="detail-icon" />
                                  {new Date(crime.date).toLocaleDateString()}
                                </span>
                                <span
                                  className={`crime-status ${crime.status.toLowerCase()}`}
                                >
                                  {crime.status}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchRecord;

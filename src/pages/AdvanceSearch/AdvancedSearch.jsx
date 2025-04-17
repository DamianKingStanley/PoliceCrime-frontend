import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaGavel,
  FaInfoCircle,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import policelogo from "../../assets/policelogo.png";
import "./AdvancedSearch.css";

const AdvancedSearch = () => {
  const [searchParams, setSearchParams] = useState({
    crimeType: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const statusOptions = [
    "Wanted",
    "Arrested",
    "Charged",
    "Convicted",
    "Sentenced",
    "Incarcerated",
    "Paroled",
    "Released",
    "Fugitive",
    "Exonerated",
    "Deceased",
    "Under Investigation",
    "Probation",
    "Bail/Bond",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "https://policecrimeserver.onrender.com/record/advanced-search",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            crimeType: searchParams.crimeType,
            startDate: searchParams.startDate,
            endDate: searchParams.endDate,
            status: searchParams.status,
          },
        }
      );

      if (response.data.length === 0) {
        setError("No records match your search criteria");
      }
      setRecords(response.data);
    } catch (err) {
      console.error("Search error:", err.response || err.message);
      setError("Failed to complete search. Please try again.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchParams({
      crimeType: "",
      startDate: "",
      endDate: "",
      status: "",
    });
    setRecords([]);
    setError("");
  };

  return (
    <div className="advanced-search-container">
      {/* Header Section */}
      <header className="search-header">
        <Link to="/" className="logo-link">
          <img
            src={policelogo}
            alt="Police Department Logo"
            className="search-logo"
          />
        </Link>
        <h1 className="page-title">
          <FaFilter className="title-icon" />
          Advanced Records Search
        </h1>
      </header>

      {/* Main Content */}
      <main className="search-main">
        {/* Search Panel */}
        <section className="search-panel">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label htmlFor="crimeType" className="form-label">
                <FaGavel className="input-icon" />
                Crime Type
              </label>
              <input
                type="text"
                id="crimeType"
                name="crimeType"
                value={searchParams.crimeType}
                onChange={handleChange}
                placeholder="e.g. Burglary, Assault"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                <FaInfoCircle className="input-icon" />
                Legal Status
              </label>
              <select
                id="status"
                name="status"
                value={searchParams.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Any Status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="date-range-group">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">
                  <FaCalendarAlt className="input-icon" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={searchParams.startDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  <FaCalendarAlt className="input-icon" />
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={searchParams.endDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="search-button"
                disabled={loading}
              >
                <FaSearch className="button-icon" />
                {loading ? "Searching..." : "Search Records"}
              </button>

              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </form>
        </section>

        {/* Results Section */}
        <section className="results-section">
          {error && (
            <div className="error-message">
              <FaInfoCircle className="error-icon" />
              {error}
            </div>
          )}

          {records.length >= 0 && (
            <div className="results-container">
              <h2 className="results-header">
                Search Results: {records.length}{" "}
                {records.length === 1 ? "Match" : "Matches"}
              </h2>

              <div className="records-grid">
                {records.map((record) => (
                  <div key={record._id} className="record-card">
                    <div className="record-header">
                      <FaUser className="record-icon" />
                      <h3 className="record-name">{record.name}</h3>
                      <div className="record-status">
                        {record.status.join(", ")}
                      </div>
                    </div>

                    <div className="crimes-list">
                      <h4>Criminal Offenses:</h4>
                      <ul>
                        {record.crimes.map((crime, index) => (
                          <li key={index} className="crime-item">
                            <div className="crime-type">
                              <FaGavel className="crime-icon" />
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
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdvancedSearch;

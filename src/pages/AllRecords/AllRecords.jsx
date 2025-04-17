import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import {
  FaUser,
  FaSearch,
  FaGavel,
  FaCalendarAlt,
  FaTimes,
  FaEdit,
  FaIdBadge,
  FaInfoCircle,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCamera,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import policelogo from "../../assets/policelogo.png";
import "./AllRecords.css";

const AllRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
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
        setFilteredRecords(response.data);
        setError("");
      } catch (err) {
        console.error("Error:", err.response || err.message);
        setError("Failed to fetch criminal records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [token]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = records.filter(
      (record) =>
        record.name.toLowerCase().includes(term) ||
        record._id.toLowerCase().includes(term) ||
        record.status.some((s) => s.toLowerCase().includes(term)) ||
        record.crimes.some((c) => c.type.toLowerCase().includes(term))
    );
    setFilteredRecords(filtered);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const sortedRecords = React.useMemo(() => {
    if (!sortConfig.key) return filteredRecords;

    return [...filteredRecords].sort((a, b) => {
      // Handle nested crime sorting
      if (sortConfig.key === "crimeType") {
        const aType = a.crimes.length > 0 ? a.crimes[0].type : "";
        const bType = b.crimes.length > 0 ? b.crimes[0].type : "";
        if (aType < bType) return sortConfig.direction === "asc" ? -1 : 1;
        if (aType > bType) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }

      // Handle status array sorting
      if (sortConfig.key === "status") {
        const aStatus = a.status.join(", ");
        const bStatus = b.status.join(", ");
        if (aStatus < bStatus) return sortConfig.direction === "asc" ? -1 : 1;
        if (aStatus > bStatus) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }

      // Default sorting
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRecords, sortConfig]);

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
  };

  const handleUpdateClick = (recordId) => {
    navigate(`/update/${recordId}`);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading criminal records database...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <FaInfoCircle className="error-icon" />
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="records-container">
      {/* Header Section */}
      <header className="records-header">
        <Link to="/" className="logo-link">
          <img
            src={policelogo}
            alt="Police Department Logo"
            className="records-logo"
          />
        </Link>
        <h1 className="page-title">
          <FaIdBadge className="title-icon" />
          Criminal Records Database
        </h1>
      </header>

      {/* Main Content */}
      <main className="records-main">
        {/* Search Panel */}
        <div className="search-panel">
          <div className="search-input-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID, status, or crime type"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="records-count">
            {filteredRecords.length}{" "}
            {filteredRecords.length === 1 ? "Record" : "Records"} Found
          </div>
        </div>

        {/* Records Table */}
        <div className="records-table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("name")}>
                  <div className="table-header">
                    <FaUser className="header-icon" />
                    Name
                    <span className="sort-icon">{getSortIcon("name")}</span>
                  </div>
                </th>
                <th onClick={() => requestSort("status")}>
                  <div className="table-header">
                    <FaInfoCircle className="header-icon" />
                    Status
                    <span className="sort-icon">{getSortIcon("status")}</span>
                  </div>
                </th>
                <th onClick={() => requestSort("crimeType")}>
                  <div className="table-header">
                    <FaGavel className="header-icon" />
                    Primary Offense
                    <span className="sort-icon">
                      {getSortIcon("crimeType")}
                    </span>
                  </div>
                </th>
                <th>
                  <div className="table-header">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record) => (
                <tr
                  key={record._id}
                  className="record-row"
                  onClick={() => handleRecordClick(record)}
                >
                  <td>
                    <div className="record-name">{record.name}</div>
                  </td>
                  <td>
                    <div className="record-status">
                      {record.status.join(", ")}
                    </div>
                  </td>
                  <td>
                    <div className="record-crime">
                      {record.crimes.length > 0 ? record.crimes[0].type : "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="record-actions">
                      <button
                        className="view-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRecordClick(record);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedRecords.length === 0 && (
            <div className="no-results">
              <FaSearch className="no-results-icon" />
              <p>No criminal records match your search criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="record-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FaUser className="modal-icon" />
                {selectedRecord.name}
              </h2>
              <button className="close-button" onClick={handleCloseDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="record-section">
                <h3>
                  <FaInfoCircle className="section-icon" />
                  Legal Status
                </h3>
                <div className="status-badges">
                  {selectedRecord.status.map((status, index) => (
                    <span key={index} className="status-badge">
                      {status}
                    </span>
                  ))}
                </div>
              </div>

              <div className="record-section">
                <h3>
                  <FaCamera className="section-icon" />
                  Photos
                </h3>
                <div className="photo-gallery">
                  {selectedRecord.photos.map((photo, index) => (
                    <div key={index} className="photo-container">
                      <img
                        src={`https://policecrimeserver.onrender.com/${photo}`}
                        alt={`${selectedRecord.name} ${index + 1}`}
                        className={`record-photo ${
                          index === 0 ? "primary-photo" : ""
                        }`}
                      />
                      {index === 0 && (
                        <span className="photo-label">Primary Photo</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="record-section">
                <h3>
                  <FaGavel className="section-icon" />
                  Criminal History
                </h3>
                <div className="crimes-list">
                  {selectedRecord.crimes.map((crime, index) => (
                    <div key={index} className="crime-item">
                      <div className="crime-header">
                        <span className="crime-number">
                          Offense #{index + 1}
                        </span>
                        <span
                          className={`crime-status ${crime.status.toLowerCase()}`}
                        >
                          {crime.status}
                        </span>
                      </div>
                      <div className="crime-details">
                        <p>
                          <strong>Type:</strong> {crime.type}
                        </p>
                        <p>
                          <FaCalendarAlt className="detail-icon" />
                          {new Date(crime.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="update-button"
                onClick={() => handleUpdateClick(selectedRecord._id)}
              >
                <FaEdit className="button-icon" />
                Update Record
              </button>
              <button
                className="close-modal-button"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRecords;

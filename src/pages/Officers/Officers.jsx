import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import {
  FaUserShield,
  FaSearch,
  FaIdBadge,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import policelogo from "../../assets/policelogo.png";
import "./Officers.css";

const Officers = () => {
  const [officers, setOfficers] = useState([]);
  const [filteredOfficers, setFilteredOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const { token } = useAuth();

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await axios.get(
          "https://policecrimeserver.onrender.com/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOfficers(response.data);
        console.log(response.data);

        setFilteredOfficers(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to fetch officers data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, [token]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = officers.filter(
      (officer) =>
        officer.fullname?.toLowerCase().includes(term) ||
        officer.username?.toLowerCase().includes(term) ||
        officer._id?.toLowerCase().includes(term) ||
        officer.email?.toLowerCase().includes(term) ||
        officer.phone?.toLowerCase().includes(term)
    );
    setFilteredOfficers(filtered);
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

  const sortedOfficers = React.useMemo(() => {
    if (!sortConfig.key) return filteredOfficers;

    return [...filteredOfficers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredOfficers, sortConfig]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading officer data...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <FaShieldAlt className="error-icon" />
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
    <div className="officers-container">
      {/* Header Section */}
      <header className="officers-header">
        <Link to="/" className="logo-link">
          <img
            src={policelogo}
            alt="Police Department Logo"
            className="officers-logo"
          />
        </Link>
        <h1 className="page-title">
          <FaUserShield className="title-icon" />
          Officer Management
        </h1>
      </header>

      {/* Main Content */}
      <main className="officers-main">
        {/* Search Panel */}
        <div className="search-panel">
          <div className="search-input-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, badge, ID, email, or phone"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="officers-count">
            {filteredOfficers.length}{" "}
            {filteredOfficers.length === 1 ? "Officer" : "Officers"} Found
          </div>
        </div>

        {/* Officers Table */}
        <div className="officers-table-container">
          <table className="officers-table">
            <thead>
              <tr>
                <th onClick={() => requestSort("fullname")}>
                  <div className="table-header">
                    <FaUser className="header-icon" />
                    Name
                    <span className="sort-icon">{getSortIcon("fullname")}</span>
                  </div>
                </th>
                <th onClick={() => requestSort("username")}>
                  <div className="table-header">
                    <FaIdBadge className="header-icon" />
                    Badge Number
                    <span className="sort-icon">{getSortIcon("username")}</span>
                  </div>
                </th>
                <th onClick={() => requestSort("email")}>
                  <div className="table-header">
                    <FaEnvelope className="header-icon" />
                    Email
                    <span className="sort-icon">{getSortIcon("email")}</span>
                  </div>
                </th>
                <th onClick={() => requestSort("phone")}>
                  <div className="table-header">
                    <FaPhone className="header-icon" />
                    Phone
                    <span className="sort-icon">{getSortIcon("phone")}</span>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <FaShieldAlt className="header-icon" />
                    Officer ID
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOfficers.map((officer) => (
                <tr key={officer._id} className="officer-row">
                  <td>
                    <div className="officer-name">
                      {officer.fullname || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="officer-badge">
                      {officer.username || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="officer-email">
                      {officer.email || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="officer-phone">
                      {officer.phone || "N/A"}
                    </div>
                  </td>
                  <td>
                    <div className="officer-id">
                      {officer._id.substring(0, 8)}...
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedOfficers.length === 0 && (
            <div className="no-results">
              <FaSearch className="no-results-icon" />
              <p>No officers match your search criteria</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Officers;

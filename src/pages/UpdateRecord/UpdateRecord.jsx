import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import {
  FaUser,
  FaSave,
  FaArrowLeft,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import policelogo from "../../assets/policelogo.png";
import "./UpdateRecord.css";

const UpdateRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://policecrimeserver.onrender.com/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecord(response.data);
        setStatus(
          Array.isArray(response.data.status)
            ? response.data.status.join(", ")
            : response.data.status
        );
        setError("");
      } catch (err) {
        console.error("Error:", err.response || err.message);
        setError("Failed to fetch criminal record. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStatus(value);
    } else {
      setRecord({ ...record, [name]: value });
    }
  };

  const handleStatusToggle = (option) => {
    const currentStatus = status.split(", ").filter((s) => s.trim() !== "");
    if (currentStatus.includes(option)) {
      setStatus(currentStatus.filter((s) => s !== option).join(", "));
    } else {
      setStatus([...currentStatus, option].join(", "));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess(false);

    try {
      const updatedRecord = {
        ...record,
        status: status
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      };

      await axios.patch(
        `https://policecrimeserver.onrender.com/record/${id}`,
        updatedRecord,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setTimeout(() => navigate("/all-records"), 1500);
    } catch (err) {
      console.error("Error:", err.response || err.message);
      setError(
        "Failed to update record. Please verify your changes and try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading criminal record data...</p>
      </div>
    );

  if (!record)
    return (
      <div className="error-container">
        <FaExclamationTriangle className="error-icon" />
        <p className="error-message">Record not found in database</p>
        <button
          onClick={() => navigate("/all-records")}
          className="back-button"
        >
          <FaArrowLeft className="button-icon" />
          Back to Records
        </button>
      </div>
    );

  return (
    <div className="update-record-container">
      {/* Header Section */}
      <header className="update-header">
        <Link to="/" className="logo-link">
          <img
            src={policelogo}
            alt="Police Department Logo"
            className="update-logo"
          />
        </Link>
        <h1 className="page-title">
          <FaUser className="title-icon" />
          Update Criminal Record
        </h1>
      </header>

      {/* Main Content */}
      <main className="update-main">
        {/* Navigation */}
        <div className="navigation-controls">
          <button
            onClick={() => navigate("/all-records")}
            className="back-button"
          >
            <FaArrowLeft className="button-icon" />
            Back to Records
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="alert alert-error">
            <FaExclamationTriangle className="alert-icon" />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <FaCheck className="alert-icon" />
            Record updated successfully! Redirecting...
          </div>
        )}

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="update-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Suspect Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={record.name}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaShieldAlt className="label-icon" />
              Legal Status
            </label>
            <div className="status-selection">
              <input
                type="text"
                name="status"
                value={status}
                onChange={handleInputChange}
                placeholder="Enter statuses separated by commas"
                className="form-input"
              />
              <div className="status-options">
                <p className="options-title">Quick Select:</p>
                <div className="status-buttons">
                  {statusOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={`status-button ${
                        status.includes(option) ? "active" : ""
                      }`}
                      onClick={() => handleStatusToggle(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="update-button" disabled={updating}>
              {updating ? (
                <>
                  <FaSpinner className="spinner" />
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="button-icon" />
                  Update Record
                </>
              )}
            </button>
          </div>
        </form>

        {/* Record Preview */}
        <div className="record-preview">
          <h3 className="preview-title">
            <FaUser className="preview-icon" />
            Record Preview
          </h3>
          <div className="preview-content">
            <p>
              <strong>Name:</strong> {record.name}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {status
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "")
                .join(", ")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdateRecord;

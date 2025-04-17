import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import {
  FaUser,
  FaCamera,
  FaGavel,
  FaExclamationTriangle,
  FaCheck,
  FaPlus,
  FaTrash,
  FaUpload,
  FaSpinner,
} from "react-icons/fa";
import policelogo from "../../assets/policelogo.png";
import "./RecordForm.css";

const RecordForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: [],
    photos: [],
    crimes: [],
  });
  const [errorResponse, setErrorResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

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
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      status: checked
        ? [...prev.status, value]
        : prev.status.filter((s) => s !== value),
    }));
  };

  const handlePhotosChange = (e) => {
    setFormData((prev) => ({ ...prev, photos: Array.from(e.target.files) }));
  };

  const handleCrimeChange = (index, field, value) => {
    const newCrimes = [...formData.crimes];
    newCrimes[index][field] = value;
    setFormData((prev) => ({ ...prev, crimes: newCrimes }));
  };

  const addCrime = () => {
    setFormData((prev) => ({
      ...prev,
      crimes: [...prev.crimes, { type: "", date: "", status: "" }],
    }));
  };

  const removeCrime = (index) => {
    setFormData((prev) => ({
      ...prev,
      crimes: prev.crimes.filter((_, i) => i !== index),
    }));
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("status", JSON.stringify(formData.status));
      formDataToSend.append("crimes", JSON.stringify(formData.crimes));
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      await axios.post(
        "https://policecrimeserver.onrender.com/create-record",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/", { state: { success: "Record created successfully" } });
    } catch (error) {
      console.error("Error submitting record:", error);
      setErrorResponse(
        error.response?.data?.message ||
          "Error submitting record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="record-form-container">
      {/* Header Section */}
      <header className="form-header">
        <Link to="/" className="logo-link">
          <img
            src={policelogo}
            alt="Police Department Logo"
            className="form-logo"
          />
        </Link>
        <h1 className="form-title">New Criminal Record</h1>
      </header>

      {/* Main Form Content */}
      <main className="form-main">
        {errorResponse && (
          <div className="alert alert-error">
            <FaExclamationTriangle className="alert-icon" />
            {errorResponse}
          </div>
        )}

        <form onSubmit={handleSubmit} className="record-form">
          {/* Basic Information Section */}
          <section className="form-section">
            <h2 className="section-title">
              <FaUser className="section-icon" />
              Suspect Information
            </h2>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter suspect's full name"
              />
            </div>
          </section>

          {/* Status Section */}
          <section className="form-section">
            <h2 className="section-title">
              <FaCheck className="section-icon" />
              Legal Status
            </h2>

            <div className="status-grid">
              {statusOptions.map((option) => (
                <div key={option} className="status-option">
                  <input
                    type="checkbox"
                    id={`status-${option}`}
                    value={option}
                    checked={formData.status.includes(option)}
                    onChange={handleStatusChange}
                    className="status-checkbox"
                  />
                  <label htmlFor={`status-${option}`} className="status-label">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Crimes Section */}
          <section className="form-section">
            <h2 className="section-title">
              <FaGavel className="section-icon" />
              Criminal Offenses
            </h2>

            {formData.crimes.map((crime, index) => (
              <div key={index} className="crime-entry">
                <div className="crime-header">
                  <h3>Offense #{index + 1}</h3>
                  <button
                    type="button"
                    className="remove-crime-btn"
                    onClick={() => removeCrime(index)}
                    aria-label="Remove crime"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="crime-fields">
                  <div className="form-group">
                    <label
                      htmlFor={`crime-type-${index}`}
                      className="form-label"
                    >
                      Offense Type
                    </label>
                    <input
                      type="text"
                      id={`crime-type-${index}`}
                      value={crime.type}
                      onChange={(e) =>
                        handleCrimeChange(index, "type", e.target.value)
                      }
                      required
                      className="form-input"
                      placeholder="e.g. Burglary, Assault"
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor={`crime-date-${index}`}
                      className="form-label"
                    >
                      Date Committed
                    </label>
                    <input
                      type="date"
                      id={`crime-date-${index}`}
                      value={crime.date}
                      onChange={(e) =>
                        handleCrimeChange(index, "date", e.target.value)
                      }
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label
                      htmlFor={`crime-status-${index}`}
                      className="form-label"
                    >
                      Case Status
                    </label>
                    <input
                      type="text"
                      id={`crime-status-${index}`}
                      value={crime.status}
                      onChange={(e) =>
                        handleCrimeChange(index, "status", e.target.value)
                      }
                      required
                      className="form-input"
                      placeholder="e.g. Open, Closed, Pending"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button type="button" className="add-crime-btn" onClick={addCrime}>
              <FaPlus className="btn-icon" />
              Add Another Offense
            </button>
          </section>

          {/* Photos Section */}
          <section className="form-section">
            <h2 className="section-title">
              <FaCamera className="section-icon" />
              Suspect Photos
            </h2>

            <div className="photo-upload">
              <label htmlFor="photos" className="upload-label">
                <FaUpload className="upload-icon" />
                <span>Upload Photos (Minimum 4)</span>
                <input
                  type="file"
                  id="photos"
                  onChange={handlePhotosChange}
                  multiple
                  accept="image/*"
                  className="upload-input"
                />
              </label>

              <p className="upload-hint">
                Include front, side profile, and identifying marks
              </p>
            </div>

            {formData.photos.length > 0 && (
              <div className="photo-preview-grid">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="photo-preview-container">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Suspect ${index + 1}`}
                      className="photo-preview"
                    />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={() => removePhoto(index)}
                      aria-label="Remove photo"
                    >
                      <FaTrash />
                    </button>
                    {index === 0 && (
                      <span className="primary-photo-label">Primary</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || formData.photos.length < 4}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Processing...
                </>
              ) : (
                "Create Criminal Record"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RecordForm;

import React, { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaIdBadge,
  FaEnvelope,
  FaKey,
  FaUserTie,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";
import policelogo from "../../assets/policelogo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "officer",
    secretKey: "",
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setLoading(true);
    setRegisterMessage("");
    setPasswordMatch(true);

    try {
      const response = await fetch(
        "https://policecrimeserver.onrender.com/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: formData.fullname,
            username: formData.username,
            role: formData.role,
            email: formData.email,
            password: formData.password,
            secretKey:
              formData.role === "admin" ? formData.secretKey : undefined,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setRegisterMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error(responseData.message || "Registration failed");
      }
    } catch (error) {
      setRegisterMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        {/* Header Section */}
        <div className="registration-header">
          <Link to="/" className="logo-link">
            <img
              src={policelogo}
              alt="Police Department Logo"
              className="registration-logo"
            />
          </Link>
          <h1 className="system-title">Officer Registration</h1>
          <p className="system-subtitle">Law Enforcement Personnel Only</p>
        </div>

        {/* Status Messages */}
        {registerMessage && (
          <div
            className={`alert-message ${
              registerMessage.toLowerCase().includes("success")
                ? "success"
                : "error"
            }`}
          >
            <FaUserShield className="alert-icon" />
            <span>{registerMessage}</span>
          </div>
        )}

        {!passwordMatch && (
          <div className="alert-message error">
            <FaKey className="alert-icon" />
            <span>Passwords do not match. Please try again.</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="fullname" className="input-label">
              <FaUserTie className="input-icon" />
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="form-input"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="input-label">
              <FaIdBadge className="input-icon" />
              Badge Number
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your badge number"
              required
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="input-label">
              <FaEnvelope className="input-icon" />
              Official Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your department email"
              required
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">
              <FaKey className="input-icon" />
              Create Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="input-label">
              <FaKey className="input-icon" />
              Confirm Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                className="form-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="input-label">
              <FaUserShield className="input-icon" />
              Position
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="officer">Patrol Officer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {formData.role === "admin" && (
            <div className="form-group">
              <label htmlFor="secretKey" className="input-label">
                <FaKey className="input-icon" />
                Authorization Code
              </label>
              <input
                type="password"
                id="secretKey"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleChange}
                placeholder="Enter admin authorization code"
                required
                className="form-input"
              />
            </div>
          )}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? (
              <span className="button-spinner"></span>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="registration-footer">
          <p className="login-link">
            Already credentialed? <Link to="/login">Access your account</Link>
          </p>
          <p className="security-notice">
            <FaUserShield /> Restricted Law Enforcement Access Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

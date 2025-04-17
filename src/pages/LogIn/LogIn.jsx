import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserCog, FaIdBadge } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import "./LogIn.css";
import policelogo from "../../assets/policelogo.png";

const LogIn = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: "officer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://policecrimeserver.onrender.com/user/login",
        credentials
      );

      const { result, token } = response.data;

      if (!result || !token) {
        throw new Error("Authentication data missing in response");
      }

      login(result, token);
      navigate(credentials.role === "admin" ? "/create" : "/");
      
    } catch (error) {
      setError(
        error.response?.data?.message || 
        "Authentication failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <Link to="/" className="logo-link">
            <img src={policelogo} alt="Police Department Logo" className="login-logo" />
          </Link>
          <h1 className="system-title">Law Enforcement Portal</h1>
          <p className="system-subtitle">Secure Criminal Records Access</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <FaShieldAlt className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="input-label">
              <FaIdBadge className="input-icon" />
              Badge Number
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your badge number"
              required
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="input-label">
              <FaShieldAlt className="input-icon" />
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="form-input"
                autoComplete="current-password"
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
              <FaUserCog className="input-icon" />
              Access Level
            </label>
            <select
              id="role"
              name="role"
              value={credentials.role}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="officer">Patrol Officer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner"></span>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="login-footer">
          <p className="register-link">
            Need access? <Link to="/register">Request credentials</Link>
          </p>
          <p className="security-notice">
            <FaShieldAlt /> Secure Law Enforcement System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
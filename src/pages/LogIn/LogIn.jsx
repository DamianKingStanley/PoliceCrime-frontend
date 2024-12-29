import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import "./LogIn.css";
import policelogo from "../../assets/policelogo.png";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("officer");
  const [error, setError] = useState(""); // For error messages
  const [loading, setLoading] = useState(false); // For loading state
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        username,
        password,
        role,
      });

      const { result, token } = response.data;

      if (!result || !token) {
        throw new Error("Missing user data or token in response");
      }

      login(result, token);

      if (role === "admin") {
        navigate("/create");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="LoginBody">
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loader"></div>}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Badge Number"
          required
        />
        <div className="pswd-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span
            className="pswd-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="admin">Admin</option>
            <option value="officer">Officer</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          Log In
        </button>
      </form>
      <div className="toRegister">
        <p>
          Or click <Link to="/register">here</Link> to register
        </p>
      </div>
    </div>
  );
};

export default LogIn;

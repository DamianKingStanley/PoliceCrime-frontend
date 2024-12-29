import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";
import BackButton from "../../component/Backbutton/Backbutton";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://mental.inkypen.com.ng/reset", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(
          "Password has been reset successfully. You can now log in with your new password."
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(
        "An error occurred while resetting the password. Please try again."
      );
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          New Password: <br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Confirm New Password: <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>{" "}
        <br />
        <button type="submit">Reset Password</button>
      </form>

      <BackButton />
    </div>
  );
};

export default ResetPassword;

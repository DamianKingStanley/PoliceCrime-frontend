import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import BackButton from "../../component/Backbutton/Backbutton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://mental.inkypen.com.ng/forgot-password",
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <section className="forgetPassword">
        <p>{message}</p>
        <h2>Forgot Password?</h2>
        <p>Input your email:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="retemail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />{" "}
          <br /> <br />
          <button id="retemailbtn" type="submit">
            Submit
          </button>
        </form>
        <BackButton />
      </section>
    </div>
  );
};

export default ForgotPassword;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import Loader from "../../component/Loader/Loader"; // Import the loader component
import "./UpdateRecord.css";
import policelogo from "../../assets/policelogo.png";

const UpdateRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true); // Set loading true when fetching data
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
        setError("Failed to fetch record.");
      } finally {
        setLoading(false); // Set loading false after fetching data
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedRecord = {
        ...record,
        status: status.split(", ").map((s) => s.trim()),
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
      navigate("/all-records");
    } catch (err) {
      console.error("Error:", err.response || err.message);
      setError("Failed to update record.");
    }
  };

  if (loading) return <Loader />; // Show loader while data is being fetched

  if (!record) return <div>Record not found.</div>;

  return (
    <div className="UpdateRecordBody">
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <h2>Update Record</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleUpdate}>
        <label>
          Name: <br />
          <input
            type="text"
            name="name"
            value={record.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Status: <br />
          <input
            type="text"
            name="status"
            value={status}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateRecord;

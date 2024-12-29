import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import policelogo from "../../assets/policelogo.png";
import "./RecordForm.css";

const RecordForm = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [errorResponse, setErrorResponse] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      setErrorResponse("User information is missing. Please log in.");
    }
  }, [user, token]);

  const handleStatusChange = (e) => {
    const { value, checked } = e.target;
    setStatus((prevStatus) =>
      checked ? [...prevStatus, value] : prevStatus.filter((s) => s !== value)
    );
  };

  const handlePhotosChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleCrimeChange = (index, field, value) => {
    const newCrimes = [...crimes];
    newCrimes[index][field] = value;
    setCrimes(newCrimes);
  };

  const addCrime = () => {
    setCrimes([...crimes, { type: "", date: "", status: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", JSON.stringify(status));
    formData.append("crimes", JSON.stringify(crimes));
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      await axios.post(
        "http://localhost:5000/create-record",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Error submitting record:", error);
      setErrorResponse("Error submitting record.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="CreateRecordBody">
      {loading && <div className="loader"></div>}
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <section className="CreateRecord">
        <div className="recordFormDiv">
          {errorResponse && <p className="form_response">{errorResponse}</p>}
          <h1>CRIMINAL RECORD INFORMATION</h1>
          <label>
            <h3>Name</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br /> <br />
          <label>
            <h3>Status</h3>
            <div>
              {statusOptions.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    id="recordcheckbox"
                    value={option}
                    checked={status.includes(option)}
                    onChange={handleStatusChange}
                  />
                  {option}
                </label>
              ))}
            </div>
          </label>
          <br /> <br />
          <h3>Crimes</h3>
          <button id="addCrimeBtn" type="button" onClick={addCrime}>
            Add Crime
          </button>
          {crimes.map((crime, index) => (
            <div key={index}>
              <label>
                <h4>Crime Type</h4>
                <input
                  type="text"
                  id="crimeid"
                  value={crime.type}
                  onChange={(e) =>
                    handleCrimeChange(index, "type", e.target.value)
                  }
                  required
                />
              </label>{" "}
              <label>
                <h4>Crime Date</h4>
                <input
                  type="date"
                  value={crime.date}
                  onChange={(e) =>
                    handleCrimeChange(index, "date", e.target.value)
                  }
                  required
                />{" "}
              </label>
              <label>
                <h4>Crime Status</h4>
                <input
                  type="text"
                  value={crime.status}
                  onChange={(e) =>
                    handleCrimeChange(index, "status", e.target.value)
                  }
                  required
                />
              </label>
            </div>
          ))}
          <br /> <br />
          <button id="createRecordBtn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="criminalPhotoDiv">
          <label>
            <h3> Four (4) Photos</h3>
            <input type="file" multiple onChange={handlePhotosChange} />
          </label>
          <div className="photos-preview">
            {photos.map((photo, index) => (
              <img
                key={index}
                src={URL.createObjectURL(photo)}
                alt={`Preview ${index + 1}`}
                className={`photo-preview ${index === 0 ? "main-photo" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecordForm;

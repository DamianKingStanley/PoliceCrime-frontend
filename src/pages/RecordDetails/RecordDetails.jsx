import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const RecordDetail = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    axios
      .get(`https://policecrimeserver.onrender.com/records/${id}`)
      .then((response) => setRecord(response.data))
      .catch((error) => console.error("Error fetching record:", error));
  }, [id]);

  if (!record) return <div>Loading...</div>;

  return (
    <div>
      <h1>{record.name}</h1>
      <p>Status: {record.status}</p>
      {record.photo && <img src={record.photo} alt={record.name} />}
      <h2>Crimes:</h2>
      <ul>
        {record.crimes.map((crime) => (
          <li key={crime._id}>
            {crime.type} on {crime.date} - {crime.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordDetail;

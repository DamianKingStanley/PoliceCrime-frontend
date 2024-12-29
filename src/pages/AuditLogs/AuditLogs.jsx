import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "https://policecrimeserver.onrender.com/get-activities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActivities(response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>System Activities</h2>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Record ID</th>
            <th>User</th>
            <th>Changes</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity._id}>
              <td>{activity.action}</td>
              <td>{activity.recordId ? activity.recordId._id : "N/A"}</td>
              <td>{activity.userId ? activity.userId.fullname : "N/A"}</td>
              <td>
                {activity.changes ? JSON.stringify(activity.changes) : "N/A"}
              </td>
              <td>{new Date(activity.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;

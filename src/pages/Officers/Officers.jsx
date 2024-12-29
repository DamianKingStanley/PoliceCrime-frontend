// Officers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/AuthContext";
import "./Officers.css"; // Import the CSS file
import policelogo from "../../assets/policelogo.png";
import { Link } from "react-router-dom";

const Officers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://policecrimeserver.onrender.com/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialize filteredUsers with all users
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.fullname.toLowerCase().includes(term) ||
            user.username.toLowerCase().includes(term) ||
            user._id.toLowerCase().includes(term)
        )
      );
    }
  };

  if (loading) return <p className="users-list-message">Loading...</p>;
  if (error) return <p className="users-list-message">{error}</p>;

  return (
    <div className="users-list-container">
      <div className="NPFlogodiv">
        <Link to="/">
          <img src={policelogo} alt="logo" />
        </Link>
      </div>
      <h2>List of Active Officers</h2>
      <input
        type="text"
        placeholder="Search by ID, Name, or Badge number"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="users-list-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.userId}>
              <td>{user._id}</td>
              <td>{user.fullname}</td>
              <td>{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Officers;

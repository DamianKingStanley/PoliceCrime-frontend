import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import policelogo from "../../assets/policelogo.png";
import "./Home.css";
import { useAuth } from "../../component/AuthContext";
import Logout from "../../component/Logout/Logout";

const Home = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [showDialog, setShowDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleEnterClick = () => {
    if (!user || !token) {
      navigate("/login");
    } else {
      if (user.role === "officer") {
        navigate("/search");
      } else if (user.role === "admin") {
        setShowDialog(true);
      }
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleCreateClick = () => {
    navigate("/create");
  };
  const handleCheckActivities = () => {
    navigate("/officers");
  };
  const handleAllClick = () => {
    navigate("/all-records");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="HomeBody">
      <h1>Crime and Criminal Check System!</h1>
      <section className="HomeSection">
        <div>
          <img id="logoimage" src={policelogo} alt="logo" />
        </div>
        <div>
          <button id="enterBtn" onClick={handleEnterClick}>
            Enter
          </button>
        </div>
        <div>
          <Logout />
        </div>
      </section>

      {user?.role === "admin" && (
        <>
          <button className="floatingButton" onClick={toggleSidebar}>
            ☰
          </button>
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h2>Admin Options</h2>
            <button onClick={handleCheckActivities}>Active Officers</button>
            <button onClick={handleAllClick}>View All Records</button>
            <button id="sideClose" onClick={toggleSidebar}>
              Close
            </button>
          </div>
        </>
      )}

      {showDialog && (
        <div className="dialogOverlay">
          <div className="dialogBox">
            <h2>Admin Options</h2>
            <button id="dialogBtn" onClick={handleSearchClick}>
              Go to Search
            </button>
            <button id="dialogBtn" onClick={handleCreateClick}>
              Go to Create
            </button>
            <button id="dialogBtnCancel" onClick={handleDialogClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

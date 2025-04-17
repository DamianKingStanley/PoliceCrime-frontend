import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import policelogo from "../../assets/policelogo.png";
import "./Home.css";
import { useAuth } from "../../component/AuthContext";
import Logout from "../../component/Logout/Logout";

const Home = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (path) => {
    if (!user || !token) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`home-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Header Section */}
      <header className="app-header">
        <div className="logo-container">
          <img src={policelogo} alt="Police Department Logo" className="logo" />
          <h1 className="app-title">Police Crime Intelligence System</h1>
        </div>
        <div className="auth-controls">
          {user && (
            <div className="user-info">
              <span className="user-role">{user.role.toUpperCase()}</span>
              <span className="user-name">{user.fullname || user.email}</span>
            </div>
          )}
          <Logout />
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <div className="hero-text">
            <h2>Law Enforcement Data Management</h2>
            <p>Access, analyze, and manage criminal records efficiently</p>
          </div>

          <div className="action-buttons">
            <button
              className="primary-btn"
              onClick={() => handleNavigation("/search")}
            >
              Search Records
            </button>

            {user?.role === "admin" && (
              <button
                className="secondary-btn"
                onClick={() => handleNavigation("/create")}
              >
                Create New Record
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Section */}
        {user && (
          <div className="stats-section">
            <div className="stat-card">
              <h3>Recent Cases</h3>
              <p>24</p>
              <small>Last 7 days</small>
            </div>
            <div className="stat-card">
              <h3>Active Officers</h3>
              <p>42</p>
              <small>On duty</small>
            </div>
            <div className="stat-card">
              <h3>Solved Cases</h3>
              <p>78%</p>
              <small>This month</small>
            </div>
          </div>
        )}
      </main>

      {/* Admin Sidebar */}
      {user?.role === "admin" && (
        <>
          <button
            className={`sidebar-toggle ${sidebarOpen ? "open" : ""}`}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? "✕" : "☰ Admin Menu"}
          </button>

          <aside className="admin-sidebar">
            <h2 className="sidebar-title">Administration</h2>
            <nav className="sidebar-nav">
              <button
                className="sidebar-btn"
                onClick={() => handleNavigation("/officers")}
              >
                👮 Officer Activity
              </button>
              <button
                className="sidebar-btn"
                onClick={() => handleNavigation("/all-records")}
              >
                🗃️ All Records
              </button>
              <button
                className="sidebar-btn"
                onClick={() => handleNavigation("/analytics")}
              >
                📊 Crime Analytics
              </button>
              <button
                className="sidebar-btn"
                onClick={() => handleNavigation("/settings")}
              >
                ⚙️ System Settings
              </button>
            </nav>
          </aside>
        </>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Police Crime Intelligence System</p>
        <p className="security-notice">Secure Law Enforcement Access Only</p>
      </footer>
    </div>
  );
};

export default Home;

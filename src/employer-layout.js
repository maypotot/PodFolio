import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { restoreSession } from "./solid.js";
import "./employer-side.css";

function EmployerLayout({ children }) {
  const [employerData, setEmployerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const solidUser = await restoreSession();
        setUser(solidUser);

        const webid = sessionStorage.getItem("employer_webid");
        console.log("Employer WebID from session:", webid);
        
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];
          const employerRes = await fetch(
            `http://127.0.0.1:8000/api/employers/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          
          if (employerRes.ok) {
            const data = await employerRes.json();
            setEmployerData(data);
          } else {
            const errorData = await employerRes.json();
            console.error("Failed to fetch employer data:", employerRes.status, errorData);
          }
        } else {
          console.log("No employer WebID found in sessionStorage");
        }
      } catch (error) {
        console.error("Failed to fetch employer data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("employer_webid");
      navigate("/employer-home");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/employer-home");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/employer-student-search?q=${encodeURIComponent(q)}`);
    }
  };

  const displayName = employerData
    ? employerData.company_name
    : (user?.name || "Company Name");

  return (
    <main className="homefeed">
      <header className="app-header">
        <div className="header-section">
          <Link to="/employer-homefeed">
            <img src="/logo-green-01.png" alt="App Logo" className="header-logo" />
          </Link>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search students by skill or interest..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        <div className="header-section">
          <img src="/user-image.png" alt="User Avatar" className="avatar-icon"/>
          <Link to="/in-perms">
            <button className="employer-header-buttons">
              <img src="/notifications-icon.png" alt="Notifications" className="button-icons"/>
            </button>
          </Link>
          <button className="employer-header-buttons">
            <img src="/settings-icon.png" alt="Settings" className="button-icons"/>
          </button>
        </div>
      </header>

      <div className="content">
        <div className="left-panel">
          <div className="left-panel-section">
            <img src="/user-image.png" alt="User" className="user-icon"/>
            <div className="user-name">{loading ? "Loading..." : displayName}</div>
          </div>
          <div className="left-panel-section">
            <h3>Explore panel</h3>
            <Link className="panel-options" to="/employer-profile">
              <button className="employer-panel-buttons">
                <img src="/user.png" alt="user" className="button-icons-black"/> 
              </button>
              Profile
            </Link><br/>
            <Link className="panel-options" to="/employer-homefeed">
              <button className="employer-panel-buttons">
                <img src="/data-analytics.png" alt="analytics" className="button-icons-black"/> 
              </button>
              User analytics
            </Link><br/>
            <h3>Settings</h3>
            <Link className="panel-options" to="/employer-homefeed">
              <button className="employer-panel-buttons">
                <img src="/settings-icon.png" alt="settings" className="button-icons"/> 
              </button>
              Settings
            </Link><br/>
            <Link className="panel-options" to="/employer-homefeed">
              <button className="employer-panel-buttons">
                <img src="/secure.png" alt="security" className="button-icons-black"/> 
              </button>
              Security data
            </Link><br/>
            <button className="log-out-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}

export default EmployerLayout;
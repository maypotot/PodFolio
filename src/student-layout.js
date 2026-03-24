import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import { restoreSession } from "./solid.js";
import API_BASE_URL from "./config/api.js";

function StudentLayout({ children, searchQuery, setSearchQuery, handleSearch, clearSearch }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const solidUser = await restoreSession();
        setUser(solidUser);

        const webid = sessionStorage.getItem("webid");
        console.log("WebID from session:", webid);
        
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];
          const studentRes = await fetch(
            `${API_BASE_URL}/api/students/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          
          if (studentRes.ok) {
            const data = await studentRes.json();
            setStudentData(data);
          } else {
            console.error("Failed to fetch student data:", studentRes.status);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayName = studentData 
    ? `${studentData.first_name} ${studentData.last_name}`
    : (user?.name || "User Name");

  // Use uploaded profile picture or fallback to default
  const profilePicture = studentData?.profile_picture || "/user-image.png";

  return (
    <main className="homefeed">
      <header className="app-header">
        <div className="header-section">
          <Link to="/homefeed">
            <img src="/logo.png" alt="App Logo" className="header-logo" />
          </Link>

          {/* Search bar — wired to HomeFeed state if props provided */}
          {setSearchQuery ? (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by skill or interest..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button type="submit" className="student-search-button">
                Search
              </button>
            </form>
          ) : (
            // Fallback non-functional search bar for pages that don't pass props
            <input
              type="text"
              placeholder="Search by skill or interest..."
              className="search-input"
            />
          )}
        </div>

        <div className="header-section">
          <img src={profilePicture} alt="User Avatar" className="avatar-icon"/>
          <Link to="/in-perms">
            <button className="student-header-buttons">
              <img src="/notifications-icon.png" alt="Notifications" className="button-icons"/>
            </button>
          </Link>
        </div>
      </header>
      
      <div className="content">
        <div className="left-panel">
          <div className="left-panel-section">
            <img src={profilePicture} alt="User" className="user-icon"/>
            <div className="user-name">{loading ? "Loading..." : displayName}</div>
          </div>
          <div className="left-panel-section">
            <h3 className="student-h3">Explore panel</h3>
            <Link className="panel-options" to="/profile">
              <button className="panel-buttons">
                <img src="/user.png" alt="user" className="button-icons-black"/> 
              </button>
              Profile
            </Link><br/>
            <Link className="panel-options" to="/homefeed">
              <button className="panel-buttons">
                <img src="/data-analytics.png" alt="analytics" className="button-icons-black"/> 
              </button>
              User analytics
            </Link><br/>
            <h3 className="student-h3">Settings</h3>
            <Link className="panel-options" to="/homefeed">
              <button className="panel-buttons">
                <img src="/settings-icon.png" alt="settings" className="button-icons"/> 
              </button>
              Settings
            </Link><br/>
            <Link className="panel-options" to="/homefeed">
              <button className="panel-buttons">
                <img src="/secure.png" alt="security" className="button-icons-black"/> 
              </button>
              Security data
            </Link><br/>
            <Link to="/">
              <button className="student-log-out-button">Log Out</button>
            </Link>
          </div>
        </div>
        
        {children}
      </div>
    </main>
  );
}

export default StudentLayout;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import { restoreSession } from "./solid.js";

function StudentLayout({ children }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Restore Solid session
        const solidUser = await restoreSession();
        setUser(solidUser);

        // Fetch student account data
        const webid = sessionStorage.getItem("webid");
        console.log("WebID from session:", webid);
        
        if (webid) {
          // Strip fragment before querying
          const webidWithoutFragment = webid.split('#')[0];
          const studentRes = await fetch(
            `http://127.0.0.1:8000/api/students/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          
          console.log("Student API response status:", studentRes.status);
          
          if (studentRes.ok) {
            const data = await studentRes.json();
            console.log("Student data received:", data);
            setStudentData(data);
          } else {
            const errorData = await studentRes.json();
            console.error("Failed to fetch student data:", studentRes.status, errorData);
          }
        } else {
          console.log("No WebID found in sessionStorage");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Get display name from database or fallback
  const displayName = studentData 
    ? `${studentData.first_name} ${studentData.last_name}`
    : (user?.name || "User Name");

  return (
    <main className="homefeed">
      <header className="app-header">
        <div className="header-section">
          <Link to="/homefeed">
            <img src="/logo.png" alt="App Logo" className="header-logo" />
          </Link>
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-input"
          />
          <button className="student-search-button">
            Search
          </button>
        </div>
        <div className="header-section">
          <img src="/Spongebob.webp" alt="User Avatar" className="avatar-icon"/>
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
            <img src="/Spongebob.webp" alt="User" className="user-icon"/>
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
        
        {/* Render children (the page content) */}
        {children}
      </div>
    </main>
  );
}

export default StudentLayout;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";

function InPerms() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        // Fetch all requests
        const res = await fetch("http://127.0.0.1:8000/api/requests/all/"); // new endpoint for all requests
        const data = await res.json();
        console.log("Fetched requests:", data);

        setRequests(data);
        
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
      }
    }

    fetchRequests();
  }, []);

  return (
    <main className="view-resume">
      {/* Header */}
      <header className="app-header">
        <div className="header-section">
          <Link to="/homefeed">
            <img src="/logo.png" alt="App Logo" className="header-logo" />
          </Link>
          <input type="text" placeholder="Search jobs..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
        <div className="header-section">
          <img src="/Spongebob.webp" alt="User Avatar" className="avatar-icon" />
          <button className="header-buttons">
            <img src="/notifications-icon.png" alt="Notifications" className="button-icons" />
          </button>
          <button className="header-buttons">
            <img src="/settings-icon.png" alt="Settings" className="button-icons" />
          </button>
        </div>
      </header>

      <div className="content">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="left-panel-section">
            <img src="/Spongebob.webp" alt="User" className="user-icon"/>
            <div className="user-name">Student User</div>
          </div>
          <div className="left-panel-section">
            <h3>Explore panel</h3>
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
            <h3>Settings</h3>
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
              <button className="log-out-button">Log Out</button>
            </Link>
          </div>
        </div>

        {/* Main Feed */}
        <div className="resume">
          <h1>All Employer Requests</h1>
          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <ul>
              {requests.map((req) => (
                <li key={req.id} className="incoming-perms">
                  <div className="job-info">
                    <h4>Request from: {req.employer_webid}</h4>
                    <p>Intended for: {req.applicant_webid}</p>
                    <p>Summary: {req.summary}</p>
                    <p>Job Application ID: {req.job_application?.id || "N/A"}</p>
                    <Link to = {"/config-perms"}>Configure Permissions</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

export default InPerms;

import React from "react";
import { Link } from "react-router-dom";
import "./main.css";

function InPerms() {
  return (
    <main className="view-resume">
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
        <div className="resume">
            <h1>Incoming Permissions</h1>
           <div className="incoming-perms">
             <img src="/Figma.png" alt="Figma logo" className="company-image"/>

             <div className="job-info">
               <h4>Figma is requesting for:</h4>
               <h2>Experience</h2>
               <Link to="/config-perms"><button className="config-button">Configure Permissions</button></Link>

             </div>

            </div>
          
        </div>
      </div>
    </main>
  );
}

export default InPerms;

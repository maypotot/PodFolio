import React from "react";
import { Link } from "react-router-dom";
import "./main.css"; 

function HomeFeed() {
  return (
    <main className= "homefeed">
      <header className = "app-header">
        <div className="header-section">
            <Link to="/homefeed">
              <img src="/logo.png" alt="App Logo" className="header-logo" />
            </Link>
          <input
              type="text"
              placeholder="Search jobs..."
              className = "search-input"
            />
          <button className="search-button">
              Search
          </button>
        </div>
        <div className="header-section">
            <img src="/Spongebob.webp" alt="User Avatar" className="avatar-icon"/>
            <Link to="/in-perms">
                                <button className="header-buttons">
                                    <img src="/notifications-icon.png" alt="Notifications" className="button-icons"/>
                                </button>
                              </Link>
            <button className="header-buttons">
                <img src="/settings-icon.png" alt="Settings" className="button-icons"/>
            </button>
        </div>
      </header>
      <div className="content">
        <div className="left-panel">
          <div className="left-panel-section">
            <img src="/Spongebob.webp" alt="User" className="user-icon"/>
            <div className="user-name">Spongebob Squarepants</div>
          </div>
          <div className="left-panel-section">
            <h3>Explore panel</h3>
            <Link className= "panel-options" to="/profile">
                <button className="panel-buttons">
                  <img src="/user.png" alt="user" className="button-icons-black"/> 
                </button>
                Profile
            </Link><br/>
            <Link className= "panel-options" to="/homefeed">
                <button className="panel-buttons">
                  <img src="/data-analytics.png" alt="analytics" className="button-icons-black"/> 
                </button>
                User analytics
            </Link><br/>
            <h3>Settings</h3>
            <Link className= "panel-options" to="/homefeed">
                <button className="panel-buttons">
                  <img src="/settings-icon.png" alt="settings" className="button-icons"/> 
                </button>
                Settings
            </Link><br/>
            <Link className= "panel-options" to="/homefeed">
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
        <div className="main-feed">
            <h1>Job Listings</h1>

            <div className="job-listing">
              <img src="/Figma.png" alt="Figma logo" className="company-image"/>

              <div className="job-info">
                <h2>Software Engineer</h2>
                <h4>Figma</h4>
                <p className="job-description">Build core features for Figma’s collaborative design platform and help deliver fast, reliable, user-focused experiences across the web.</p>
                <Link to="#" className="apply-link">Apply Now</Link>

              </div>

            </div>
        </div>
    
      </div>
    </main>
  );
}

export default HomeFeed;


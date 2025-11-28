import React from "react";
import { Link } from "react-router-dom";
import "./main.css"; 

function Profile() {
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
            <Link className= "panel-options" to="/homefeed">
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
            <div className="profile-details">
                <h1>Profile</h1>
                <img src="/Spongebob.webp" alt="User Avatar" className="profile-picture"/>
                <h5>Spongebob Squarepants</h5>
                <p>BS Computer Science at University of the Philippines Diliman</p>
            </div>
            <div className="tags-section">
                <div className="tag-group">
                    <div className="tag-header">
                        <h3 className="tag-title">Resumes</h3>
                        <Link to="/create-resume">
                        <button className="add-tag-button">+ Add Resume</button>
                        </Link>
                    </div>
                    <div className="tag-list">
                        <p className="tag-item">Web Development.<img src="/pencil.png" alt="edit" className="edit-icon"></img></p>
                    </div>

                </div>
            </div>
        </div>
    
      </div>
    </main>
  );
}

export default Profile;


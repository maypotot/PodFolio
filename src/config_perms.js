import React from "react";
import { Link } from "react-router-dom";
import "./main.css";

function ConfigPerms() {
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
          <Link to="/in-perms">
                              <button className="header-buttons">
                                  <img src="/notifications-icon.png" alt="Notifications" className="button-icons"/>
                              </button>
                            </Link>
          <button className="header-buttons">
            <img src="/settings-icon.png" alt="Settings" className="button-icons" />
          </button>
        </div>
      </header>

      <div className="content">
        <div className="resume">
           
          <div className="tag-header">
            <h1>Configure Permissions for "New Resume"</h1>
          </div>
             <div className="config">
          {/* Category */}
          <div className="resume-section">
            <div className="tag-header">
                <h2>Personal Information</h2>
                <button className="allow-all">Allow All</button>
            </div>

            <div className="field-row">
              <span>Name</span>
              <div className="field-buttons">
                <button className="allow-btn">Allow</button>
                <button className="deny-btn">Deny</button>
              </div>
            </div>

            <div className="field-row">
              <span>Email</span>
              <div className="field-buttons">
                <button className="allow-btn">Allow</button>
                <button className="deny-btn">Deny</button>
              </div>
            </div>

            <div className="field-row">
              <span>Contact Number</span>
              <div className="field-buttons">
                <button className="allow-btn">Allow</button>
                <button className="deny-btn">Deny</button>
              </div>
            </div>
          </div>
          {/* Education */}
          <div className="resume-section">
            <div className="category-header">
                <div className="tag-header">
                    <h2>Education</h2>
                    <button className="allow-all">Allow All</button>
                </div>
            </div>
            <div className="field-row"><span>Degree</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
            <div className="field-row"><span>Institution</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
            <div className="field-row"><span>Honors / Awards</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
          </div>

          {/* Skills */}
          <div className="resume-section">
            <div className="category-header">
                <div className="tag-header">
                <h2>Skills</h2>
                <button className="allow-all">Allow All</button>
              </div>
            </div>
            <div className="field-row"><span>Skills List</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
          </div>

          {/* Projects */}
          <div className="resume-section">
            <div className="category-header">
              <div className="tag-header">
                <h2>Projects</h2>
                <button className="allow-all">Allow All</button>
                </div>
            </div>
            <div className="field-row"><span>Project 1</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
            <div className="field-row"><span>Project 2</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
          </div>

          {/* Experience */}
          <div className="resume-section">
            <div className="category-header">
                <div className="tag-header">
                    <h2>Experience</h2>
                    <button className="allow-all">Allow All</button>
              </div>
            </div>
            <div className="field-row"><span>Job 1</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
            <div className="field-row"><span>Job 2</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
            <div className="field-row"><span>Job 3</span><div className="field-buttons"><button className="allow-btn">Allow</button><button className="deny-btn">Deny</button></div></div>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}

export default ConfigPerms;

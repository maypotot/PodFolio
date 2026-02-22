import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./employer-side.css";
import EmployerLayout from "./employer-layout";

function EmployerViewResume() {
  const location = useLocation();
  const { resumeUrl, studentName } = location.state || {};

  return (
      <div className="main-feed">
        <div className="resume">
          <div className="tag-header">
            <h1 className="employer-h1">Resume Preview</h1>
            <Link to="/employer-homefeed">
              <button className="employer-button">Back to Applications</button>
            </Link>
          </div>

          <div className="resume-placeholder">
            <h2>{studentName || "Student"}'s Resume</h2>
            <p className="placeholder-text">
              This is a placeholder for the resume viewer. The actual resume will be loaded from the Solid Pod.
            </p>
            
            {resumeUrl && (
              <div className="resume-url-info">
                <p><strong>Resume URL:</strong></p>
                <code className="url-display">{resumeUrl}</code>
              </div>
            )}

            <div className="placeholder-sections">
              <div className="placeholder-section">
                <h3>Personal Information</h3>
                <p className="placeholder-item">Name: [To be loaded from Pod]</p>
                <p className="placeholder-item">Email: [To be loaded from Pod]</p>
                <p className="placeholder-item">Phone: [To be loaded from Pod]</p>
                <p className="placeholder-item">Location: [To be loaded from Pod]</p>
              </div>

              <div className="placeholder-section">
                <h3>Education</h3>
                <p className="placeholder-item">Degree: [To be loaded from Pod]</p>
                <p className="placeholder-item">Institution: [To be loaded from Pod]</p>
                <p className="placeholder-item">Graduation Date: [To be loaded from Pod]</p>
              </div>

              <div className="placeholder-section">
                <h3>Skills</h3>
                <p className="placeholder-item">• [To be loaded from Pod]</p>
                <p className="placeholder-item">• [To be loaded from Pod]</p>
                <p className="placeholder-item">• [To be loaded from Pod]</p>
              </div>

              <div className="placeholder-section">
                <h3>Experience</h3>
                <p className="placeholder-item">Job Title: [To be loaded from Pod]</p>
                <p className="placeholder-item">Company: [To be loaded from Pod]</p>
                <p className="placeholder-item">Duration: [To be loaded from Pod]</p>
              </div>

              <div className="placeholder-section">
                <h3>Projects</h3>
                <p className="placeholder-item">Project Name: [To be loaded from Pod]</p>
                <p className="placeholder-item">Description: [To be loaded from Pod]</p>
              </div>
            </div>

            <div className="integration-note">
              <p>
                <strong>Note:</strong> Resume data will be fetched from the student's Solid Pod once Solid integration is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default EmployerViewResume;
import React from "react";
import { Link } from "react-router-dom";
import resumeData from "./sample_resume.json"; // import the JSON file
import "./main.css";

function ViewResume() {
  return (
    <main className="view-resume">
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
        <div className="resume">
          <div className="tag-header">
            <h1>Resume Preview</h1>
            <Link to="/config-perms">
              <button className="complete-button">Configure Permissions</button>
            </Link>
          </div>
            <h1 className="full-name">{resumeData.name}</h1>

          {/* Personal Information */}
          <div className="resume-section">
            <h2>Personal Information</h2>
            <p><strong>Email:</strong> {resumeData.email}</p>
            <p><strong>Contact Number:</strong> {resumeData.contact}</p>
            <p><strong>Location:</strong> {resumeData.location}</p>
            <p><strong>Websites:</strong> {resumeData.websites.join(", ")}</p>
          </div>

          {/* Education */}
          <div className="resume-section">
            <h2>Education</h2>
            <p><strong>Degree:</strong> {resumeData.education.degree}</p>
            <p><strong>Institution:</strong> {resumeData.education.institution}</p>
            <p><strong>Honors/Awards:</strong> {resumeData.education.honors}</p>
          </div>

          {/* Skills */}
          <div className="resume-section">
            <h2>Skills</h2>
            <ul>
              {resumeData.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="resume-section">
            <h2>Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="projects">
                <p><strong>Title:</strong> {project.title}</p>
                <p><strong>Date Created:</strong> {project.date}</p>
                <p><strong>Description:</strong> {project.description}</p>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="resume-section">
            <h2>Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="projects">
                <p><strong>Job Title:</strong> {exp.title}</p>
                <p><strong>Duration:</strong> {exp.duration}</p>
                <p><strong>Company:</strong> {exp.company}</p>
                <p><strong>Location:</strong> {exp.location}</p>
                <p><strong>Responsibilities:</strong> {exp.responsibilities}</p>
              </div>
            ))}
          </div>

          <Link to="/create-resume">
            <button className="complete-button">Edit Resume</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ViewResume;

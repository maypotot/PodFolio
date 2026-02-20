import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";
import StudentLayout from "./student-layout";

function ConfigPerms() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [permissions, setPermissions] = useState({
    personalInfo: { name: null, email: null, contactNumber: null },
    education: { degree: null, institution: null, honors: null },
    skills: { skillsList: null },
    projects: { project1: null, project2: null },
    experience: { job1: null, job2: null, job3: null }
  });

  useEffect(() => {
    // Get application context from sessionStorage
    const job = sessionStorage.getItem("current_job_title");
    const resume = sessionStorage.getItem("current_resume_title");
    
    if (!job || !resume) {
      alert("No application found. Redirecting to home feed.");
      navigate("/homefeed");
      return;
    }

    setJobTitle(job);
    setResumeTitle(resume);
  }, [navigate]);

  const handlePermission = (category, field, value) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleAllowAll = (category) => {
    const updatedCategory = {};
    Object.keys(permissions[category]).forEach(field => {
      updatedCategory[field] = true;
    });
    setPermissions(prev => ({
      ...prev,
      [category]: updatedCategory
    }));
  };

  const handleComplete = () => {
    // Clear application context
    sessionStorage.removeItem("current_application_id");
    sessionStorage.removeItem("current_job_title");
    sessionStorage.removeItem("current_resume_title");

    alert("Application submitted successfully!");
    navigate("/homefeed");
  };

  return (
      <div className="content">
        <div className="resume">
          <div className="tag-header">
            <h1>Configure Permissions</h1>
            <button className="complete-button" onClick={handleComplete}>
              Complete Application
            </button>
          </div>

          <div className="application-context">
            <p><strong>Applying to:</strong> {jobTitle}</p>
            <p><strong>Using resume:</strong> {resumeTitle}</p>
            <p className="permissions-hint">
              Select which information from your resume the employer can view:
            </p>
          </div>

          <div className="config">
            {/* Personal Information */}
            <div className="resume-section">
              <div className="tag-header">
                <h2>Personal Information</h2>
                <button className="allow-all" onClick={() => handleAllowAll('personalInfo')}>
                  Allow All
                </button>
              </div>

              <div className="field-row">
                <span>Name</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.personalInfo.name === true ? 'active' : ''}`}
                    onClick={() => handlePermission('personalInfo', 'name', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.personalInfo.name === false ? 'active' : ''}`}
                    onClick={() => handlePermission('personalInfo', 'name', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Email</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.personalInfo.email === true ? 'active' : ''}`}
                    onClick={() => handlePermission('personalInfo', 'email', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.personalInfo.email === false ? 'active' : ''}`}
                    onClick={() => handlePermission('personalInfo', 'email', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Contact Number</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.personalInfo.contactNumber === true ? 'active' : ''}`}
                    onClick={() => handlePermission('personalInfo', 'contactNumber', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.personalInfo.contactNumber === false ? 'active' : ''}`}
                    onClick={() => handlePermission('personalInfo', 'contactNumber', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="resume-section">
              <div className="tag-header">
                <h2>Education</h2>
                <button className="allow-all" onClick={() => handleAllowAll('education')}>
                  Allow All
                </button>
              </div>

              <div className="field-row">
                <span>Degree</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.education.degree === true ? 'active' : ''}`}
                    onClick={() => handlePermission('education', 'degree', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.education.degree === false ? 'active' : ''}`}
                    onClick={() => handlePermission('education', 'degree', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Institution</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.education.institution === true ? 'active' : ''}`}
                    onClick={() => handlePermission('education', 'institution', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.education.institution === false ? 'active' : ''}`}
                    onClick={() => handlePermission('education', 'institution', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Honors / Awards</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.education.honors === true ? 'active' : ''}`}
                    onClick={() => handlePermission('education', 'honors', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.education.honors === false ? 'active' : ''}`}
                    onClick={() => handlePermission('education', 'honors', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="resume-section">
              <div className="tag-header">
                <h2>Skills</h2>
                <button className="allow-all" onClick={() => handleAllowAll('skills')}>
                  Allow All
                </button>
              </div>

              <div className="field-row">
                <span>Skills List</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.skills.skillsList === true ? 'active' : ''}`}
                    onClick={() => handlePermission('skills', 'skillsList', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.skills.skillsList === false ? 'active' : ''}`}
                    onClick={() => handlePermission('skills', 'skillsList', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="resume-section">
              <div className="tag-header">
                <h2>Projects</h2>
                <button className="allow-all" onClick={() => handleAllowAll('projects')}>
                  Allow All
                </button>
              </div>

              <div className="field-row">
                <span>Project 1</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.projects.project1 === true ? 'active' : ''}`}
                    onClick={() => handlePermission('projects', 'project1', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.projects.project1 === false ? 'active' : ''}`}
                    onClick={() => handlePermission('projects', 'project1', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Project 2</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.projects.project2 === true ? 'active' : ''}`}
                    onClick={() => handlePermission('projects', 'project2', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.projects.project2 === false ? 'active' : ''}`}
                    onClick={() => handlePermission('projects', 'project2', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="resume-section">
              <div className="tag-header">
                <h2>Experience</h2>
                <button className="allow-all" onClick={() => handleAllowAll('experience')}>
                  Allow All
                </button>
              </div>

              <div className="field-row">
                <span>Job 1</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.experience.job1 === true ? 'active' : ''}`}
                    onClick={() => handlePermission('experience', 'job1', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.experience.job1 === false ? 'active' : ''}`}
                    onClick={() => handlePermission('experience', 'job1', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Job 2</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.experience.job2 === true ? 'active' : ''}`}
                    onClick={() => handlePermission('experience', 'job2', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.experience.job2 === false ? 'active' : ''}`}
                    onClick={() => handlePermission('experience', 'job2', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>

              <div className="field-row">
                <span>Job 3</span>
                <div className="field-buttons">
                  <button
                    className={`allow-btn ${permissions.experience.job3 === true ? 'active' : ''}`}
                    onClick={() => handlePermission('experience', 'job3', true)}
                  >
                    Allow
                  </button>
                  <button
                    className={`deny-btn ${permissions.experience.job3 === false ? 'active' : ''}`}
                    onClick={() => handlePermission('experience', 'job3', false)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ConfigPerms;
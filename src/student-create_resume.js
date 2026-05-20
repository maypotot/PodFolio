import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"; 
import StudentLayout from "./student-layout.js";

import { 
  loadInformation,
  loadAward,
  loadExperience,
  loadImage,
  loadReference,
  loadProject,
  loadTraining,
  restoreSession,
  loadSkill,
  loadWebsite
 } from "./solid.js";
import { 
  createInformation,
  createWebsite,
  createProject,
  createExperience,
  createSkill,
  loadAllResumes,
  completeResume
 } from "./main.js";

function CreateResume() {
  const navigate = useNavigate();
  const [resumeTitle, setResumeTitleState] = useState("");
  const [availableResumes, setAvailableResumes] = useState([]);

  // States for existing Pod resources
  const [existingInfo, setExistingInfo] = useState([]);
  const [existingSkills, setExistingSkills] = useState([]);
  const [existingProjects, setExistingProjects] = useState([]);
  const [existingWebsites, setExistingWebsites] = useState([]);
  const [existingExperiences, setExistingExperiences] = useState([]);

  // Selections state
  const [selectedInfoId, setSelectedInfoId] = useState("");
  const [selectedSkillIndexes, setSelectedSkillIndexes] = useState([]);
  const [selectedProjectIndexes, setSelectedProjectIndexes] = useState([]);
  const [selectedWebsiteIndexes, setSelectedWebsiteIndexes] = useState([]);
  const [selectedExperienceIndexes, setSelectedExperienceIndexes] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    // Clear previous session data to prevent interference
    sessionStorage.removeItem("session_information_indexes");
    sessionStorage.removeItem("session_experience_indexes");
    sessionStorage.removeItem("session_project_indexes");
    sessionStorage.removeItem("session_website_indexes");
    sessionStorage.removeItem("session_skill_indexes");

    const fetchResumes = async () => {
      const resumes = await loadAllResumes();
      setAvailableResumes(resumes);
    };

    fetchResumes();

    const loadAllExistingPodData = async () => {
      setLoadingData(true);
      try {
        await restoreSession();

        // 1. Personal Info
        const infos = await loadInformation();
        const flatInfos = [];
        infos.forEach(group => {
          if (group && Array.isArray(group.information)) {
            group.information.forEach(info => flatInfos.push(info));
          }
        });
        setExistingInfo(flatInfos);

        // 2. Skills
        const skills = await loadSkill();
        const flatSkills = [];
        skills.forEach(group => {
          if (group && Array.isArray(group.skill)) {
            group.skill.forEach(s => flatSkills.push(s));
          }
        });
        setExistingSkills(flatSkills);

        // 3. Projects
        const projects = await loadProject();
        const flatProjects = [];
        projects.forEach(group => {
          if (group && Array.isArray(group.projects)) {
            group.projects.forEach(p => flatProjects.push(p));
          }
        });
        setExistingProjects(flatProjects);

        // 4. Websites
        const websites = await loadWebsite();
        const flatWebsites = [];
        websites.forEach(group => {
          if (group && Array.isArray(group.website)) {
            group.website.forEach(w => flatWebsites.push(w));
          }
        });
        setExistingWebsites(flatWebsites);

        // 5. Experiences
        const experiences = await loadExperience();
        const flatExperiences = [];
        experiences.forEach(group => {
          if (group && Array.isArray(group.experience)) {
            group.experience.forEach(e => flatExperiences.push(e));
          }
        });
        setExistingExperiences(flatExperiences);
      } catch (err) {
        console.error("Failed to load existing pod data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    loadAllExistingPodData();

    const title = sessionStorage.getItem("current_resume_title");
    if (title) {
      setResumeTitleState(title);
    } else {
      alert("No resume selected. Please create or select a resume from your profile.");
      navigate("/profile");
    }
  }, [navigate]);

  const handleInfoSelect = (event) => {
    const selectedId = event.target.value;
    setSelectedInfoId(selectedId);

    if (selectedId) {
      const info = existingInfo.find(
        (i) => String(i.InformationIndex ?? i._attributes?.InformationIndex) === String(selectedId)
      );
      if (info) {
        const getAttr = (field) => info._attributes?.[field] ?? info[field];

        document.getElementById("FullName").value = getAttr("FullName") || "";
        document.getElementById("ProfessionalTitle").value = getAttr("ProfessionalTitle") || "";
        document.getElementById("Summary").value = getAttr("Summary") || "";
        document.getElementById("Email").value = getAttr("Email") || "";
        document.getElementById("ContactNumber").value = getAttr("ContactNumber") || "";
        document.getElementById("Location").value = getAttr("Location") || "";
        document.getElementById("ProfessionalSummary").value = getAttr("ProfessionalSummary") || "";
        document.getElementById("School").value = getAttr("School") || "";
        document.getElementById("Degree").value = getAttr("Degree") || "";
        document.getElementById("Program").value = getAttr("Program") || "";
        document.getElementById("StartDate").value = getAttr("StartDate") || "";
        document.getElementById("EndDate").value = getAttr("EndDate") || "";
        document.getElementById("RelevantCoursework").value = getAttr("RelevantCoursework") || "";
        document.getElementById("Honors").value = getAttr("Honors") || "";
        document.getElementById("ThesisTitle").value = getAttr("ThesisTitle") || "";
      }
    } else {
      document.getElementById("FullName").value = "";
      document.getElementById("ProfessionalTitle").value = "";
      document.getElementById("Summary").value = "";
      document.getElementById("Email").value = "";
      document.getElementById("ContactNumber").value = "";
      document.getElementById("Location").value = "";
      document.getElementById("ProfessionalSummary").value = "";
      document.getElementById("School").value = "";
      document.getElementById("Degree").value = "";
      document.getElementById("Program").value = "";
      document.getElementById("StartDate").value = "";
      document.getElementById("EndDate").value = "";
      document.getElementById("RelevantCoursework").value = "";
      document.getElementById("Honors").value = "";
      document.getElementById("ThesisTitle").value = "";
    }
  };

  const handleToggleWebsite = (idx) => {
    setSelectedWebsiteIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleToggleSkill = (idx) => {
    setSelectedSkillIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleToggleProject = (idx) => {
    setSelectedProjectIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleToggleExperience = (idx) => {
    setSelectedExperienceIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleCompleteResume = async () => {
    // 1. Merge Website selected indexes
    const sessionWebsites = JSON.parse(sessionStorage.getItem("session_website_indexes")) || [];
    const finalWebsites = Array.from(new Set([...sessionWebsites, ...selectedWebsiteIndexes.map(Number)]));
    sessionStorage.setItem("session_website_indexes", JSON.stringify(finalWebsites));

    // 2. Merge Skill selected indexes
    const sessionSkills = JSON.parse(sessionStorage.getItem("session_skill_indexes")) || [];
    const finalSkills = Array.from(new Set([...sessionSkills, ...selectedSkillIndexes.map(Number)]));
    sessionStorage.setItem("session_skill_indexes", JSON.stringify(finalSkills));

    // 3. Merge Project selected indexes
    const sessionProjects = JSON.parse(sessionStorage.getItem("session_project_indexes")) || [];
    const finalProjects = Array.from(new Set([...sessionProjects, ...selectedProjectIndexes.map(Number)]));
    sessionStorage.setItem("session_project_indexes", JSON.stringify(finalProjects));

    // 4. Merge Experience selected indexes
    const sessionExperiences = JSON.parse(sessionStorage.getItem("session_experience_indexes")) || [];
    const finalExperiences = Array.from(new Set([...sessionExperiences, ...selectedExperienceIndexes.map(Number)]));
    sessionStorage.setItem("session_experience_indexes", JSON.stringify(finalExperiences));

    if (selectedInfoId) {
      // Create new information entry based on current inputs, preserving original selection
      createInformation().then(() => {
        // Ensure original selected info is also included
        const infoIndexes = JSON.parse(sessionStorage.getItem("session_information_indexes")) || [];
        if (!infoIndexes.includes(Number(selectedInfoId))) {
          infoIndexes.push(Number(selectedInfoId));
          sessionStorage.setItem("session_information_indexes", JSON.stringify(infoIndexes));
        }
        completeResume().then(() => {
          navigate("/profile");
          sessionStorage.removeItem("current_resume_id");
          sessionStorage.removeItem("current_resume_title");
        });
      });
    } else {
      const FullName = document.getElementById("FullName").value;
      if (!FullName) {
        alert("Please provide at least a Full Name for new Personal Information, or select a previous one.");
        return;
      }
      createInformation().then(() => {
        alert("Personal Information has been created");   
        completeResume().then(() => {
          navigate("/profile");
          sessionStorage.removeItem("current_resume_id");
          sessionStorage.removeItem("current_resume_title");
        });
      });
    }
  };

  return (
      <div className="content">
        <div className="resume">
          <div className="tag-header">
            <h1>Editing: {resumeTitle}</h1>
            <button className="complete-button" onClick={handleCompleteResume} style={{ marginTop: "10px" }}>
              Complete Resume
            </button>
          </div>

          {loadingData && (
            <p style={{ color: "#770000", fontWeight: "bold", padding: "10px", backgroundColor: "#ffebee", borderRadius: "6px", margin: "10px 0", textAlign: "center" }}>
              🔄 Fetching existing resources from your Solid Pod...
            </p>
          )}

          <div className="tags-section">
            <div className="resume-section">
              <div style={{ borderBottom: "2px solid #ddd", paddingBottom: "15px", marginBottom: "15px" }}>
                <h2>Reuse Personal & Education Info</h2>
                <div className="resume-field" style={{ marginTop: "10px" }}>
                  <h3 className="tag-title" style={{ fontSize: "1rem", color: "#555" }}>Choose Previous Block:</h3>
                  <select
                    className="resume-input"
                    value={selectedInfoId}
                    onChange={handleInfoSelect}
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      backgroundColor: "#f9f9f9"
                    }}
                  >
                    <option value="">-- Create New Personal Information Block --</option>
                    {existingInfo.map((info) => {
                      const id = info.InformationIndex ?? info._attributes?.InformationIndex;
                      const getAttr = (f) => info._attributes?.[f] ?? info[f];
                      return (
                        <option key={id} value={id}>
                          {getAttr("FullName")} ({getAttr("Email") || "No Email"})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <h2>Personal Information</h2>

              <div className="resume-field">
                <h3 className="tag-title">Name</h3>
                <input
                  type="text"
                  placeholder="Juan de la Cruz"
                  className="resume-input"
                  id="FullName"

                />
              </div>
              
              <div className="resume-field">
                <h3 className="tag-title">Professional Title</h3>
                <input
                  type="text"
                  placeholder="Dr."
                  className="resume-input"
                  id="ProfessionalTitle"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Summary</h3>
                <textarea
                  type="text"
                  placeholder="Summary of your profile"
                  className="resume-input"
                  rows={5}
                  id="Summary"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Email</h3>
                <input
                  type="text"
                  placeholder="juandelacruz@gmail.com"
                  className="resume-input"
                  id="Email"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Contact Number</h3>
                <input
                  type="text"
                  placeholder="09171234567"
                  className="resume-input"
                  id="ContactNumber"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Location</h3>
                <input
                  type="text"
                  placeholder="Quezon City, Philippines"
                  className="resume-input"
                  id="Location"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Website</h3>
                <input
                  type="text"
                  placeholder="github.com"
                  className="resume-input"
                  id="WebsiteLink"
                />
                <button className="student-add-tag-button" onClick={createWebsite}>
                  Add Website
                </button>
              </div>

              {/* Website Re-use checklist */}
              {existingWebsites.length > 0 && (
                <div className="resume-field" style={{ marginTop: "15px" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "#555", marginBottom: "5px", fontWeight: "600" }}>Or reuse previous website(s):</h4>
                  <div style={{
                    maxHeight: "120px", overflowY: "auto", border: "1px solid #ccc", padding: "8px", borderRadius: "6px", backgroundColor: "#f9f9f9", width: "100%", maxWidth: "400px"
                  }}>
                    {existingWebsites.map((web) => {
                      const idx = web.WebsiteIndex ?? web._attributes?.WebsiteIndex;
                      const link = web.WebsiteLink ?? web._attributes?.WebsiteLink;
                      return (
                        <label key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0", fontSize: "0.85rem", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={selectedWebsiteIndexes.includes(idx)}
                            onChange={() => handleToggleWebsite(idx)}
                          />
                          <span style={{ wordBreak: "break-all" }}>{link}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="resume-field">
                <h3 className="tag-title">Professional Summary</h3>
                <textarea
                  type="text"
                  placeholder="Professional summary goes here"
                  className="resume-input"
                  rows={5}
                  id="ProfessionalSummary"

                />
              </div>
            </div>

            <div className="resume-section">
              <h2>Education</h2>

              <div className="resume-field">
                <h3 className="tag-title">Academic Institution</h3>
                <input
                  type="text"
                  placeholder="University of the Philippines Diliman"
                  className="resume-input"
                  id="School"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Degree</h3>
                <input
                  type="text"
                  placeholder="BS Computer Science"
                  className="resume-input"
                  id="Degree"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Program</h3>
                <input
                  type="text"
                  placeholder="BS Computer Science"
                  className="resume-input"
                  id="Program"

                />
              </div>
              
              <div className="resume-field">
                <h3 className="tag-title">Start Date</h3>
                <input
                  type="text"
                  placeholder="January 2016"
                  className="resume-input"
                  id="StartDate"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">End Date</h3>
                <input
                  type="text"
                  placeholder="January 2020"
                  className="resume-input"
                  id="EndDate"

                />
              </div>
              
              <div className="resume-field">
                <h3 className="tag-title">Relevant Coursework</h3>
                <input
                  type="text"
                  placeholder="Link to coursework or list here"
                  className="resume-input"
                  id="RelevantCoursework"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Honors/Awards</h3>
                <input
                  type="text"
                  placeholder="Summa Cum Laude"
                  className="resume-input"
                  id="Honors"

                />
              </div>

              <div className="resume-field">
                <h3 className="tag-title">Thesis Title</h3>
                <input
                  type="text"
                  placeholder="Title of your thesis"
                  className="resume-input"
                  id="ThesisTitle"

                />
              </div>

              <div className="resume-field-2">
                <h2>Skills</h2>
                <input
                  type="text"
                  placeholder="Javascript"
                  className="skills-input"
                  id="Skill"
                />
                <button className="student-add-tag-button" onClick={createSkill}>
                  Add Skill
                </button>

                {/* Skill Re-use checklist */}
                {existingSkills.length > 0 && (
                  <div style={{ marginTop: "15px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "#555", marginBottom: "5px", fontWeight: "600" }}>Or reuse previous skill(s):</h4>
                    <div style={{
                      maxHeight: "120px", overflowY: "auto", border: "1px solid #ccc", padding: "8px", borderRadius: "6px", backgroundColor: "#f9f9f9", display: "flex", flexWrap: "wrap", gap: "6px", width: "100%", maxWidth: "400px"
                    }}>
                      {existingSkills.map((sk) => {
                        const idx = sk.SkillIndex ?? sk._attributes?.SkillIndex;
                        const val = sk.Skill ?? sk._attributes?.Skill;
                        const isChecked = selectedSkillIndexes.includes(idx);
                        return (
                          <label key={idx} style={{
                            display: "flex", alignItems: "center", gap: "4px", padding: "3px 6px", border: "1px solid #ccc", borderRadius: "12px", fontSize: "0.8rem", cursor: "pointer",
                            backgroundColor: isChecked ? "#ffebee" : "#fff", borderColor: isChecked ? "#770000" : "#ccc"
                          }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSkill(idx)}
                              style={{ margin: 0 }}
                            />
                            <span>{val}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="resume-section">
              <h2>Projects</h2>

              {/* Projects Re-use checklist */}
              {existingProjects.length > 0 && (
                <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", backgroundColor: "#f9f9f9", width: "100%", maxWidth: "450px" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "#555", marginBottom: "8px", fontWeight: "600" }}>Reuse previous project(s):</h4>
                  <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {existingProjects.map((proj) => {
                      const idx = proj.ProjectIndex ?? proj._attributes?.ProjectIndex;
                      const name = proj.ProjectName ?? proj._attributes?.ProjectName;
                      const tools = proj.Tools ?? proj._attributes?.Tools;
                      return (
                        <label key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", backgroundColor: "#fff" }}>
                          <input
                            type="checkbox"
                            checked={selectedProjectIndexes.includes(idx)}
                            onChange={() => handleToggleProject(idx)}
                          />
                          <div style={{ fontSize: "0.85rem" }}>
                            <strong style={{ color: "#770000" }}>{name}</strong>
                            {tools && <span style={{ color: "#666", marginLeft: "6px" }}>({tools})</span>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="projects">
                <h3 className="project-list">Add New Project</h3>

                <div className="resume-field">
                  <h3 className="tag-title">Project Title</h3>
                  <input
                    type="text"
                    placeholder="Snake Game"
                    className="resume-input"
                    id="ProjectName"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Tools</h3>
                  <input
                    type="text"
                    placeholder="Python, React"
                    className="resume-input"
                    id="Tools"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Project Description</h3>
                  <textarea
                    placeholder="Insert project Description here"
                    className="resume-description"
                    rows={5}
                    id="ProjectSummary"
                  />
                </div>
                
                <div className="resume-field">
                  <h3 className="tag-title">Project Link</h3>
                  <textarea
                    placeholder="Insert project Link here"
                    className="resume-description"
                    rows={5}
                    id="ProjectLink"
                  />
                </div>
                
                <button className="student-add-tag-button" onClick={createProject}>
                  Add Project
                </button>
              </div>
            </div>

            <div className="resume-section">
              <h2>Experience</h2>

              {/* Experience Re-use checklist */}
              {existingExperiences.length > 0 && (
                <div style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ccc", borderRadius: "6px", backgroundColor: "#f9f9f9", width: "100%", maxWidth: "450px" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "#555", marginBottom: "8px", fontWeight: "600" }}>Reuse previous experience(s):</h4>
                  <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {existingExperiences.map((exp) => {
                      const idx = exp.ExperienceIndex ?? exp._attributes?.ExperienceIndex;
                      const title = exp.PositionTitle ?? exp._attributes?.PositionTitle;
                      const org = exp.Organization ?? exp._attributes?.Organization;
                      const dur = exp.Duration ?? exp._attributes?.Duration;
                      return (
                        <label key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer", backgroundColor: "#fff" }}>
                          <input
                            type="checkbox"
                            checked={selectedExperienceIndexes.includes(idx)}
                            onChange={() => handleToggleExperience(idx)}
                          />
                          <div style={{ fontSize: "0.85rem" }}>
                            <strong style={{ color: "#770000" }}>{title}</strong>
                            {org && <span style={{ color: "#333" }}> at {org}</span>}
                            {dur && <span style={{ color: "#666", display: "block", fontSize: "0.75rem" }}>{dur}</span>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="projects">
                <h3 className="project-list">Add New Experience</h3>

                <div className="resume-field">
                  <h3 className="tag-title">Job Title</h3>
                  <input
                    type="text"
                    placeholder="Project Manager"
                    className="resume-input"
                    id="PositionTitle"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Duration</h3>
                  <input
                    type="text"
                    placeholder="May 2022 - December 2022"
                    className="resume-input"
                    id="Duration"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Company Name</h3>
                  <input
                    type="text"
                    placeholder="Accenture"
                    className="resume-input"
                    id="Organization"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Location</h3>
                  <input
                    type="text"
                    placeholder="Quezon City"
                    className="resume-input"
                    id="ExperienceLocation"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Responsibilities/Accomplishments</h3>
                  <textarea
                    placeholder="Insert responsibilities and accomplishments here"
                    className="resume-description"
                    rows={5}
                    id="Description"
                  />
                </div>
                <button className="student-add-tag-button" onClick={createExperience}>
                  Add Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default CreateResume;
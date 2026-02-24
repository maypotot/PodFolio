import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./main.css";
import StudentLayout from "./student-layout";
import { Link } from "react-router-dom";
import "./main.css";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { universalAccess } from "@inrupt/solid-client";
import { restoreSession } from "./solid.js";

import { 
  loadInformation,
  loadExperience,
  loadImage,
  loadProject,
  loadWebsite,
  loadSkill
 } from "./solid.js";

let podInfolist = [];
let podSkilllist = [];
let podProjectlist = [];
let podWebsiteList = [];
let podExperienceList = [];
let podImageList = [];
let resumeIndexList = [];

// Helper function to get filtered data by resume ID
export function getFilteredResumeData(resumeId) {
  const filteredInfo = podInfolist.filter(info => info.ResumeIndex == resumeId);
  const filteredSkills = podSkilllist.filter(skill => skill.ResumeIndex == resumeId);
  const filteredProjects = podProjectlist.filter(project => project.ResumeIndex == resumeId);
  const filteredWebsites = podWebsiteList.filter(website => website.ResumeIndex == resumeId);
  const filteredExperiences = podExperienceList.filter(exp => exp.ResumeIndex == resumeId);
  
  console.log(`\n=== Filtered Resume Data for ID: ${resumeId} ===`);
  console.log("Personal Information:", filteredInfo);
  console.log("Skills:", filteredSkills);
  console.log("Projects:", filteredProjects);
  console.log("Websites:", filteredWebsites);
  console.log("Experiences:", filteredExperiences);
  console.log(`\nSummary: ${filteredInfo.length} info, ${filteredSkills.length} skills, ${filteredProjects.length} projects, ${filteredWebsites.length} websites, ${filteredExperiences.length} experiences`);
  
  return {
    info: filteredInfo,
    skills: filteredSkills,
    projects: filteredProjects,
    websites: filteredWebsites,
    experiences: filteredExperiences
  };
}

export async function loadResumeData() {

  // Clear previous data
  podInfolist = [];
  podSkilllist = [];
  podProjectlist = [];
  podWebsiteList = [];
  podExperienceList = [];
  podImageList = [];

  const user = await restoreSession();
  const podInformation = await loadInformation();

  for (let i in podInformation){
    for (let j in podInformation[i].information){
          podInfolist.push(podInformation[i].information[j]);
    }
  }

  resumeIndexList = Array.from(
    new Set(podInfolist.map((info) => Number(info.ResumeIndex)).filter((value) => !Number.isNaN(value)))
  );

  const podSkills = await loadSkill();

  for (let i in podSkills){
    for (let j in podSkills[i].skill){
          podSkilllist.push(podSkills[i].skill[j]);
    }
  }
  
  const podProjects = await loadProject();

  for (let i in podProjects){
    for (let j in podProjects[i].projects){
          podProjectlist.push(podProjects[i].projects[j]);
    }
  }
  
  const podWebsites = await loadWebsite();

  for (let i in podWebsites){
    for (let j in podWebsites[i].website){
          podWebsiteList.push(podWebsites[i].website[j]);
    }
  }
  const podExperiences = await loadExperience();

  for (let i in podExperiences){
    for (let j in podExperiences[i].experience){
          podExperienceList.push(podExperiences[i].experience[j]);
    }
  }


  alert("All info loaded.");

}

async function requestAccess(requestingID, resourceURL) {
  const session = getDefaultSession();

  try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceURL,
      requestingID,
      {
        read: true,
        write: false,
        append: false,
        control: false,
      },
      { fetch: session.fetch }
    );

    if (updatedAccess === null) {
      console.log("Could not update access (Server might not support this API or permission denied)");
    } else {
      alert("Access granted for: " + requestingID);
      console.log("Access granted for:", requestingID);
    }
  } catch (error) {
    console.error("Error granting access:", error);
  }

  return true;
}

async function denyAccess(requestingID, resourceURL) {
  const session = getDefaultSession();

  try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceURL,
      requestingID,
      {
        read: false,
        write: false,
        append: false,
        control: false,
      },
      { fetch: session.fetch }
    );

    if (updatedAccess === null) {
      console.log("Could not update access (Server might not support this API or permission denied)");
    } else {
      alert("Access removed for: " + requestingID);
      console.log("Access removed for:", requestingID);
    }
  } catch (error) {
    console.error("Error removing access:", error);
  }

  return true;
}

async function getAgentAccess(requestingID, resourceURL) {
  const session = getDefaultSession();

  try {
    return await universalAccess.getAgentAccess(
      resourceURL,
      requestingID,
      { fetch: session.fetch }
    );
  } catch (error) {
    console.error("Error reading access:", error);
    return null;
  }
}


function ConfigPerms() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);
  const [employerId, setEmployerId] = useState("");
  const [filteredData, setFilteredData] = useState({
    info: [],
    skills: [],
    projects: [],
    websites: [],
    experiences: []
  });
  const [permissions, setPermissions] = useState({});

  // Function to check existing access for all resources
  const checkExistingAccess = async (employer, data) => {
    console.log("\n=== Checking Existing Access ===");
    const initialPermissions = {};
    
    // Check personal info
    if (data.info.length > 0 && data.info[0].url) {
      const access = await getAgentAccess(employer, data.info[0].url);
      initialPermissions.info = access?.read === true;
      console.log(`Info access: ${initialPermissions.info}`, access);
    }
    
    // Check skills
    for (let index = 0; index < data.skills.length; index++) {
      if (data.skills[index].url) {
        const access = await getAgentAccess(employer, data.skills[index].url);
        initialPermissions[`skill_${index}`] = access?.read === true;
        console.log(`Skill ${index} access: ${initialPermissions[`skill_${index}`]}`, access);
      }
    }
    
    // Check projects
    for (let index = 0; index < data.projects.length; index++) {
      if (data.projects[index].url) {
        const access = await getAgentAccess(employer, data.projects[index].url);
        initialPermissions[`project_${index}`] = access?.read === true;
        console.log(`Project ${index} access: ${initialPermissions[`project_${index}`]}`, access);
      }
    }
    
    // Check websites
    for (let index = 0; index < data.websites.length; index++) {
      if (data.websites[index].url) {
        const access = await getAgentAccess(employer, data.websites[index].url);
        initialPermissions[`website_${index}`] = access?.read === true;
        console.log(`Website ${index} access: ${initialPermissions[`website_${index}`]}`, access);
      }
    }
    
    // Check experiences
    for (let index = 0; index < data.experiences.length; index++) {
      if (data.experiences[index].url) {
        const access = await getAgentAccess(employer, data.experiences[index].url);
        initialPermissions[`experience_${index}`] = access?.read === true;
        console.log(`Experience ${index} access: ${initialPermissions[`experience_${index}`]}`, access);
      }
    }
    
    console.log("Final initial permissions:", initialPermissions);
    return initialPermissions;
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Get application context from sessionStorage
    const job = sessionStorage.getItem("current_job_title");
    const resume = sessionStorage.getItem("current_resume_title");
    const employer = sessionStorage.getItem("current_employer_id") || "https://thesis-test.solidcommunity.net/profile/card#me"; // Default for testing
    // const resumeId = sessionStorage.getItem("current_resume_id");
    const resumeId = 22
    
    console.log("Session:", sessionStorage);
    console.log("Current Resume ID:", resumeId);
    console.log("Employer ID:", employer);
    
    if (!job || !resume) {
      alert("No application found. Redirecting to home feed.");
      navigate("/homefeed");
      return;
    }

    setJobTitle(job);
    setResumeTitle(resume);
    setEmployerId(employer);
    
    // Load all resume data and then filter by current resume ID
    setIsLoading(true);
    loadResumeData()
      .then(() => setIsLoading(false))
      .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
      .then(async () => {
        if (resumeId) {
          const data = getFilteredResumeData(resumeId);
          console.log("\n=== All matching items for resume ID:", resumeId, "===");
          console.log("Filtered data object:", data);
          setFilteredData(data);
          
          // Check existing access for all resources
          const initialPermissions = await checkExistingAccess(employer, data);
          setPermissions(initialPermissions);
        } else {
          console.warn("No resume ID found in sessionStorage");
        }
      });
  }, [navigate]);

  const handlePermission = async (key, resourceURL) => {
    // Toggle permission: if currently has access (true), deny it (false); otherwise grant access (true)
    const currentAccess = permissions[key];
    const newAccess = !currentAccess;
    
    // Update state first for immediate UI feedback
    setPermissions(prev => ({
      ...prev,
      [key]: newAccess
    }));
    
    // Call requestAccess or denyAccess based on the new value
    if (!employerId || !resourceURL) {
      console.warn("Missing employerId or resourceURL", { employerId, resourceURL });
      return;
    }
    
    if (newAccess === true) {
      console.log(`Calling requestAccess for ${key}:`, { employerId, resourceURL });
      await requestAccess(employerId, resourceURL);
    } else {
      console.log(`Calling denyAccess for ${key}:`, { employerId, resourceURL });
      await denyAccess(employerId, resourceURL);
    }
  };

  const handleAllowAll = async (category) => {
    const updatedPermissions = { ...permissions };
    
    // Set all permissions for the given category to true and call requestAccess
    if (category === 'info' && filteredData.info.length > 0) {
      updatedPermissions.info = true;
      await requestAccess(employerId, filteredData.info[0].url);
    }
    
    if (category === 'skill') {
      for (let index = 0; index < filteredData.skills.length; index++) {
        const key = `skill_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.skills[index].url);
      }
    }
    
    if (category === 'project') {
      for (let index = 0; index < filteredData.projects.length; index++) {
        const key = `project_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.projects[index].url);
      }
    }
    
    if (category === 'website') {
      for (let index = 0; index < filteredData.websites.length; index++) {
        const key = `website_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.websites[index].url);
      }
    }
    
    if (category === 'experience') {
      for (let index = 0; index < filteredData.experiences.length; index++) {
        const key = `experience_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.experiences[index].url);
      }
    }
    
    setPermissions(updatedPermissions);
  };

  const handleComplete = async () => {
    const resumeId = sessionStorage.getItem("current_resume_id");
    
    console.log("\n=== Applying Permissions ===");
    console.log("Permissions configuration:", permissions);
    console.log("Filtered data to apply permissions to:", filteredData);
    
    // Apply permissions to each filtered item based on the permissions state
    
    // Personal Info
    if (permissions.info === true && filteredData.info.length > 0) {
      console.log("Granting access to personal info:", filteredData.info[0]);
      // TODO: Call requestAccess for the personal info resource URL
    } else if (permissions.info === false && filteredData.info.length > 0) {
      console.log("Denying access to personal info:", filteredData.info[0]);
      // TODO: Call denyAccess for the personal info resource URL
    }
    
    // Skills
    filteredData.skills.forEach((skill, index) => {
      const permKey = `skill_${index}`;
      if (permissions[permKey] === true) {
        console.log(`Granting access to skill: ${skill.Skill}`, skill);
        // TODO: Call requestAccess for this skill's resource URL
      } else if (permissions[permKey] === false) {
        console.log(`Denying access to skill: ${skill.Skill}`, skill);
        // TODO: Call denyAccess for this skill's resource URL
      }
    });
    
    // Projects
    filteredData.projects.forEach((project, index) => {
      const permKey = `project_${index}`;
      if (permissions[permKey] === true) {
        console.log(`Granting access to project: ${project.ProjectName}`, project);
        // TODO: Call requestAccess for this project's resource URL
      } else if (permissions[permKey] === false) {
        console.log(`Denying access to project: ${project.ProjectName}`, project);
        // TODO: Call denyAccess for this project's resource URL
      }
    });
    
    // Websites
    filteredData.websites.forEach((website, index) => {
      const permKey = `website_${index}`;
      if (permissions[permKey] === true) {
        console.log(`Granting access to website: ${website.WebsiteLink}`, website);
        // TODO: Call requestAccess for this website's resource URL
      } else if (permissions[permKey] === false) {
        console.log(`Denying access to website: ${website.WebsiteLink}`, website);
        // TODO: Call denyAccess for this website's resource URL
      }
    });
    
    // Experiences
    filteredData.experiences.forEach((experience, index) => {
      const permKey = `experience_${index}`;
      if (permissions[permKey] === true) {
        console.log(`Granting access to experience: ${experience.PositionTitle} at ${experience.Organization}`, experience);
        // TODO: Call requestAccess for this experience's resource URL
      } else if (permissions[permKey] === false) {
        console.log(`Denying access to experience: ${experience.PositionTitle} at ${experience.Organization}`, experience);
        // TODO: Call denyAccess for this experience's resource URL
      }
    });
    
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

          {isLoading ? (
            <p style={{fontSize: '32px', color: '#666', textAlign: 'center', marginTop: '50px'}}>Loading resumes...</p>
          ) : (
            <>
              <div className="application-context">
                <p><strong>Applying to:</strong> {jobTitle}</p>
                <p><strong>Using resume:</strong> {resumeTitle}</p>
                <p className="permissions-hint">
                  Select which information from your resume the employer can view:
                </p>
              </div>

              <div className="config">
            {/* Personal Information */}
            {filteredData.info.length > 0 && (
              <div className="resume-section">
                <div className="tag-header">
                  <h2>Personal Information</h2>
                  <button className="allow-all" onClick={() => handleAllowAll('info')}>
                    Allow All
                  </button>
                </div>

                <div className="field-row">
                  <span>
                    {filteredData.info[0].FullName || 'Personal Information'} 
                    {filteredData.info[0].Email && ` (${filteredData.info[0].Email})`}
                  </span>
                  <div className="field-buttons">
                    {permissions.info === true ? (
                      <button
                        className="deny-btn active"
                        onClick={() => handlePermission('info', filteredData.info[0].url)}
                      >
                        Deny
                      </button>
                    ) : (
                      <button
                        className="allow-btn"
                        onClick={() => handlePermission('info', filteredData.info[0].url)}
                      >
                        Allow
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            {filteredData.skills.length > 0 && (
              <div className="resume-section">
                <div className="tag-header">
                  <h2>Skills</h2>
                  <button className="allow-all" onClick={() => handleAllowAll('skill')}>
                    Allow All
                  </button>
                </div>

                {filteredData.skills.map((skill, index) => (
                  <div className="field-row" key={`skill_${index}`}>
                    <span>{skill.Skill || `Skill ${index + 1}`}</span>
                    <div className="field-buttons">
                      {permissions[`skill_${index}`] === true ? (
                        <button
                          className="deny-btn active"
                          onClick={() => handlePermission(`skill_${index}`, skill.url)}
                        >
                          Deny
                        </button>
                      ) : (
                        <button
                          className="allow-btn"
                          onClick={() => handlePermission(`skill_${index}`, skill.url)}
                        >
                          Allow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {filteredData.projects.length > 0 && (
              <div className="resume-section">
                <div className="tag-header">
                  <h2>Projects</h2>
                  <button className="allow-all" onClick={() => handleAllowAll('project')}>
                    Allow All
                  </button>
                </div>

                {filteredData.projects.map((project, index) => (
                  <div className="field-row" key={`project_${index}`}>
                    <span>{project.ProjectName || `Project ${index + 1}`}</span>
                    <div className="field-buttons">
                      {permissions[`project_${index}`] === true ? (
                        <button
                          className="deny-btn active"
                          onClick={() => handlePermission(`project_${index}`, project.url)}
                        >
                          Deny
                        </button>
                      ) : (
                        <button
                          className="allow-btn"
                          onClick={() => handlePermission(`project_${index}`, project.url)}
                        >
                          Allow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Websites */}
            {filteredData.websites.length > 0 && (
              <div className="resume-section">
                <div className="tag-header">
                  <h2>Websites</h2>
                  <button className="allow-all" onClick={() => handleAllowAll('website')}>
                    Allow All
                  </button>
                </div>

                {filteredData.websites.map((website, index) => (
                  <div className="field-row" key={`website_${index}`}>
                    <span>{website.WebsiteLink || `Website ${index + 1}`}</span>
                    <div className="field-buttons">
                      {permissions[`website_${index}`] === true ? (
                        <button
                          className="deny-btn active"
                          onClick={() => handlePermission(`website_${index}`, website.url)}
                        >
                          Deny
                        </button>
                      ) : (
                        <button
                          className="allow-btn"
                          onClick={() => handlePermission(`website_${index}`, website.url)}
                        >
                          Allow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {filteredData.experiences.length > 0 && (
              <div className="resume-section">
                <div className="tag-header">
                  <h2>Experience</h2>
                  <button className="allow-all" onClick={() => handleAllowAll('experience')}>
                    Allow All
                  </button>
                </div>

                {filteredData.experiences.map((experience, index) => (
                  <div className="field-row" key={`experience_${index}`}>
                    <span>
                      {experience.PositionTitle || `Experience ${index + 1}`}
                      {experience.Organization && ` at ${experience.Organization}`}
                    </span>
                    <div className="field-buttons">
                      {permissions[`experience_${index}`] === true ? (
                        <button
                          className="deny-btn active"
                          onClick={() => handlePermission(`experience_${index}`, experience.url)}
                        >
                          Deny
                        </button>
                      ) : (
                        <button
                          className="allow-btn"
                          onClick={() => handlePermission(`experience_${index}`, experience.url)}
                        >
                          Allow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
  );
}

export default ConfigPerms;
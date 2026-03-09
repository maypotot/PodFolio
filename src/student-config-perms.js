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

function stripFragment(url) {
  return url ? url.split("#")[0] : url;
}

function ensureWebIdHasMe(webId) {
  if (!webId) return webId;
  if (webId.endsWith("#me")) return webId;

  const webIdBase = webId.split("#")[0];
  return `${webIdBase}#me`;
}

async function requestAccess(requestingID, resourceURL, resumeId, studentWebId) {
  const session = getDefaultSession();
  const resourceBaseUrl = stripFragment(resourceURL);

  try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceBaseUrl,
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
      
      // Also persist in database
      if (resumeId && studentWebId) {
        await requestAccessDatabase(requestingID, resourceBaseUrl, resumeId, studentWebId);
      }
    }
  } catch (error) {
    console.error("Error granting access:", error);
  }

  return true;
}

async function denyAccess(requestingID, resourceURL, resumeId, studentWebId) {
  const session = getDefaultSession();
  const resourceBaseUrl = stripFragment(resourceURL);

  try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceBaseUrl,
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
      
      // Also remove from database
      if (resumeId && studentWebId) {
        await denyAccessDatabase(requestingID, resourceBaseUrl, resumeId, studentWebId);
      }
    }
  } catch (error) {
    console.error("Error removing access:", error);
  }

  return true;
}

async function getAgentAccess(requestingID, resourceURL) {
  const session = getDefaultSession();
  const resourceBaseUrl = stripFragment(resourceURL);

  try {
    return await universalAccess.getAgentAccess(
      resourceBaseUrl,
      requestingID,
      { fetch: session.fetch }
    );
  } catch (error) {
    console.error("Error reading access:", error);
    return null;
  }
}

async function listPermissions(studentWebId, employerWebId) {
  try {
    const params = new URLSearchParams();
    if (studentWebId) params.append('student_webid', studentWebId);
    if (employerWebId) params.append('employer_webid', employerWebId);

    const response = await fetch(`http://127.0.0.1:8000/api/permissions/list/?${params}`);
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to list permissions');
      return [];
    }
  } catch (error) {
    console.error('Error listing permissions:', error);
    return [];
  }
}

// Persmission helper functions for SOLID

async function requestAccessDatabase(employerWebId, resourceURL, resumeId, studentWebId) {
  console.log("\n=== REQUEST ACCESS DATABASE ===");
  console.log("Requesting access in backend with:", { 
    employerWebId, 
    resourceURL, 
    resumeId, 
    studentWebId 
  });
  
  const payload = {
    employer_webid: employerWebId,
    student_webid: studentWebId,
    resource_url: resourceURL,
    resume_id: resumeId
  };
  
  console.log("Stringified payload:", JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch("http://127.0.1:8000/api/permissions/grant/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Permission granted in backend:", data);
      console.log("Response data:", { employerWebId, resourceURL, resumeId });
    } else {
      const errorData = await response.text();
      console.error("❌ Failed to grant permission in backend. Status:", response.status);
      console.error("Error response:", errorData);
    }
  } catch (error) {
    console.error("Error granting permission in backend:", error);
    return false;
  } 
}

async function denyAccessDatabase(employerWebId, resourceURL, resumeId, studentWebId) {
  console.log("\n=== DENY ACCESS DATABASE ===");
  console.log("Revoking access in backend with:", { 
    employerWebId, 
    resourceURL, 
    resumeId, 
    studentWebId 
  });
  
  const payload = {
    employer_webid: employerWebId,
    resource_url: resourceURL,
    resume_id: resumeId,
    student_webid: studentWebId
  };
  
  console.log("Stringified payload:", JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch("http://127.0.1:8000/api/permissions/revoke/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
  });

  if (response.ok) {
    const data = await response.json();
    console.log("✅ Permission revoked in backend for:", data);
  }
  else {
    const errorData = await response.text();
    console.error("❌ Failed to revoke permission in backend. Status:", response.status);
    console.error("Error response:", errorData);
    console.error("Request payload was:", payload);
    console.error("\n⚠️ TIP: Click 'Test: Get DB Permissions' to see what's actually in the database");
    return false;
  }
} catch (error) {
    console.error("Error revoking permission in backend:", error);
    return false;
}
}

// Test function to retrieve permissions from database
async function getPermissionsDatabase(studentWebId, employerWebId = null, resumeId = null) {
  console.log("\n=== Fetching Permissions from Database ===");
  console.log("Parameters:", { studentWebId, employerWebId, resumeId });
  
  try {
    // Build query string
    let url = "http://127.0.1:8000/api/permissions/list/?";
    if (studentWebId) url += `student_webid=${encodeURIComponent(studentWebId)}`;
    if (employerWebId) url += `&employer_webid=${encodeURIComponent(employerWebId)}`;
    if (resumeId) url += `&resume_id=${resumeId}`;
    
    console.log("Fetching from URL:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("\n=== Permissions Retrieved from Database ===");
      console.log(`Total permissions found: ${data.length}`);
      console.log("\nFull data structure:", data);
      
      // Log each permission individually for clarity
      data.forEach((perm, index) => {
        console.log(`\nPermission ${index + 1}:`);
        console.log("  - ID:", perm.id);
        console.log("  - Employer WebID:", perm.employer_webid);
        console.log("  - Student WebID:", perm.student_webid);
        console.log("  - Resource URL:", perm.resource_url);
        console.log("  - Resume ID:", perm.resume_id);
      });
      
      return data;
    } else {
      console.error("Failed to fetch permissions from database. Status:", response.status);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching permissions from database:", error);
    return [];
  }
}

function ConfigPerms() {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);
  const [employerId, setEmployerId] = useState("");
  const [resumeId, setResumeId] = useState("");
  const [studentWebId, setStudentWebId] = useState("");
  const [filteredData, setFilteredData] = useState({
    info: [],
    skills: [],
    projects: [],
    websites: [],
    experiences: []
  });
  const [permissions, setPermissions] = useState({});
  const [dbPermissions, setDbPermissions] = useState([]);

  // Test function to retrieve and display database permissions
  const testGetPermissions = async () => {
    console.log("\n========================================");
    console.log("TESTING: Fetching permissions from database");
    console.log("Current state - studentWebId:", studentWebId);
    console.log("Current state - employerId:", employerId);
    console.log("Current state - resumeId:", resumeId);
    console.log("========================================");
    
    const perms = await getPermissionsDatabase(studentWebId, employerId, resumeId);
    setDbPermissions(perms);
    
    console.log("\nDatabase permissions saved to state:", perms);
    alert(`Found ${perms.length} permissions in database. Check console for details.`);
  };

  // Function to check existing access for all resources
  const checkExistingAccess = async (employer, data, studentWebId) => {
    const initialPermissions = {};

    // First, get all permissions from database
    const dbPermissions = await listPermissions(studentWebId, employer);
    console.log("Database permissions retrieved:", dbPermissions);

    const dbPermissionMap = {};
    dbPermissions.forEach(perm => {
    const strippedUrl = stripFragment(perm.resource_url);
    dbPermissionMap[strippedUrl] = true;
    });
    
    // Check personal info
    if (data.info.length > 0 && data.info[0].url) {
    const resourceUrl = stripFragment(data.info[0].url);
    
      // Check database first
      if (dbPermissionMap[resourceUrl]) {
        initialPermissions.info = true;
        console.log("✓ Info: Found in database");
      } else {
        // Fallback to checking Solid Pod
        const access = await getAgentAccess(employer, data.info[0].url);
        initialPermissions.info = access?.read === true;
        console.log(`Info: Solid Pod check = ${initialPermissions.info}`);
      }
    }
    
    // Check skills
    for (let index = 0; index < data.skills.length; index++) {
      if (data.skills[index].url) {
        const resourceUrl = stripFragment(data.skills[index].url);
        const key = `skill_${index}`;

        if (dbPermissionMap[resourceUrl]) {
          initialPermissions[key] = true;
          console.log(`✓ Skill ${index}: Found in database`);
        } else {
          const access = await getAgentAccess(employer, data.skills[index].url);
          initialPermissions[key] = access?.read === true;
          console.log(`Skill ${index}: Solid Pod check = ${initialPermissions[key]}`);
        }
      }
    }
    
    // Check projects
    for (let index = 0; index < data.projects.length; index++) {
      if (data.projects[index].url) {
        const resourceUrl = stripFragment(data.projects[index].url);
        const key = `project_${index}`;

        if (dbPermissionMap[resourceUrl]) {
          initialPermissions[key] = true;
          console.log(`✓ Project ${index}: Found in database`);
        } else {
          const access = await getAgentAccess(employer, data.projects[index].url);
          initialPermissions[key] = access?.read === true;
          console.log(`Project ${index}: Solid Pod check = ${initialPermissions[key]}`);
        }
      }
    }
    
    // Check websites
    for (let index = 0; index < data.websites.length; index++) {
      if (data.websites[index].url) {
        const resourceUrl = stripFragment(data.websites[index].url);
        const key = `website_${index}`;

        if (dbPermissionMap[resourceUrl]) {
          initialPermissions[key] = true;
          console.log(`✓ Website ${index}: Found in database`);
        } else {
          const access = await getAgentAccess(employer, data.websites[index].url);
          initialPermissions[key] = access?.read === true;
          console.log(`Website ${index}: Solid Pod check = ${initialPermissions[key]}`);
        }
      }
    } 
    
    // Check experiences
    for (let index = 0; index < data.experiences.length; index++) {
      if (data.experiences[index].url) {
        const resourceUrl = stripFragment(data.experiences[index].url);
        const key = `experience_${index}`;

        if (dbPermissionMap[resourceUrl]) {
          initialPermissions[key] = true;
          console.log(`✓ Experience ${index}: Found in database`);
        } else {
          const access = await getAgentAccess(employer, data.experiences[index].url);
          initialPermissions[key] = access?.read === true;
          console.log(`Experience ${index}: Solid Pod check = ${initialPermissions[key]}`);
        }
      }
    }

    return initialPermissions;
  }
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Get application context from sessionStorage
    const job = sessionStorage.getItem("current_job_title");
    const resume = sessionStorage.getItem("current_resume_title");
    const employerFromStorage = sessionStorage.getItem("current_employer_webid");
    const employer = ensureWebIdHasMe(
      employerFromStorage || "https://thesis-test.solidcommunity.net/profile/card#me"
    ); // Default for testing
    const resumeIdFromStorage = sessionStorage.getItem("current_resume_id");
    const session = getDefaultSession();
    const studentWebIdFromSession = session.info?.webId || "";
    
    console.log("THIS IS THE RESUME ID:", resumeIdFromStorage);
    console.log("THIS IS THE EMPLOYER WEB ID:", employer);
    console.log("THIS IS THE STUDENT WEB ID:", studentWebIdFromSession);
    
    console.log("Session:", sessionStorage);
    console.log("Current Resume ID:", resumeIdFromStorage);
    console.log("Employer ID:", employer);
    
    if (!job || !resume) {
      alert("No application found. Redirecting to home feed.");
      navigate("/homefeed");
      return;
    }

    setJobTitle(job);
    setResumeTitle(resume);
    setEmployerId(employer);
    setResumeId(resumeIdFromStorage);
    setStudentWebId(studentWebIdFromSession);
    
    // Load all resume data and then filter by current resume ID
    setIsLoading(true);
    loadResumeData()
      .then(() => setIsLoading(false))
      .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
      .then(async () => {
        if (resumeIdFromStorage) {
          const data = getFilteredResumeData(resumeIdFromStorage);
          console.log("\n=== All matching items for resume ID:", resumeIdFromStorage, "===");
          console.log("Filtered data object:", data);
          setFilteredData(data);
          
          // Check existing access for all resources
          const initialPermissions = await checkExistingAccess(employer, data, studentWebIdFromSession);
          setPermissions(initialPermissions);
        } else {
          console.warn("No resume ID found in sessionStorage");
        }
      });
  }, [navigate]);

  const handlePermission = async (key, resourceURL) => {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔘 HANDLE PERMISSION CLICKED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    // Toggle permission: if currently has access (true), deny it (false); otherwise grant access (true)
    const currentAccess = permissions[key];
    const newAccess = !currentAccess;
    
    console.log(`Permission Key: ${key}`);
    console.log(`Current Access: ${currentAccess}`);
    console.log(`New Access: ${newAccess} (${newAccess ? 'GRANTING' : 'REVOKING'})`);
    console.log(`Resource URL: ${resourceURL}`);
    console.log(`Employer ID: ${employerId}`);
    console.log(`Student WebID: ${studentWebId}`);
    console.log(`Resume ID: ${resumeId}`);
    
    // Update state first for immediate UI feedback
    setPermissions(prev => ({
      ...prev,
      [key]: newAccess
    }));
    
    // Call requestAccess or denyAccess based on the new value
    if (!employerId || !resourceURL) {
      console.warn("⚠️ Missing employerId or resourceURL", { employerId, resourceURL });
      return;
    }
    
    if (newAccess === true) {
      console.log(`\n▶️ Calling requestAccess for ${key}`);
      await requestAccess(employerId, resourceURL, resumeId, studentWebId);
    } else {
      console.log(`\n▶️ Calling denyAccess for ${key}`);
      await denyAccess(employerId, resourceURL, resumeId, studentWebId);
    }
    
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  };

  const handleAllowAll = async (category) => {
    const updatedPermissions = { ...permissions };
    
    // Set all permissions for the given category to true and call requestAccess
    if (category === 'info' && filteredData.info.length > 0) {
      updatedPermissions.info = true;
      await requestAccess(employerId, filteredData.info[0].url, resumeId, studentWebId);
    }
    
    if (category === 'skill') {
      for (let index = 0; index < filteredData.skills.length; index++) {
        const key = `skill_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.skills[index].url, resumeId, studentWebId);
      }
    }
    
    if (category === 'project') {
      for (let index = 0; index < filteredData.projects.length; index++) {
        const key = `project_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.projects[index].url, resumeId, studentWebId);
      }
    }
    
    if (category === 'website') {
      for (let index = 0; index < filteredData.websites.length; index++) {
        const key = `website_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.websites[index].url, resumeId, studentWebId);
      }
    }
    
    if (category === 'experience') {
      for (let index = 0; index < filteredData.experiences.length; index++) {
        const key = `experience_${index}`;
        updatedPermissions[key] = true;
        await requestAccess(employerId, filteredData.experiences[index].url, resumeId, studentWebId);
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
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="complete-button" 
                onClick={testGetPermissions}
                style={{ backgroundColor: '#4CAF50' }}
              >
                🔍 Test: Get DB Permissions
              </button>
              <button className="complete-button" onClick={handleComplete}>
                Complete Application
              </button>
            </div>
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
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"; 
import { restoreSession } from "./solid.js";
import StudentLayout from "./student-layout.js";

import { 
  updateInformation,
  updateSkill,
  updateProject,
  updateExperience,
  updateWebsite
 } from "./main.js";

import { 
  loadInformation,
  loadExperience,
  loadImage,
  loadProject,
  loadWebsite,
  loadSkill
 } from "./solid.js";
import {
  updateInfoText,
  updateSkillText,
  updateProjectText,
  updateExperienceText,
  updateWebsiteText,
  updateResumeText,
} from "./student-view-resume.js"

let podInfolist = [];
let podSkilllist = [];
let podProjectlist = [];
let podWebsiteList = [];
let podExperienceList = [];
let podImageList = [];
let resumeIndexList = [];

// Helper functions to get filtered data by resume ID
export function getFilteredResumeData(resumeId) {
  const filteredInfo = podInfolist.filter(info => info.ResumeIndex == resumeId);
  const filteredSkills = podSkilllist.filter(skill => skill.ResumeIndex == resumeId);
  const filteredProjects = podProjectlist.filter(project => project.ResumeIndex == resumeId);
  const filteredWebsites = podWebsiteList.filter(website => website.ResumeIndex == resumeId);
  const filteredExperiences = podExperienceList.filter(exp => exp.ResumeIndex == resumeId);
  
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

  
  // const podImages = await loadImage();

  // for (let i in podImages){
  //   let items = getThingAll(podImages[i]);
  //   let itemListPromises = [];

  //   items.forEach( (item) => {
  //       itemListPromises.push(getFile(item.url, { fetch: fetch }))
  //       // deleteFile(item.url, { fetch: fetch})
  //   });
  //   console.log("Pod images loaded:", itemListPromises);
  // }

  // for (let i in podImages){
  //   for (let j in podImages[i].image){
  //         podImageList.push(podImages[i].image[j]);
  //   }
  // }




  alert("All info loaded.");

}


function EditResume() {
  const navigate = useNavigate();
  const [resumeTitle, setResumeTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Get current resume title and ID from sessionStorage
    const title = sessionStorage.getItem("current_resume_title");
    const resumeId = sessionStorage.getItem("current_resume_id");
    
    if (title && resumeId) {
      setResumeTitle(title);
    } else {
      // If no resume title, redirect back to profile
      alert("No resume selected. Please create or select a resume from your profile.");
      navigate("/profile");
      return;
    }
    
    loadResumeData()
      .then(() => setIsLoading(false))
      .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
      .then(() => updateResumeText(18))
      .then(() => console.log(podInfolist));
  }, [navigate]);

  const handleEditResume = () => {
    // Clear current resume from session
    sessionStorage.removeItem("current_resume_id");
    sessionStorage.removeItem("current_resume_title");

    updateInformation();
    
    // Navigate to profile
    navigate("/profile");
  };

  return (
      <div className="content">
        <div className="resume">
          <div className="tag-header">
            <h1>Editing: {resumeTitle}</h1>
            <button className="complete-button" onClick={handleEditResume}>
              Complete Resume
            </button>
          </div>

          {isLoading ? (
            <p style={{fontSize: '32px', color: '#666', textAlign: 'center', marginTop: '50px'}}>Loading resume...</p>
          ) : (
          <div className="tags-section">
            <div className="resume-section">
                <Link to="/config-perms">
                  <button className="student-button">Configure Permissions</button>
                </Link>

              <img src={null} alt="Profile" className="profile-image" id="ProfileImage"/>
              {/* Personal Information */}
              <div className="resume-section">
                <h2>Personal Information</h2>
                <p id="ProfessionalTitle"></p>
                <p id="Summary"></p>
                <p id="Email"></p>
                <p id="ContactNumber"></p>
                <p id="Location"></p>
                <p id="ProfessionalSummary"></p>
                <p id="Websites"></p>
              </div>

              {/* Education */}
              <div className="resume-section">
                <h2>Education</h2>
                <p id="Degree"></p>
                <p id="School"></p>
                <p id="Honors"></p>
                <p id="Program"></p>
                <p id="StartDate"></p>
                <p id="EndDate"></p>
                <p id="RelevantCourseWork"></p>
                <p id="ThesisTitle"></p>
              </div>

              {/* Websites */}
              <div className="resume-section">
                <h2>Websites</h2>
                <ul id="WebsitesList">
                  
                </ul>
              </div>

              {/* Skills */}
              <div className="resume-section">
                <h2>Skills</h2>
                <ul id="SkillsList">
                  
                </ul>
              </div>

              {/* Projects */}
              <div className="resume-section">
                <h2>Projects</h2>
                <ul id="ProjectsList">
                  
                </ul>
              </div>

              {/* Experience */}
              <div className="resume-section">
                <h2>Experience</h2>
                <ul id="ExperienceList">
                  
                </ul>
              </div>

              <Link to="/create-resume">
                <button className="student-button">Edit Resume</button>
              </Link>
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
                <button className="student-add-tag-button" onClick={updateWebsite}>
                  Update Website
                </button>
              </div>

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
                <button className="student-add-tag-button" onClick={updateSkill}>
                  Update Skill
                </button>
              </div>
            </div>

            <div className="resume-section">
              <h2>Projects</h2>

              <div className="projects">
                <h3 className="project-list">Project</h3>

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
                
                <button className="student-add-tag-button" onClick={updateProject}>
                  Update Project
                </button>
              </div>
            </div>

            <div className="resume-section">
              <h2>Experience</h2>

              <div className="projects">
                <h3 className="project-list">Experience</h3>

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
                <button className="student-add-tag-button" onClick={updateExperience}>
                  Update Experience
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
  );
}

export default EditResume;
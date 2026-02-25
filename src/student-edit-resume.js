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
let podInfolist = [];
let podSkilllist = [];
let podProjectlist = [];
let podWebsiteList = [];
let podExperienceList = [];
let podImageList = [];
let resumeIndexList = [];

export function updateInfoText(info) {

  let fullname = document.getElementById('FullName');
  let title = document.getElementById('ProfessionalTitle');
  let summary = document.getElementById('Summary');
  let email = document.getElementById('Email');
  let contact = document.getElementById('ContactNumber');
  let location = document.getElementById('Location'); 
  let profsummary = document.getElementById('ProfessionalSummary');
  let school = document.getElementById('School');
  let degree = document.getElementById('Degree');
  let honors = document.getElementById('Honors');
  let program = document.getElementById('Program');
  let startdate = document.getElementById('StartDate');
  let enddate = document.getElementById('EndDate');
  let coursework = document.getElementById('RelevantCourseWork');
  let thesistitle = document.getElementById('ThesisTitle');
  
  
  
  
  fullname.textContent = info.FullName;
  title.textContent = "Professional Title: " + info.ProfessionalTitle;
  summary.textContent = "Summary: " + info.Summary;
  email.textContent = "Email: " + info.Email;
  contact.textContent = "Contact Number: " + info.ContactNumber;
  location.textContent = "Location: " + info.Location;
  profsummary.textContent = "Professional Summary: " + info.ProfessionalSummary;
  school.textContent = "Institution: " + info.School;
  degree.textContent = "Degree: " + info.Degree;
  honors.textContent = "Honors: " + info.Honors;
  program.textContent = "Program: " + info.Program;
  startdate.textContent = "Start Date: " + info.StartDate;
  enddate.textContent = "End Date: " + info.EndDate;
  coursework.textContent = "Relevant Course Work: " + info.RelevantCourseWork;
  thesistitle.textContent = "Thesis Title: " + info.ThesisTitle;
}

export function updateSkillText(skill, num) {

  let skillsListElement = document.getElementById('SkillsList');
  const listItem = document.createElement('li');
  listItem.style.display = 'flex';
  listItem.style.alignItems = 'center';
  listItem.style.gap = '10px';
  
  const radioBtn = document.createElement('input');
  radioBtn.type = 'radio';
  radioBtn.name = 'skillSelect';
  radioBtn.value = skill.url;
  radioBtn.setAttribute('data-skill-url', skill.url);
  
  const label = document.createElement('span');
  label.textContent = skill.Skill;
  
  listItem.appendChild(radioBtn);
  listItem.appendChild(label);
  listItem.appendChild(document.createElement('br'));
  skillsListElement.appendChild(listItem);
}


export function updateProjectText(project, num) {
  let projectsListElement = document.getElementById('ProjectsList');
  const listItem = document.createElement('li');
  listItem.style.marginBottom = '15px';
  
  const radioBtn = document.createElement('input');
  radioBtn.type = 'radio';
  radioBtn.name = 'projectSelect';
  radioBtn.value = project.url;
  radioBtn.setAttribute('data-project-url', project.url);
  
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.alignItems = 'flex-start';
  content.style.gap = '10px';
  
  const projectInfo = document.createElement('div');
  projectInfo.innerHTML = `
  <strong>Title:</strong> ${project.ProjectName}<br />
  <strong>Summary:</strong> ${project.Summary}<br />
  <strong>Tools:</strong> ${project.Tools}<br />
  <strong>Project Link:</strong> ${project.ProjectLink}
  `;
  
  content.appendChild(radioBtn);
  content.appendChild(projectInfo);
  listItem.appendChild(content);

  projectsListElement.appendChild(listItem);
}

export function updateWebsiteText(website, num) {
  let websitesListElement = document.getElementById('WebsitesList');
  const listItem = document.createElement('li');
  listItem.style.display = 'flex';
  listItem.style.alignItems = 'center';
  listItem.style.gap = '10px';
  
  const radioBtn = document.createElement('input');
  radioBtn.type = 'radio';
  radioBtn.name = 'websiteSelect';
  radioBtn.value = website.url;
  radioBtn.setAttribute('data-website-url', website.url);
  
  const label = document.createElement('span');
  label.textContent = website.WebsiteLink;

  listItem.appendChild(radioBtn);
  listItem.appendChild(label);
  listItem.appendChild(document.createElement('br'));

  websitesListElement.appendChild(listItem);
}

export function updateExperienceText(experience, num) {
  let experiencesListElement = document.getElementById('ExperienceList');
  const listItem = document.createElement('li');
  listItem.style.marginBottom = '15px';
  
  const radioBtn = document.createElement('input');
  radioBtn.type = 'radio';
  radioBtn.name = 'experienceSelect';
  radioBtn.value = experience.url;
  radioBtn.setAttribute('data-experience-url', experience.url);
  
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.alignItems = 'flex-start';
  content.style.gap = '10px';
  
  const experienceInfo = document.createElement('div');
  experienceInfo.innerHTML = `
  <strong>Title:</strong> ${experience.PositionTitle}<br />
  <strong>Organization:</strong> ${experience.Organization}<br />
  <strong>Duration:</strong> ${experience.Duration}<br />
  <strong>Description:</strong> ${experience.Description}<br />
  <strong>Location:</strong> ${experience.ExperienceLocation}<br />
  `;
  
  content.appendChild(radioBtn);
  content.appendChild(experienceInfo);
  listItem.appendChild(content);
  listItem.appendChild(document.createElement('br'));
  experiencesListElement.appendChild(listItem);
}

export function updateImageText(image) {
  let imageElement = document.getElementById('ProfileImage');
  imageElement.src = URL.createObjectURL(image.ImageFile);
  console.log("Image URL: " + imageElement.src);
}

export function handleUpdateInformation() {
  const resumeId = sessionStorage.getItem("current_resume_id");
  
  // Find the information matching the current resume
  const info = podInfolist.find(i => i.ResumeIndex == resumeId);
  
  if (!info) {
    alert("No information found for this resume.");
    return;
  }
  
  // Call the original updateInformation function with the information URL
  console.log("Updating information with URL:", info.url);
  updateInformation(info.url);
}

export function handleUpdateSkill() {
  const skillInput = document.getElementById('Skill').value;
  
  if (!skillInput.trim()) {
    alert("Please enter a skill.");
    return;
  }
  
  // Get the selected skill radio button
  const selectedSkill = document.querySelector('input[name="skillSelect"]:checked');
  
  if (!selectedSkill) {
    alert("Please select a skill to update.");
    return;
  }
  
  const skillUrl = selectedSkill.value;
  
  // Call the original updateSkill function with the skill URL
  console.log("Updating skill with URL:", skillUrl);
  updateSkill(skillUrl);
}

export function handleUpdateProject() {
  // Get the selected project radio button
  const selectedProject = document.querySelector('input[name="projectSelect"]:checked');
  
  if (!selectedProject) {
    alert("Please select a project to update.");
    return;
  }
  
  const projectUrl = selectedProject.value;
  
  // Call the original updateProject function with the project URL
  console.log("Updating project with URL:", projectUrl);
  updateProject(projectUrl);
}

export function handleUpdateExperience() {
  // Get the selected experience radio button
  const selectedExperience = document.querySelector('input[name="experienceSelect"]:checked');
  
  if (!selectedExperience) {
    alert("Please select an experience to update.");
    return;
  }
  
  const experienceUrl = selectedExperience.value;
  
  // Call the original updateExperience function with the experience URL
  console.log("Updating experience with URL:", experienceUrl);
  updateExperience(experienceUrl);
}

export function handleUpdateWebsite() {
  // Get the selected website radio button
  const selectedWebsite = document.querySelector('input[name="websiteSelect"]:checked');
  
  if (!selectedWebsite) {
    alert("Please select a website to update.");
    return;
  }
  
  const websiteUrl = selectedWebsite.value;
  
  // Call the original updateWebsite function with the website URL
  console.log("Updating website with URL:", websiteUrl);
  updateWebsite(websiteUrl);
}

export function updateResumeText(indexToCheck) {
  
  let skillsListElement = document.getElementById('SkillsList');
  skillsListElement.innerHTML = '';
  let projectsListElement = document.getElementById('ProjectsList');
  projectsListElement.innerHTML = '';
  let websitesListElement = document.getElementById('WebsitesList');
  websitesListElement.innerHTML = '';
  let experiencesListElement = document.getElementById('ExperienceList');
  experiencesListElement.innerHTML = '';

  for (let i in podInfolist){
      console.log("Index To Check:", indexToCheck);
      console.log("Pod Info Index:", podInfolist[i].ResumeIndex);
    if (podInfolist[i].ResumeIndex == indexToCheck){
      updateInfoText(podInfolist[i]);
      break
    }
  }

  for (let i in podSkilllist){
    if (podSkilllist[i].ResumeIndex == indexToCheck){
      updateSkillText(podSkilllist[i], i);
    }
  }

  for (let i in podProjectlist){
    if (podProjectlist[i].ResumeIndex == indexToCheck){
      updateProjectText(podProjectlist[i], i);
    }
  }
  
  for (let i in podWebsiteList){
    if (podWebsiteList[i].ResumeIndex == indexToCheck){
      updateWebsiteText(podWebsiteList[i], i);
    }
  }
  
  for (let i in podExperienceList){
    if (podExperienceList[i].ResumeIndex == indexToCheck){
      updateExperienceText(podExperienceList[i], i);
    }
  }
  
  // for (let i in podInfolist){
  //   if (podInfolist[i].ResumeIndex == resumeIndex){
  //     console.log(podInfolist[i].ResumeImage, podImageList[i].image.name)
  //     if (podImageList[i].ResumeImage == podImageList[i].image.name){
  //       updateImageText(podImageList[i]);
  //     }
  //     break
  //   }
  // }
}

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
      .then(() => updateResumeText(sessionStorage.getItem("current_resume_id")))
      .then(() => console.log(sessionStorage.getItem("current_resume_id")));
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
                <p id="FullName"></p>
                <p id="ProfessionalTitle"></p>
                <p id="Summary"></p>
                <p id="Email"></p>
                <p id="ContactNumber"></p>
                <p id="Location"></p>
                <p id="ProfessionalSummary"></p>
              </div>

              {/* Education */}
              <div className="resume-section">
                <h2>Education</h2>
                <p id="School"></p>
                <p id="Degree"></p>
                <p id="Program"></p>
                <p id="StartDate"></p>
                <p id="EndDate"></p>
                <p id="Honors"></p>
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
                <button className="student-add-tag-button" onClick={handleUpdateWebsite}>
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
              <button className="student-add-tag-button" onClick={handleUpdateInformation}>
                Update Information
              </button>
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
                <button className="student-add-tag-button" onClick={handleUpdateSkill}>
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
                
                <button className="student-add-tag-button" onClick={handleUpdateProject}>
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
                <button className="student-add-tag-button" onClick={handleUpdateExperience}>
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
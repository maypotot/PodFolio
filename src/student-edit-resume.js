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
  
  
  
  
  fullname.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>${info.FullName}</span><br /><input id='FullName' class='resume-input' type='text' value='${info.FullName}' />`;
  title.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Professional Title: ${info.ProfessionalTitle}</span><br /><input id='ProfessionalTitle' class='resume-input' type='text' value='${info.ProfessionalTitle}' />`;
  summary.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Summary: ${info.Summary}</span><br /><textarea id='Summary' class='resume-input' rows='5'>${info.Summary}</textarea>`;
  email.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Email: ${info.Email}</span><br /><input id='Email' class='resume-input' type='text' value='${info.Email}' />`;
  contact.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Contact Number: ${info.ContactNumber}</span><br /><input id='ContactNumber' class='resume-input' type='text' value='${info.ContactNumber}' />`;
  location.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Location: ${info.Location}</span><br /><input id='Location' class='resume-input' type='text' value='${info.Location}' />`;
  profsummary.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Professional Summary: ${info.ProfessionalSummary}</span><br /><input id='ProfessionalSummary' class='resume-input' type='text' value='${info.ProfessionalSummary}' />`;
  school.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Institution: ${info.School}</span><br /><input id='School' class='resume-input' type='text' value='${info.School}' />`;
  degree.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Degree: ${info.Degree}</span><br /><input id='Degree' class='resume-input' type='text' value='${info.Degree}' />`;
  honors.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Honors: ${info.Honors}</span><br /><input id='Honors' class='resume-input' type='text' value='${info.Honors}' />`;
  program.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Program: ${info.Program}</span><br /><input id='Program' class='resume-input' type='text' value='${info.Program}' />`;
  startdate.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Start Date: ${info.StartDate}</span><br /><input id='StartDate' class='resume-input' type='text' value='${info.StartDate}' />`;
  enddate.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>End Date: ${info.EndDate}</span><br /><input id='EndDate' class='resume-input' type='text' value='${info.EndDate}' />`;
  coursework.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Relevant Course Work: ${info.RelevantCourseWork}</span><br /><input id='RelevantCoursework' class='resume-input' type='text' value='${info.RelevantCourseWork}' />`;
  thesistitle.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>Thesis Title: ${info.ThesisTitle}</span><br /><input id='ThesisTitle' class='resume-input' type='text' value='${info.ThesisTitle}' />`;
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

  const label = document.createElement('span');
  label.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>${skill.Skill}</span>`;

  listItem.appendChild(radioBtn);
  listItem.appendChild(label);
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

  const projectInfo = document.createElement('div');
  projectInfo.innerHTML = `
    <span style='font-weight: bold; font-size: 1.2rem;'>Title:</span> ${project.ProjectName}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Summary:</span> ${project.Summary}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Tools:</span> ${project.Tools}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Project Link:</span> ${project.ProjectLink}
  `;

  listItem.appendChild(radioBtn);
  listItem.appendChild(projectInfo);
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

  const label = document.createElement('span');
  label.innerHTML = `<span style='font-weight: bold; font-size: 1.2rem;'>${website.WebsiteLink}</span>`;

  listItem.appendChild(radioBtn);
  listItem.appendChild(label);
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

  const experienceInfo = document.createElement('div');
  experienceInfo.innerHTML = `
    <span style='font-weight: bold; font-size: 1.2rem;'>Title:</span> ${experience.PositionTitle}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Organization:</span> ${experience.Organization}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Duration:</span> ${experience.Duration}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Description:</span> ${experience.Description}<br />
    <span style='font-weight: bold; font-size: 1.2rem;'>Location:</span> ${experience.ExperienceLocation}
  `;

  listItem.appendChild(radioBtn);
  listItem.appendChild(experienceInfo);
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

    const currentResumeId = sessionStorage.getItem("current_resume_id");
    console.log("Current Resume ID:", currentResumeId);
    console.log("Current Info List:", podInfolist);
    const currentInfo = podInfolist.find(info => info.ResumeIndex == currentResumeId);

    if (currentInfo) {
      console.log("Current Info URL:", currentInfo.url);
    } else {
      console.warn("No information found for the current resume ID.");
    }
    updateInformation(currentInfo.url).then(() => {
      sessionStorage.removeItem("current_resume_id");
      sessionStorage.removeItem("current_resume_title");
      navigate("/profile");
    })


    
    // Navigate to profile
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

              {/* Skills */}
              <div className="resume-section">
                <h2>Skills</h2>
                <ul id="SkillsList">
                  
                </ul>
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

              {/* Projects */}
              <div className="resume-section">
                <h2>Projects</h2>
                <ul id="ProjectsList">
                  
                </ul>
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

              {/* Experience */}
              <div className="resume-section">
                <h2>Experience</h2>
                <ul id="ExperienceList">
                  
                </ul>
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
          )}
        </div>
      </div>
  );
}

export default EditResume;
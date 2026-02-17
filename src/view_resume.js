import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import resumeData from "./sample_resume.json"; // import the JSON file
import "./main.css";
import { restoreSession } from "./solid.js";
import { getThingAll, getFile } from "@inrupt/solid-client";

import { 
  loadInformation,
  loadExperience,
  loadImage,
  loadProject,
  loadWebsite,
  loadSkill
 } from "./solid.js";
import { 
  deleteInformation,
  deleteExperience,
  deleteSkill,
  deleteProject,
  deleteWebsite
 } from "./main.js";

let podInfolist = [];
let podSkilllist = [];
let podProjectlist = [];
let podWebsiteList = [];
let podExperienceList = [];
let podImageList = [];
let resumeIndexList = [];
let resumeIndex = 1;

function updateInfoText(info) {

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

function deleteResume(e) {
  for (let i in podInfolist){
    if (podInfolist[i].ResumeIndex == resumeIndex){
      deleteInformation(podInfolist[i].url);
    }
  }
}

function deleteExperienceButton(e) {
  const buttonId = e.target.id;

  for (let i in podExperienceList){
    if (i === buttonId){
      deleteExperience(podExperienceList[i].url);
    }
  }
}


function deleteSkillsButton(e) {
  const buttonId = e.target.id;

  for (let i in podSkilllist){
    if (i === buttonId){
      deleteSkill(podSkilllist[i].url);
    }
  }
}

function deleteWebsiteButton(e) {
  const buttonId = e.target.id;

  for (let i in podWebsiteList){
    if (i === buttonId){
      deleteWebsite(podWebsiteList[i].url);
    }
  }
}

function deleteProjectButton(e) {
  const buttonId = e.target.id;

  for (let i in podProjectlist){
    if (i === buttonId){
      deleteProject(podProjectlist[i].url);
    }
  }
}

function updateSkillText(skill, num) {

  let skillsListElement = document.getElementById('SkillsList');
  const listItem = document.createElement('li');
  listItem.textContent = skill.Skill;
  skillsListElement.appendChild(listItem);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Skill';
  deleteBtn.id = num;
  deleteBtn.onclick = deleteSkillsButton;
  
  listItem.appendChild(deleteBtn);
  listItem.appendChild(document.createElement('br'));
}


function updateProjectText(project, num) {
  let projectsListElement = document.getElementById('ProjectsList');
  const listItem = document.createElement('li');
  listItem.innerHTML = `
  <strong>Title:</strong> ${project.ProjectName}<br />
  <strong>Summary:</strong> ${project.Summary}<br />
  <strong>Tools:</strong> ${project.Tools}<br />
  <strong>Project Link:</strong> ${project.ProjectLink}
  `;

  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Project';
  deleteBtn.id = num;
  deleteBtn.onclick = deleteProjectButton;
  
  listItem.appendChild(deleteBtn);

  projectsListElement.appendChild(listItem);
}

function updateWebsiteText(website, num) {
  let websitesListElement = document.getElementById('WebsitesList');
  const listItem = document.createElement('li');
  listItem.textContent = website.WebsiteLink;

  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Website';
  deleteBtn.id = num;
  deleteBtn.onclick = deleteWebsiteButton;
  
  listItem.appendChild(deleteBtn);
  listItem.appendChild(document.createElement('br'));

  websitesListElement.appendChild(listItem);
}

function updateExperienceText(experience, num) {
  let experiencesListElement = document.getElementById('ExperienceList');
  const listItem = document.createElement('li');
  listItem.innerHTML = `
  <strong>Title:</strong> ${experience.PositionTitle}<br />
  <strong>Organization:</strong> ${experience.Organization}<br />
  <strong>Duration:</strong> ${experience.Duration}<br />
  <strong>Description:</strong> ${experience.Description}<br />
  <strong>Location:</strong> ${experience.ExperienceLocation}<br />
  `;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Experience';
  deleteBtn.id = num;
  deleteBtn.onclick = deleteExperienceButton;
  
  listItem.appendChild(deleteBtn);
  listItem.appendChild(document.createElement('br'));
  experiencesListElement.appendChild(listItem);
}

function updateImageText(image) {
  let imageElement = document.getElementById('ProfileImage');
  imageElement.src = URL.createObjectURL(image.ImageFile);
  console.log("Image URL: " + imageElement.src);
}

function updateResumeText() {

  let skillsListElement = document.getElementById('SkillsList');
  skillsListElement.innerHTML = '';
  let projectsListElement = document.getElementById('ProjectsList');
  projectsListElement.innerHTML = '';
  let websitesListElement = document.getElementById('WebsitesList');
  websitesListElement.innerHTML = '';
  let experiencesListElement = document.getElementById('ExperienceList');
  experiencesListElement.innerHTML = '';

  for (let i in podInfolist){
    if (podInfolist[i].ResumeIndex == resumeIndex){
      updateInfoText(podInfolist[i]);
      break
    }
  }

  for (let i in podSkilllist){
    if (podSkilllist[i].ResumeIndex == resumeIndex){
      updateSkillText(podSkilllist[i], i);
    }
  }

  for (let i in podProjectlist){
    if (podProjectlist[i].ResumeIndex == resumeIndex){
      updateProjectText(podProjectlist[i], i);
    }
  }
  
  for (let i in podWebsiteList){
    if (podWebsiteList[i].ResumeIndex == resumeIndex){
      updateWebsiteText(podWebsiteList[i], i);
    }
  }
  
  for (let i in podExperienceList){
    if (podExperienceList[i].ResumeIndex == resumeIndex){
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

async function loadResumeData() {

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
  
  const podImages = await loadImage();

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

  console.log("Resume Index List:", resumeIndexList);
  resumeIndex = resumeIndexList[0] || 1;


  updateResumeText();

  alert("All info loaded.");

}

function nextResume() {
  const currentIndex = resumeIndexList.indexOf(resumeIndex);

  if (currentIndex === -1 || currentIndex >= resumeIndexList.length - 1) {
    alert("No more resumes to display.");
    return;
  }

  resumeIndex = resumeIndexList[currentIndex + 1];
  updateResumeText();
}

function previousResume() {
  const currentIndex = resumeIndexList.indexOf(resumeIndex);

  if (currentIndex <= 0) {
    alert("No more resumes to display.");
    return;
  }

  resumeIndex = resumeIndexList[currentIndex - 1];
  updateResumeText();
}



function ViewResume() {
  useEffect(() => {
    loadResumeData();
  }, []);

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
            <ul id="buttons">
              <button onClick={previousResume}>Previous Resume</button>
              <button onClick={nextResume}>Next Resume</button>
              <button onClick={deleteResume}>Delete Resume</button>
            </ul>
            <Link to="/config-perms">
              <button className="complete-button">Configure Permissions</button>
            </Link>
          </div>
            <h1 className="full-name" id="FullName">{resumeData.name}</h1>

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
            <button className="complete-button">Edit Resume</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ViewResume;

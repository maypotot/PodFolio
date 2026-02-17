import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import resumeData from "./sample_resume.json"; // import the JSON file
import "./main.css";

import { 
  loadInformation,
  loadAward,
  loadExperience,
  loadImage,
  loadReference,
  loadProject,
  loadTraining,
  loadWebsite,
  loadSkill
 } from "./solid.js";
import { 
  appendInformation,
  appendAward,
  appendExperience,
  appendReference,
  appendProject,
  appendTraining
 } from "./main.js";

async function loadResumeData() {
  const information = await loadInformation();


  const info = information[0];


  
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


  
  const skills = await loadSkill();
  
  const skillsListElement = document.getElementById('SkillsList');
  skillsListElement.innerHTML = ''; // Clear existing list items
  for (const skill of skills) {
    const listItem = document.createElement('li');
    listItem.textContent = skill.Skill;
    skillsListElement.appendChild(listItem);
  }
  alert("All info loaded.");

}


function ViewResume() {

  return (
    <main className="main-feed">
        <div className="resume">
            <h1>Resume Preview</h1>
            <button className="student-button" onClick={loadResumeData}>Reload Resume</button>
            <Link to="/config-perms">
              <button className="student-button">Configure Permissions</button>
            </Link>
            <h1 className="full-name" id="FullName">{resumeData.name}</h1>

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
            <p id="Degree"><strong>Degree:</strong> {resumeData.education.degree}</p>
            <p id="School"><strong>Institution:</strong> {resumeData.education.institution}</p>
            <p id="Honors"></p>
            <p id="Program"></p>
            <p id="StartDate"></p>
            <p id="EndDate"></p>
            <p id="RelevantCourseWork"></p>
            <p id="ThesisTitle"></p>
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
            <button className="student-button">Edit Resume</button>
          </Link>
        </div>
      
    </main>
  );
}

export default ViewResume;
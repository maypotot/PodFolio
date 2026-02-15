import React from "react";
import { Link } from "react-router-dom";
import "./main.css"; 

import { restoreSession } from "./solid.js";

import { 
  loadInformation,
  loadAward,
  loadExperience,
  loadImage,
  loadReference,
  loadProject,
  loadTraining,
 } from "./solid.js";

import { 
  createInformation,
  createWebsite,
  createProject,
  createExperience,
  createSkill,
  createImage,
 } from "./main.js";
 
function uploadResume(experience) {
  createImage()
  createInformation()
}

const user = await restoreSession();

function CreateResume() {
  return (
    <main className= "create-resume">
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
            <button className="header-buttons">
                <img src="/notifications-icon.png" alt="Notifications" className="button-icons"/>
            </button>
            <button className="header-buttons">
                <img src="/settings-icon.png" alt="Settings" className="button-icons"/>
            </button>
        </div>
      </header>
      <div className="content">
        <div className="resume">
            <div className="tag-header">
              <h1>New Resume</h1>
              <Link to="/view-resume"> 
              <button className="complete-button" onClick={uploadResume}>Complete Resume</button>
              </Link>
            </div>
            <div className="tags-section">

              <div className="resume-section">
                <h2>Personal Information</h2>

                <div className="resume-field">
                  <h3 className="tag-title">Name</h3>
                  <input
                    type="text"
                    placeholder="Juan de la Cruz"
                    className = "resume-input"
                    id = "FullName"
                  />
                </div>
                
                <div className="resume-field">
                  <h3 className="tag-title">Professional Title</h3>
                  <input
                    type="text"
                    placeholder="Dr."
                    className = "resume-input"
                    id = "ProfessionalTitle"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Summary</h3>
                  <textarea
                    type="text"
                    placeholder="Summary of your profile"
                    className = "resume-input"
                      rows={5}
                    id = "Summary"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Email</h3>
                  <input
                    type="text"
                    placeholder="juandelacruz@gmail.com"
                    className = "resume-input"
                    id = "Email"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Contact Number</h3>
                  <input
                    type="text"
                    placeholder="09171234567"
                    className = "resume-input"
                    id = "ContactNumber"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Location</h3>
                  <input
                    type="text"
                    placeholder="Quezon City, Philippines"
                    className = "resume-input"
                    id = "Location"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Profile Image</h3>
                  <input
                    type="file"
                    accept="image/*"
                    className = "resume-input"
                    id = "ImageFile"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Website</h3>
                  <input
                    type="text"
                    placeholder="github.com"
                    className = "resume-input"
                    id = "WebsiteLink"
                  />
                  <button className="add-tag-button" onClick={createWebsite}> Add Website</button>
                </div>

                
                <div className="resume-field">
                  <h3 className="tag-title">Professional Summary</h3>
                  <textarea
                    type="text"
                    placeholder="Professional summary goes here"
                    className = "resume-input"
                      rows={5}
                    id = "ProfessionalSummary"
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
                    className = "resume-input"
                    id = "School"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Degree</h3>
                  <input
                    type="text"
                    placeholder="BS Computer Science"
                    className = "resume-input"
                    id = "Degree"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Program</h3>
                  <input
                    type="text"
                    placeholder="BS Computer Science"
                    className = "resume-input"
                    id = "Program"
                  />
                </div>
                
                <div className="resume-field">
                  <h3 className="tag-title">Start Date</h3>
                  <input
                    type="text"
                    placeholder="January 2016"
                    className = "resume-input"
                    id = "StartDate"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">End Date</h3>
                  <input
                    type="text"
                    placeholder="January 2020"
                    className = "resume-input"
                    id = "EndDate"
                  />
                </div>
                
                <div className="resume-field">
                  <h3 className="tag-title">Relevant Coursework</h3>
                  <input
                    type="text"
                    placeholder="Link to coursework or list here"
                    className = "resume-input"
                    id = "RelevantCoursework"
                  />
                </div>


                <div className="resume-field">
                  <h3 className="tag-title">Honors/Awards</h3>
                  <input
                    type="text"
                    placeholder="Summa Cum Laude"
                    className = "resume-input"
                    id = "Honors"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Thesis Title</h3>
                  <input
                    type="text"
                    placeholder="Title of your thesis"
                    className = "resume-input"
                    id = "ThesisTitle"
                  />
                </div>

                <div className="resume-field-2">
                  <h2>Skills</h2>
                  <input
                    type="text"
                    placeholder="Javascript"
                    className = "skills-input"
                    id = "Skill"
                  />

                  <button className="add-tag-button" onClick={createSkill}> Add Skill</button>
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
                      className = "resume-input"
                      id = "ProjectName"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Tools</h3>
                    <input
                      type="text"
                      placeholder="Python, React"
                      className = "resume-input"
                      id = "Tools"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Project Description</h3>
                    <textarea
                      placeholder="Insert project Description here"
                      className="resume-description"
                      rows={5}
                      id = "ProjectSummary"
                    />
                  </div>
                  
                  <div className="resume-field">
                    <h3 className="tag-title">Project Link</h3>
                    <textarea
                      placeholder="Insert project Link here"
                      className="resume-description"
                      rows={5}
                      id = "ProjectLink"
                    />
                  </div>
                  
                  <button className="add-tag-button" onClick={createProject}> Add Project</button>

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
                      className = "resume-input"
                      id = "PositionTitle"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Duration</h3>
                    <input
                      type="text"
                      placeholder="May 2022 - December 2022"
                      className = "resume-input"
                      id = "Duration"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Company Name</h3>
                    <input
                      type="text"
                      placeholder="Accenture"
                      className = "resume-input"
                      id = "Organization"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Location</h3>
                    <input
                      type="text"
                      placeholder="Quezon City"
                      className = "resume-input"
                      id= "ExperienceLocation"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Responsibilities/Accomplishments</h3>
                    <textarea
                      placeholder="Insert responsibilities and accomplishments here"
                      className="resume-description"
                      rows={5}
                      id = "Description"
                    />
                  </div>
                  <button className="add-tag-button" onClick={createExperience}> Add Experience</button>
                </div>

              </div>

            </div>

           
        </div>
    
      </div>
    </main>
  );
}


export default CreateResume;



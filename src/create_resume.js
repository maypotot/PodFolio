import React from "react";
import { Link } from "react-router-dom";
import "./main.css"; 

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
              <button className="complete-button">Complete Resume</button>
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
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Email</h3>
                  <input
                    type="text"
                    placeholder="juandelacruz@gmail.com"
                    className = "resume-input"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Contact Number</h3>
                  <input
                    type="text"
                    placeholder="09998887777"
                    className = "resume-input"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Location</h3>
                  <input
                    type="text"
                    placeholder="Quezon City, Philippines"
                    className = "resume-input"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Website</h3>
                  <input
                    type="text"
                    placeholder="github.com"
                    className = "resume-input"
                  />
                  <input
                    type="text"
                    placeholder="facebook.com"
                    className = "resume-input"
                  />
                  <input
                    type="text"
                    placeholder="linkedin.com"
                    className = "resume-input"
                  />
                </div>

              </div>

              <div className="resume-section">
                <h2>Education</h2>

                <div className="resume-field">
                  <h3 className="tag-title">Degree</h3>
                  <input
                    type="text"
                    placeholder="BS Computer Science"
                    className = "resume-input"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Academic Institution</h3>
                  <input
                    type="text"
                    placeholder="University of the Philippines Diliman"
                    className = "resume-input"
                  />
                </div>

                <div className="resume-field">
                  <h3 className="tag-title">Honors/Awards</h3>
                  <input
                    type="text"
                    placeholder="Summa Cum Laude"
                    className = "resume-input"
                  />
                </div>

                <div className="resume-field-2">
                  <h2>Skills</h2>
                  <input
                    type="text"
                    placeholder="Javascript"
                    className = "skills-input"
                  />
                  <input
                    type="text"
                    placeholder="Phython"
                    className = "skills-input"
                  />
                  <input
                    type="text"
                    placeholder="SQL"
                    className = "skills-input"
                  />

                  <button className="add-tag-button"> Add Skill</button>
                </div>

              </div>


              <div className="resume-section">
                <h2>Projects</h2>

                <div className="projects">
                  <h3 className="project-list">Project 1</h3>

                  <div className="resume-field">
                    <h3 className="tag-title">Project Title</h3>
                    <input
                      type="text"
                      placeholder="Snake Game"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Date Created</h3>
                    <input
                      type="text"
                      placeholder="May 2022"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Project Description</h3>
                    <textarea
                      placeholder="Insert project Description here"
                      className="resume-description"
                      rows={5}
                    />
                  </div>
                </div>

                <div className="projects">
                  <h3 className="project-list">Project 2</h3>

                  <div className="resume-field">
                    <h3 className="tag-title">Project Title</h3>
                    <input
                      type="text"
                      placeholder="Snake Game"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Date Created</h3>
                    <input
                      type="text"
                      placeholder="May 2022"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Project Description</h3>
                    <textarea
                      placeholder="Insert project Description here"
                      className="resume-description"
                      rows={5}
                    />
                  </div>
                </div>

              </div>

              <div className="resume-section">
                <h2>Experience</h2>

                <div className="projects">
                  <h3 className="project-list">Experience 1</h3>

                  <div className="resume-field">
                    <h3 className="tag-title">Job Title</h3>
                    <input
                      type="text"
                      placeholder="Project Manager"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Duration</h3>
                    <input
                      type="text"
                      placeholder="May 2022 - December 2022"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Company Name</h3>
                    <input
                      type="text"
                      placeholder="Accenture"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Location</h3>
                    <input
                      type="text"
                      placeholder="Quezon City"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Responsibilities/Accomplishments</h3>
                    <textarea
                      placeholder="Insert responsibilities and accomplishments here"
                      className="resume-description"
                      rows={5}
                    />
                  </div>
                </div>

                <div className="projects">
                  <h3 className="project-list">Experience 2</h3>

                  <div className="resume-field">
                    <h3 className="tag-title">Job Title</h3>
                    <input
                      type="text"
                      placeholder="Project Manager"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Duration</h3>
                    <input
                      type="text"
                      placeholder="May 2022 - December 2022"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Company Name</h3>
                    <input
                      type="text"
                      placeholder="Accenture"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Location</h3>
                    <input
                      type="text"
                      placeholder="Quezon City"
                      className = "resume-input"
                    />
                  </div>

                  <div className="resume-field">
                    <h3 className="tag-title">Responsibilities/Accomplishments</h3>
                    <textarea
                      placeholder="Insert responsibilities and accomplishments here"
                      className="resume-description"
                      rows={5}
                    />
                  </div>
                </div>

              </div>

            </div>

           
        </div>
    
      </div>
    </main>
  );
}


export default CreateResume;



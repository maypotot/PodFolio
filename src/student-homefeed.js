
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  load
 } from "./solid.js";
import { 
  appendInformation,
  appendAward,
  appendExperience,
  appendReference,
  appendProject,
  appendTraining
 } from "./main.js";

async function restoreInfo() {
  const information = await loadInformation();

  for (const info of information) {
      console.log("Restoring info:", info);
      appendInformation(info);
  }

  const experience = await loadExperience();

  for (const exp of experience) {
      appendExperience(exp);
  }

  const projects = await loadProject();

  for (const proj of projects) {
      appendProject(proj);
  }

  const awards = await loadAward();

  for (const award of awards) {
      appendAward(award);
  }

  const trainings = await loadTraining();

  for (const training of trainings) {
      appendTraining(training);
  }

  const references = await loadReference();

  for (const reference of references) {
      appendReference(reference);
  }
}

function HomeFeed() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/jobs/");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    }
    fetchJobs();
  }, []);

  return (
    <StudentLayout>
      <div className="main-feed">
        <h1>Job Listings</h1>
        <button className="add-tag-button" onClick={restoreInfo}>Refresh Info</button>
        <Link to="/view-resume">
          <button className="add-tag-button">View Resume</button>
        </Link>
          
        <ul id="information"></ul>
        <ul id="experience"></ul>
        <ul id="projects"></ul>
        <ul id="awards"></ul>
        <ul id="trainings"></ul>
        <ul id="references"></ul>
        <ul id="images"></ul>

        {jobs.length === 0 ? (
          <p>No job listings available.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="job-listing">
              <img src={job.company_logo || "/Figma.png"} className="company-image"/>
              <div className="job-info">
                <h2>{job.title}</h2>
                <h4>{job.company}</h4>
                <p className="job-description">{job.description}</p>
                <Link to="#" className="apply-link">Apply Now</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </StudentLayout>
  );
}

export default HomeFeed;
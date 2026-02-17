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
  for (const exp of experience) { appendExperience(exp); }
  const projects = await loadProject();
  for (const proj of projects) { appendProject(proj); }
  const awards = await loadAward();
  for (const award of awards) { appendAward(award); }
  const trainings = await loadTraining();
  for (const training of trainings) { appendTraining(training); }
  const references = await loadReference();
  for (const reference of references) { appendReference(reference); }
}

function HomeFeed() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/jobs/");
        const data = await res.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    }
    fetchJobs();
  }, []);

  // Filter jobs whenever search query or active tag changes
  useEffect(() => {
    const query = activeTag || searchQuery.trim().toLowerCase();

    if (!query) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter(job => {
      if (!job.tags || job.tags.length === 0) return false;
      return job.tags.some(tag =>
        tag.tag_name.toLowerCase().includes(query)
      );
    });

    setFilteredJobs(filtered);
  }, [searchQuery, activeTag, jobs]);

  function handleSearch(e) {
    e.preventDefault();
    // useEffect handles the filtering reactively
  }

  function handleTagClick(tagName) {
    if (activeTag === tagName) {
      // Clicking the same tag deselects it
      setActiveTag("");
      setSearchQuery("");
    } else {
      setActiveTag(tagName);
      setSearchQuery(tagName);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setActiveTag("");
  }

  // Collect all unique tags from all jobs for suggestions
  const allTags = [...new Set(
    jobs.flatMap(job => job.tags ? job.tags.map(t => t.tag_name) : [])
  )].sort();

  const isFiltering = searchQuery.trim() !== "" || activeTag !== "";

  return (
    <StudentLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} clearSearch={clearSearch}>
      <div className="main-feed">
        <div className="feed-header">
          <h1>Job Listings</h1>
          <div className="feed-actions">
            <button className="student-add-tag-button" onClick={restoreInfo}>Refresh Info</button>
            <Link to="/view-resume">
              <button className="student-add-tag-button">View Resume</button>
            </Link>
          </div>
        </div>

        {/* Resume data lists */}
        <ul id="information"></ul>
        <ul id="experience"></ul>
        <ul id="projects"></ul>
        <ul id="awards"></ul>
        <ul id="trainings"></ul>
        <ul id="references"></ul>
        <ul id="images"></ul>

        {/* Search results indicator */}
        {isFiltering && (
          <div className="search-results-info">
            {filteredJobs.length > 0 ? (
              <p>
                Showing <strong>{filteredJobs.length}</strong> job{filteredJobs.length !== 1 ? "s" : ""} matching{" "}
                <span className="search-tag-highlight">"{searchQuery}"</span>
                <button className="clear-search-inline" onClick={clearSearch}>✕ Clear</button>
              </p>
            ) : (
              <p>
                No jobs found for <span className="search-tag-highlight">"{searchQuery}"</span>
                <button className="clear-search-inline" onClick={clearSearch}>✕ Clear</button>
              </p>
            )}
          </div>
        )}

        {/* Tag suggestions (shown when not filtering) */}
        {!isFiltering && allTags.length > 0 && (
          <div className="tag-suggestions">
            <p className="tag-suggestions-label">Browse by skill:</p>
            <div className="tag-suggestion-chips">
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  className="tag-suggestion-chip"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active tag filter chips (shown when filtering) */}
        {isFiltering && allTags.length > 0 && (
          <div className="tag-suggestions">
            <p className="tag-suggestions-label">Filter by skill:</p>
            <div className="tag-suggestion-chips">
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  className={`tag-suggestion-chip ${activeTag === tag ? "tag-suggestion-chip--active" : ""}`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Job listings */}
        {filteredJobs.length === 0 && !isFiltering ? (
          <p>No job listings available.</p>
        ) : filteredJobs.length === 0 && isFiltering ? (
          <div className="no-results">
            <p>No jobs match your search. Try a different skill or interest.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="job-listing">
              <img src={job.company_logo || "/Figma.png"} alt="Company" className="company-image"/>
              <div className="job-info">
                <h2>{job.title}</h2>
                <h4>{job.company}</h4>
                <p className="job-description">{job.description}</p>
                <p className="job-meta">
                  <strong>Location:</strong> {job.location} | <strong>Type:</strong> {job.employment_type}
                </p>
                {job.proposed_salary && (
                  <p className="job-meta">
                    <strong>Salary:</strong> {job.proposed_salary}
                  </p>
                )}

                {/* Job tags - clickable to filter */}
                {job.tags && job.tags.length > 0 && (
                  <div className="job-tags">
                    {job.tags.map((tag, index) => (
                      <button
                        key={index}
                        className={`job-tag-clickable ${activeTag === tag.tag_name ? "job-tag-clickable--active" : ""}`}
                        onClick={() => handleTagClick(tag.tag_name)}
                        title={`Filter by ${tag.tag_name}`}
                      >
                        {tag.tag_name}
                      </button>
                    ))}
                  </div>
                )}

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
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"; 
import StudentLayout from "./student-layout.js";


function HomeFeed() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const navigate = useNavigate();

  // Application modal state
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [applying, setApplying] = useState(false);

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

  useEffect(() => {
    async function fetchResumes() {
      try {
        const webid = sessionStorage.getItem("webid");
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];
          const res = await fetch(
            `http://127.0.0.1:8000/api/resumes/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (res.ok) {
            const data = await res.json();
            setResumes(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resumes:", error);
      }
    }
    fetchResumes();
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
  }

  function handleTagClick(tagName) {
    if (activeTag === tagName) {
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

  function handleApplyClick(job) {
    if (resumes.length === 0) {
      alert("You need to create a resume first. Go to your profile to create one.");
      navigate("/profile");
      return;
    }
    setSelectedJob(job);
    setSelectedResumeId(null);
    setShowApplicationModal(true);
  }

  async function handleSubmitApplication() {
    if (!selectedResumeId) {
      alert("Please select a resume");
      return;
    }

    setApplying(true);
    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];

      // Get the selected resume's pod_url
      const selectedResume = resumes.find(r => r.id === parseInt(selectedResumeId));

      sessionStorage.setItem("current_resume_id", selectedResume.id);
      sessionStorage.setItem("current_resume_title", selectedResume.title);
      sessionStorage.setItem("current_employer_webid", selectedJob.employer_webid);
      
      const response = await fetch("http://127.0.0.1:8000/api/jobs/apply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: selectedJob.id,
          applicant_webid: webidWithoutFragment,
          resume_pod_url: selectedResume.pod_url,
          resume_id: selectedResume.id  // ← ADDED: Include resume_id
        }),
      });

      if (response.ok) {
        const application = await response.json();
        
        // Store application info for config-perms page
        sessionStorage.setItem("current_application_id", application.id);
        sessionStorage.setItem("current_job_title", selectedJob.title);
        sessionStorage.setItem("current_resume_title", selectedResume.title);
        
        // Navigate to config-perms
        navigate("/config-perms");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit application. You may have already applied to this job.");
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("Error submitting application. Please try again.");
    } finally {
      setApplying(false);
    }
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
              <img src={job.company_logo || "/user-image.png"} alt="Company" className="company-image"/>
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

                <button className="apply-link" onClick={() => handleApplyClick(job)}>
                  Apply Now
                </button>
              </div>
            </div>
          ))
        )}

        {/* Application Modal */}
        {showApplicationModal && (
          <div className="modal-overlay" onClick={() => setShowApplicationModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Apply to {selectedJob?.title}</h3>
              <p className="modal-subtitle">Select a resume to submit with your application:</p>

              <div className="resume-selection-list">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className={`resume-selection-item ${selectedResumeId == resume.id ? 'selected' : ''}`}
                    onClick={() => setSelectedResumeId(resume.id)}
                  >
                    <input
                      type="radio"
                      name="resume"
                      value={resume.id}
                      checked={selectedResumeId == resume.id}
                      onChange={() => setSelectedResumeId(resume.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="resume-selection-label">{resume.title}</span>
                  </div>
                ))}
              </div>

              {resumes.length === 0 && (
                <p className="no-resumes-message">
                  You don't have any resumes yet.{" "}
                  <Link to="/profile" onClick={() => setShowApplicationModal(false)}>
                    Create one in your profile
                  </Link>
                </p>
              )}

              <div className="modal-buttons">
                <button
                  className="modal-create-btn"
                  onClick={handleSubmitApplication}
                  disabled={applying || !selectedResumeId}
                >
                  {applying ? "Submitting..." : "Continue to Configure Permissions"}
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={() => setShowApplicationModal(false)}
                  disabled={applying}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default HomeFeed;
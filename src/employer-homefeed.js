import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import API_BASE_URL from "./config/api.js";

function EmployerHomeFeed() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    employment_type: "",
    proposed_salary: "",
    is_active: true
  });
  const [editTags, setEditTags] = useState([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const employerWebId = sessionStorage.getItem("employer_webid");
      if (!employerWebId) {
        setLoading(false);
        return;
      }
      const webidWithoutFragment = employerWebId.split('#')[0];
      const res = await fetch(
        `${API_BASE_URL}/api/employer/jobs/?employer_webid=${encodeURIComponent(webidWithoutFragment)}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      // Sort: active first, then by newest
      const sortedJobs = data.sort((a, b) => {
        if (a.is_active !== b.is_active) return b.is_active - a.is_active;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setJobs(sortedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(job) {
    setEditingJob(job);
    setEditFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      employment_type: job.employment_type,
      proposed_salary: job.proposed_salary || "",
      is_active: job.is_active
    });
    // Pre-fill tags from job data
    setEditTags(job.tags ? job.tags.map(t => t.tag_name) : []);
    setEditTagInput("");
    setError("");
    setShowDeleteConfirm(false);
  }

  function closeEditModal() {
    setEditingJob(null);
    setEditFormData({ title: "", description: "", location: "", employment_type: "", proposed_salary: "", is_active: true });
    setEditTags([]);
    setEditTagInput("");
    setError("");
    setShowDeleteConfirm(false);
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditFormData({ ...editFormData, [name]: type === 'checkbox' ? checked : value });
  }

  function handleEditTagKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEditTag();
    }
  }

  function addEditTag() {
    const trimmedTag = editTagInput.trim();
    if (trimmedTag && !editTags.map(t => t.toLowerCase()).includes(trimmedTag.toLowerCase())) {
      setEditTags([...editTags, trimmedTag]);
      setEditTagInput("");
    }
  }

  function removeEditTag(tagToRemove) {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    setError("");
    setSaveLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/jobs/${editingJob.id}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editFormData,
            proposed_salary: editFormData.proposed_salary || null,
            tags: editTags
          }),
        }
      );

      if (response.ok) {
        const updatedJob = await response.json();
        const updatedJobs = jobs.map(job => job.id === editingJob.id ? updatedJob : job);
        const sortedJobs = updatedJobs.sort((a, b) => {
          if (a.is_active !== b.is_active) return b.is_active - a.is_active;
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setJobs(sortedJobs);
        closeEditModal();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update job. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDeleteJob() {
    setError("");
    setDeleteLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/jobs/${editingJob.id}/delete/`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== editingJob.id));
        closeEditModal();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete job. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="main-feed">
        <div className="feed-header"><h1 className="employer-h1">Job Listings</h1></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="main-feed">
      <div className="feed-header">
        <h1 className="employer-h1">Job Listings</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/employer-access-resumes">
            <button className="create-job-button">Accessible Resumes</button>
          </Link>
          <Link to="/employer-create-job">
            <button className="create-job-button">+ Create New Job</button>
          </Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs-message">
          <p>No job postings yet. Create your first job posting!</p>
          <Link to="/employer-create-job">
            <button className="create-job-button">Create Job Posting</button>
          </Link>
        </div>
      ) : (
        jobs.map(job => (
          <div key={job.id} className={`job-listing ${!job.is_active ? 'inactive-job' : ''}`}>
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
              <p className="job-meta">
                <strong>Status:</strong>{" "}
                <span className={job.is_active ? 'status-active' : 'status-inactive'}>
                  {job.is_active ? "Active" : "Inactive"}
                </span>
              </p>
              {/* Display tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="job-tags">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="job-tag">{tag.tag_name}</span>
                  ))}
                </div>
              )}
              <div className="job-actions">
                <button className="create-job-button" onClick={() => openEditModal(job)}>
                  Edit Job
                </button>
                <Link to={`/jobs/${job.id}/applicants`}>
                  <button className="create-job-button">View Applicants</button>
                </Link>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Job Posting</h2>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="edit-job-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="edit-title">Job Title *</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Job Description *</label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-location">Location *</label>
                <input
                  type="text"
                  id="edit-location"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-employment-type">Employment Type *</label>
                <select
                  id="edit-employment-type"
                  name="employment_type"
                  value={editFormData.employment_type}
                  onChange={handleEditChange}
                  required
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-salary">
                  Proposed Salary <span className="optional-label">(optional)</span>
                </label>
                <input
                  type="text"
                  id="edit-salary"
                  name="proposed_salary"
                  value={editFormData.proposed_salary}
                  onChange={handleEditChange}
                  placeholder="e.g., ₱50,000 - ₱70,000 per month"
                />
              </div>

              {/* Tags */}
              <div className="form-group">
                <label>Skills & Interests</label>
                <div className="tag-input-container">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyDown={handleEditTagKeyDown}
                    placeholder="Type a skill and press Enter"
                  />
                  <button type="button" className="add-tag-button" onClick={addEditTag}>
                    Add
                  </button>
                </div>
                <div className="tags-display">
                  {editTags.length > 0 ? (
                    editTags.map((tag, index) => (
                      <span key={index} className="tag-chip">
                        {tag}
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => removeEditTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="no-tags-hint">No tags added yet.</span>
                  )}
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editFormData.is_active}
                    onChange={handleEditChange}
                  />
                  <span>Job posting is active</span>
                </label>
              </div>

              {/* Delete confirmation */}
              {showDeleteConfirm ? (
                <div className="delete-confirmation">
                  <p className="delete-warning">⚠️ Are you sure you want to delete this job posting? This action cannot be undone.</p>
                  <div className="delete-actions">
                    <button
                      type="button"
                      className="delete-confirm-button"
                      onClick={handleDeleteJob}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? "Deleting..." : "Yes, Delete Job"}
                    </button>
                    <button
                      type="button"
                      className="delete-cancel-button"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="delete-job-button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={saveLoading}
                >
                  Delete Job
                </button>
              )}

              <div className="modal-actions">
                <button type="submit" className="save-button" disabled={saveLoading || deleteLoading}>
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="cancel-button" onClick={closeEditModal} disabled={saveLoading || deleteLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerHomeFeed;
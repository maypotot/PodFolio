import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployerLayout from "./employer-layout";
import "./employer-side.css";

function EmployerCreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    employment_type: "Full-time",
    is_active: true
  });
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch employer data to get company name
  useEffect(() => {
    async function fetchEmployerData() {
      try {
        const webid = sessionStorage.getItem("employer_webid");
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];
          const response = await fetch(
            `http://127.0.0.1:8000/api/employers/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          
          if (response.ok) {
            const data = await response.json();
            setCompanyName(data.company_name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch employer data:", err);
      }
    }
    fetchEmployerData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate required fields
    if (!formData.title || !formData.description || !formData.location) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const webid = sessionStorage.getItem("employer_webid");
      const webidWithoutFragment = webid.split('#')[0];

      const response = await fetch("http://127.0.0.1:8000/api/employer/jobs/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employer_webid: webidWithoutFragment,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          employment_type: formData.employment_type,
          is_active: formData.is_active,
          company: companyName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Job created successfully:", data);
        // Redirect to employer home feed
        navigate("/employer-homefeed");
      } else {
        setError(data.error || "Failed to create job. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Job creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployerLayout>
      <div className="main-feed">
        <div className="create-job-container">
          <h1 className="employer-h1">Create New Job Posting</h1>
          
          {companyName && (
            <div className="company-badge">
              <strong>Company:</strong> {companyName}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-job-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, New York, NY, or Hybrid"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="employment_type">Employment Type *</label>
              <select
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span>Make this job posting active immediately</span>
              </label>
              <small className="field-hint">
                Active job postings are visible to job seekers
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Job Posting"}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => navigate("/employer-homefeed")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </EmployerLayout>
  );
}

export default EmployerCreateJob;
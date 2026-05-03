import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./employer-side.css";
import API_BASE_URL from "./config/api.js";

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [requestModal, setRequestModal] = useState({ open: false, applicant: null });
  const [summary, setSummary] = useState("");

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/applicants/`);
        const data = await res.json();
        
        // DEBUG: Check what data we're getting
        console.log("Applicants data:", data);
        if (data.length > 0) {
          console.log("First applicant:", data[0]);
          console.log("Resume ID:", data[0].resume_id);
        }
        
        setApplicants(data);
      } catch (error) {
        console.error("Failed to fetch applicants:", error);
      }
    }
    fetchApplicants();
  }, [jobId]);

  async function handleSubmitRequest(applicant) {
    try {
      // Get employer webid from session, strip #me fragment
      const rawEmployerWebid = sessionStorage.getItem("employer_webid") || "";
      const employerWebid = rawEmployerWebid.split('#')[0];

      // Strip #me fragment from applicant webid
      const applicantWebid = applicant.applicant_webid.split('#')[0];

      const payload = {
        employer_webid: employerWebid,
        applicant_webid: applicantWebid,
        job_application_id: applicant.id,
        summary: summary,
      };

      const res = await fetch(`${API_BASE_URL}/api/requests/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Request submitted!");
        setRequestModal({ open: false, applicant: null });
        setSummary("");
      } else {
        const errorData = await res.json();
        console.error("Failed to submit request:", errorData);
        alert("Failed to submit request: " + (errorData.detail || JSON.stringify(errorData)));
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  }

  // Handle view resume click
  function handleViewResume(applicant) {
    console.log("Applicant data:", applicant);
    console.log("Resume ID:", applicant.resume_id);
    
    if (!applicant.resume_id) {
      alert("Resume ID not found. Please make sure the application was submitted with a resume.");
      return;
    }
    
    // Store resume ID in sessionStorage with key "id"
    sessionStorage.setItem("id", applicant.resume_id);
    
    // Navigate to view resume page
    navigate("/employer-view-resume");
  }

  return (
    <div className="main-feed">
      <h1 className="employer-h1">Applicants</h1>
      <Link to="/employer-homefeed" className="back-link">← Back to Dashboard</Link>

      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul>
          {applicants.map(app => (
            <li key={app.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
              <p>Applicant WebID: {app.applicant_webid.split('#')[0]}</p>
              <p>
                Resume:{" "}
                <button 
                  className="link-button"
                  onClick={() => handleViewResume(app)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007bff', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit'
                  }}
                >
                  View Resume {app.resume_id && `(ID: ${app.resume_id})`}
                </button>
              </p>
              <p>Submitted At: {new Date(app.submitted_at).toLocaleString()}</p>
              <button className="employer-add-tag-button" onClick={() => setRequestModal({ open: true, applicant: app })}>
                Request
              </button>
            </li>
          ))}
        </ul>
      )}

      {requestModal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Request for {requestModal.applicant.applicant_webid.split('#')[0]}</h3>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Enter summary of your request"
              rows={4}
              style={{ width: "100%" }}
            />
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => handleSubmitRequest(requestModal.applicant)}>Submit</button>
              <button
                onClick={() => setRequestModal({ open: false, applicant: null })}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApplicants;
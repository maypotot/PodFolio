import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./employer-side.css";
import EmployerLayout from "./employer-layout";
import API_BASE_URL from "./config/api.js";


function EmployerNotifs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestModal, setRequestModal] = useState({ open: false, application: null });
  const [summary, setSummary] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const webid = sessionStorage.getItem("employer_webid");
        if (!webid) {
          console.error("No employer webid found in sessionStorage");
          setLoading(false);
          return;
        }

        const webidWithoutFragment = webid.split('#')[0];

        const res = await fetch(
          `${API_BASE_URL}/api/employer/applications/?employer_webid=${encodeURIComponent(webidWithoutFragment)}`
        );
        
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched applications:", data);
          setApplications(data);
        } else {
          console.error("Failed to fetch applications");
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  async function handleSubmitRequest(application) {
    try {
      const webid = sessionStorage.getItem("employer_webid");
      const webidWithoutFragment = webid.split('#')[0];

      const payload = {
        employer_webid: webidWithoutFragment,
        applicant_webid: application.applicant_webid,
        job_application_id: application.id,
        summary: summary,
      };

      const res = await fetch(`${API_BASE_URL}/api/requests/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Request submitted!");
        setRequestModal({ open: false, application: null });
        setSummary("");
      } else {
        const errorData = await res.json();
        console.error("Failed to submit request:", errorData);
        alert("Failed to submit request: " + (errorData.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Network error. Please try again.");
    }
  }

  if (loading) {
    return (
      <EmployerLayout>
        <div className="main-feed">
          <h1 className="employer-h1">Applications</h1>
          <p>Loading applications...</p>
        </div>
      </EmployerLayout>
    );
  }

  return (
      <div className="main-feed">
        <h1 className="employer-h1">Applications</h1>
        
        {applications.length === 0 ? (
          <div className="no-applications-message">
            <p>No applications yet. Once students apply to your jobs, they'll appear here.</p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <img
                    src={app.student?.profile_picture || "/user-image.png"}
                    alt="Student"
                    className="application-avatar"
                  />
                  <div className="application-info">
                    <h3 className="application-title">
                      {app.student ? `${app.student.first_name} ${app.student.last_name}` : 'Unknown Student'} applied for {app.job_title}
                    </h3>
                    <p className="application-date">
                      {new Date(app.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="application-actions">
                  <Link
                    to="/employer-view-resume"
                    state={{ 
                      resumeUrl: app.resume_pod_url,
                      studentName: app.student ? `${app.student.first_name} ${app.student.last_name}` : 'Student'
                    }}
                    className="application-btn view-resume-btn"
                  >
                    View Resume
                  </Link>
                  <button
                    className="application-btn request-btn"
                    onClick={() => setRequestModal({ open: true, application: app })}
                  >
                    Request Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request Modal */}
        {requestModal.open && (
          <div className="modal-overlay" onClick={() => setRequestModal({ open: false, application: null })}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Request Resume Access</h3>
              <p className="modal-subtitle">
                Request access to {requestModal.application.student?.first_name}'s resume for the {requestModal.application.job_title} position.
              </p>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Enter a summary of your request (e.g., 'Would like to review your qualifications for the Software Engineer position')"
                rows={4}
                className="request-textarea"
              />
              <div className="modal-buttons">
                <button
                  className="modal-create-btn"
                  onClick={() => handleSubmitRequest(requestModal.application)}
                  disabled={!summary.trim()}
                >
                  Send Request
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={() => {
                    setRequestModal({ open: false, application: null });
                    setSummary("");
                  }}
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

export default EmployerNotifs;
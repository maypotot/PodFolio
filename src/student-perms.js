import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css";

function InPerms() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRequests() {
      try {
        const webid = sessionStorage.getItem("webid");
        if (!webid) {
          console.error("No webid found in sessionStorage");
          setLoading(false);
          return;
        }

        const webidWithoutFragment = webid.split('#')[0];

        const res = await fetch(
          `http://127.0.0.1:8000/api/requests/student/?student_webid=${encodeURIComponent(webidWithoutFragment)}`
        );
        
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched requests for student:", data);
          setRequests(data);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleConfigurePermissions = async (request) => {
    if (!request.job_application) {
      alert("Job application information not available");
      return;
    }

    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];

      // Fetch all resumes for this student
      const resumesRes = await fetch(
        `http://127.0.0.1:8000/api/resumes/?webid=${encodeURIComponent(webidWithoutFragment)}`
      );

      if (!resumesRes.ok) {
        alert("Failed to fetch resume information");
        return;
      }

      const resumes = await resumesRes.json();
      
      // Find the resume that matches the pod_url in the application
      const matchingResume = resumes.find(
        r => r.pod_url === request.job_application.resume_pod_url
      );

      if (!matchingResume) {
        alert("Could not find the resume used for this application");
        return;
      }

      // Fetch job details to get job title
      const jobRes = await fetch(
        `http://127.0.0.1:8000/api/jobs/`
      );

      let jobTitle = "Position";
      if (jobRes.ok) {
        const jobs = await jobRes.json();
        const job = jobs.find(j => j.id === request.job_application.job);
        if (job) {
          jobTitle = job.title;
        }
      }

      // Store all context in sessionStorage
      sessionStorage.setItem("current_application_id", request.job_application.id);
      sessionStorage.setItem("current_employer_webid", request.employer_webid);
      sessionStorage.setItem("current_job_title", jobTitle);
      sessionStorage.setItem("current_resume_title", matchingResume.title);
      sessionStorage.setItem("current_resume_id", matchingResume.id);

      console.log("Navigating to config-perms with context:", {
        application_id: request.job_application.id,
        employer_webid: request.employer_webid,
        job_title: jobTitle,
        resume_title: matchingResume.title,
        resume_id: matchingResume.id
      });

      // Navigate to config-perms
      navigate("/config-perms");
      
    } catch (error) {
      console.error("Error fetching resume details:", error);
      alert("Failed to load application details");
    }
  };

  if (loading) {
    return (
        <div className="main-feed">
          <h1>Employer Requests</h1>
          <p>Loading requests...</p>
        </div>
    );
  }

  return (
      <div className="main-feed">
        <div className="feed-header">
          <h1>Employer Requests</h1>
          <p className="subtitle">Employers requesting access to your resume information</p>
        </div>

        {requests.length === 0 ? (
          <div className="no-requests-message">
            <p>No permission requests yet.</p>
            <p>When employers request access to your resume, they'll appear here.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((req) => (
              <div key={req.id} className="request-item">
                <div className="request-header">
                  <h3>Permission Request</h3>
                  <span className="request-date">
                    {new Date(req.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="request-details">
                  <p className="request-from">
                    <strong>From:</strong> {req.employer_webid}
                  </p>
                  
                  <p className="request-summary">
                    <strong>Message:</strong> {req.summary}
                  </p>

                  {req.job_application && (
                    <div className="request-application-info">
                      <p><strong>Application ID:</strong> {req.job_application.id}</p>
                      <p className="resume-pod-url">
                        <strong>Resume:</strong> {req.job_application.resume_pod_url}
                      </p>
                    </div>
                  )}
                </div>

                <div className="request-actions">
                  <button
                    className="config-perms-button"
                    onClick={() => handleConfigurePermissions(req)}
                    disabled={!req.job_application}
                  >
                    📝 Configure Permissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

export default InPerms;
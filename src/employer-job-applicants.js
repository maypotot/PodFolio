import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./main.css";

function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [requestModal, setRequestModal] = useState({ open: false, applicant: null });
  const [summary, setSummary] = useState("");

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/jobs/${jobId}/applicants/`);
        const data = await res.json();
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

      const res = await fetch("http://127.0.0.1:8000/api/requests/create/", {  // ✅ fixed URL
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
              <p>Resume: <a href={app.resume_pod_url} target="_blank" rel="noreferrer">View Resume</a></p>
              <p>Submitted At: {new Date(app.submitted_at).toLocaleString()}</p>
              <button onClick={() => setRequestModal({ open: true, applicant: app })}>
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
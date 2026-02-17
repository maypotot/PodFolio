import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";

function InPerms() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const webid = sessionStorage.getItem("webid");
        if (!webid) {
          console.error("No webid found in sessionStorage");
          return;
        }

        const webidWithoutFragment = webid.split('#')[0];

        const res = await fetch(
          `http://127.0.0.1:8000/api/requests/student/?student_webid=${encodeURIComponent(webidWithoutFragment)}`
        );
        const data = await res.json();
        console.log("Fetched requests for student:", data);
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div className="main-feed">
      <h1>Employer Requests</h1>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {requests.map((req) => (
            <li key={req.id} className="incoming-perms">
              <div className="job-info">
                <h4>Request from: {req.employer_webid}</h4>
                <p>Summary: {req.summary}</p>
                <p>Job Application ID: {req.job_application?.id || "N/A"}</p>
                <Link to="/config-perms">Configure Permissions</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InPerms;
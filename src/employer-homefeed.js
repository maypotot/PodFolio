import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css"; // or a separate employer CSS if needed

const EMPLOYER_WEBID = "https://test-employer.solidcommunity.net/profile/card#me.";

function EmployerHomeFeed() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        // Fetch all jobs created by this employer (active + inactive)
        const res = await fetch(`http://127.0.0.1:8000/api/jobs/?employer_webid=${encodeURIComponent(EMPLOYER_WEBID)}`);
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="main-feed">
      <h1 className="employer-h1">Job Listings</h1>

      {jobs.length === 0 ? (
        <p>No job postings yet.</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="job-listing">
            <img src={job.company_logo || "/Figma.png"} alt="Company" className="company-image"/>
            <div className="job-info">
              <h2>{job.title}</h2>
              <h4>{job.company}</h4>
              <p className="job-description">{job.description}</p>
              
              {/* Links for editing the job and viewing applicants */}
              <Link to={`/jobs/${job.id}/edit`}>
                <button className="employer-responsive-button">Edit Job</button>
              </Link>
              <Link to={`/jobs/${job.id}/applicants`}>
                <button className="employer-responsive-button">View Applicants</button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EmployerHomeFeed;

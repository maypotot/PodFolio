import React, { useEffect, useState, useRef } from "react";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import "./main.css";

function EmployerAccessResumes() {
  const [permissions, setPermissions] = useState([]);
  const [resourceResults, setResourceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  const fetchResourceData = async (perms) => {
    if (!perms || perms.length === 0) {
      setResourceResults([]);
      return;
    }

    const session = getDefaultSession();
    const fetcher = session.fetch;

    const results = await Promise.all(
      perms.map(async (perm) => {
        const resourceUrl = perm.resource_url;
        const resourceBaseUrl = resourceUrl ? resourceUrl.split("#")[0] : resourceUrl;
        try {
          const res = await fetcher(resourceBaseUrl, {
            headers: {
              Accept: "application/ld+json, application/json, text/turtle;q=0.9, */*;q=0.8"
            }
          });

          const contentType = res.headers.get("content-type") || "";

          if (!res.ok) {
            const errorText = await res.text();
            return {
              resource_url: resourceUrl,
              ok: false,
              status: res.status,
              contentType,
              error: errorText,
              grantedBy: perm.student_webid
            };
          }

          let body;
          if (contentType.includes("application/json") || contentType.includes("application/ld+json")) {
            const jsonResponse = await res.json();
            body = jsonResponse.body || jsonResponse; // Preserve the original body if "body" field is not present
          } else {
            body = await res.text();
          }

          // Extract additional information from originalBody if it's a string
          let additionalInfo = {};
          if (typeof body === "string") {
            const schemaRegex = /<([^>]+)>\s*"([^"]+)";/g;
            let match;
            while ((match = schemaRegex.exec(body)) !== null) {
              const schemaKey = match[1].split("/").pop(); // Extract the last part of the schema URL
              const schemaValue = match[2];
              additionalInfo[schemaKey] = schemaValue;
            }
          }

          // Merge additionalInfo into parsedData
          const parsedData = {
            ...{
              fullName: body?.FullName || "N/A",
              professionalTitle: body?.ProfessionalTitle || "N/A",
              summary: body?.Summary || "N/A",
              email: body?.Email || "N/A",
              contactNumber: body?.ContactNumber || "N/A",
              location: body?.Location || "N/A",
              professionalSummary: body?.ProfessionalSummary || "N/A",
              degree: body?.Degree || "N/A",
              school: body?.School || "N/A",
              honors: body?.Honors || "N/A",
              program: body?.Program || "N/A",
              startDate: body?.StartDate || "N/A",
              endDate: body?.EndDate || "N/A",
              relevantCourseWork: body?.RelevantCourseWork || "N/A",
              thesisTitle: body?.ThesisTitle || "N/A",
              skills: body?.Skills || [],
              projects: body?.Projects || [],
              websites: body?.Websites || [],
              experiences: body?.Experiences || []
            },
            ...additionalInfo
          };

          return {
            resource_url: resourceUrl,
            ok: true,
            status: res.status,
            contentType,
            originalBody: body, // Preserve the original body
            parsedBody: parsedData, // Store the parsed data separately
            grantedBy: perm.student_webid
          };
        } catch (err) {
          return {
            resource_url: resourceUrl,
            ok: false,
            status: 0,
            contentType: "",
            error: err.message,
            grantedBy: perm.student_webid
          };
        }
      })
    );

    console.log("Resource fetch results:", results);
    setResourceResults(results);
  };

  const fetchPermissions = async () => {
    setLoading(true);
    setError("");

    const employerWebId = sessionStorage.getItem("employer_webid");
    if (!employerWebId) {
      setError("No employer WebID found in session.");
      setLoading(false);
      return;
    }

    try {
      const webIdWithFragment = employerWebId;
      const webIdWithoutFragment = employerWebId.split("#")[0];

      const urls = [
        `http://127.0.0.1:8000/api/permissions/list/?employer_webid=${encodeURIComponent(webIdWithFragment)}`,
        `http://127.0.0.1:8000/api/permissions/list/?employer_webid=${encodeURIComponent(webIdWithoutFragment)}`
      ];

      const responses = await Promise.all(urls.map((url) => fetch(url)));

      const results = await Promise.all(
        responses.map(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `HTTP ${res.status}`);
          }
          return res.json();
        })
      );

      const [withFragmentData, withoutFragmentData] = results;

      console.log("Permissions (with fragment):", withFragmentData);
      console.log("Permissions (without fragment):", withoutFragmentData);

      const merged = [...withFragmentData, ...withoutFragmentData];
      const unique = merged.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.employer_webid === item.employer_webid &&
              t.student_webid === item.student_webid &&
              t.resource_url === item.resource_url
          )
      );

      console.log("Permissions (merged unique):", unique);
      setPermissions(unique);
      await fetchResourceData(unique);
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      setError("Failed to fetch permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchPermissions();
  }, []);

  return (
    <div className="main-feed">
      <div className="feed-header">
        <h1 className="employer-h1">Accessible Resumes</h1>
        <button className="create-job-button" onClick={fetchPermissions}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading permissions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {resourceResults.map((resume, index) => (
            resume.ok && resume.status !== 403 && resume.parsedBody && (
              <div key={index} className="resume-section">
                <h2>Resume from {resume.grantedBy}</h2>
                <p><strong>Full Name:</strong> {resume.parsedBody.fullName}</p>
                <p><strong>Professional Title:</strong> {resume.parsedBody.professionalTitle}</p>
                <p><strong>Summary:</strong> {resume.parsedBody.summary}</p>
                <p><strong>Email:</strong> {resume.parsedBody.email}</p>
                <p><strong>Contact Number:</strong> {resume.parsedBody.contactNumber}</p>
                <p><strong>Location:</strong> {resume.parsedBody.location}</p>
                <p><strong>Professional Summary:</strong> {resume.parsedBody.professionalSummary}</p>
                <p><strong>Degree:</strong> {resume.parsedBody.degree}</p>
                <p><strong>School:</strong> {resume.parsedBody.school}</p>
                <p><strong>Honors:</strong> {resume.parsedBody.honors}</p>
                <p><strong>Program:</strong> {resume.parsedBody.program}</p>
                <p><strong>Start Date:</strong> {resume.parsedBody.startDate}</p>
                <p><strong>End Date:</strong> {resume.parsedBody.endDate}</p>
                <p><strong>Relevant Course Work:</strong> {resume.parsedBody.relevantCourseWork}</p>
                <p><strong>Thesis Title:</strong> {resume.parsedBody.thesisTitle}</p>

                {resume.parsedBody.skills.length > 0 && (
                  <div>
                    <h3>Skills</h3>
                    <ul>
                      {resume.parsedBody.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resume.parsedBody.projects.length > 0 && (
                  <div>
                    <h3>Projects</h3>
                    <ul>
                      {resume.parsedBody.projects.map((project, i) => (
                        <li key={i}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resume.parsedBody.websites.length > 0 && (
                  <div>
                    <h3>Websites</h3>
                    <ul>
                      {resume.parsedBody.websites.map((website, i) => (
                        <li key={i}>{website}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {resume.parsedBody.experiences.length > 0 && (
                  <div>
                    <h3>Experiences</h3>
                    <ul>
                      {resume.parsedBody.experiences.map((experience, i) => (
                        <li key={i}>{experience}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerAccessResumes;

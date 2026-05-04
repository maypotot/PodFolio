import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import "./employer-side.css";
import API_BASE_URL from "./config/api.js";

function EmployerViewResume() {
  const location = useLocation();
  const { resumeUrl, studentName } = location.state || {};
  const resumeID = sessionStorage.getItem("id");
  const [resumeData, setResumeData] = useState(null);
  const [grantedBy, setGrantedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  const normalizeFieldName = (field) => String(field || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const getResumeIndexValue = (parsedBody) => {
    if (!parsedBody || typeof parsedBody !== "object") return null;

    const rawValue = parsedBody.ResumeIndex ?? parsedBody.resumeIndex ?? null;
    if (Array.isArray(rawValue)) {
      return rawValue.length > 0 ? String(rawValue[0]).trim() : null;
    }

    if (rawValue === null || rawValue === undefined) return null;
    const normalized = String(rawValue).trim();
    return normalized || null;
  };

  const mergeFieldValues = (existingValue, incomingValue) => {
    const toArray = (value) => (Array.isArray(value) ? value : [value]);
    const combined = [...toArray(existingValue), ...toArray(incomingValue)]
      .map((value) => String(value).trim())
      .filter(Boolean);

    const unique = Array.from(new Set(combined));
    if (unique.length === 1) return unique[0];
    return unique;
  };

  const groupResumesByIndex = (resumes) => {
    const grouped = new Map();

    resumes.forEach((resume) => {
      if (!resume.ok || resume.status === 403 || !resume.parsedBody) return;

      const resumeIndex =
        getResumeIndexValue(resume.parsedBody) ||
        getResumeIndexFromResourceUrl(resume.resource_url) ||
        "no-index";
      const groupKey = `${resume.grantedBy}::${resumeIndex}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          grantedBy: resume.grantedBy,
          resourceUrls: [],
          parsedBody: {
            ResumeIndex: resumeIndex
          }
        });
      }

      const currentGroup = grouped.get(groupKey);
      currentGroup.resourceUrls.push(resume.resource_url);

      Object.entries(resume.parsedBody).forEach(([field, value]) => {
        if (normalizeFieldName(field) === "resumeindex") return;

        if (currentGroup.parsedBody[field] === undefined) {
          currentGroup.parsedBody[field] = value;
          return;
        }

        currentGroup.parsedBody[field] = mergeFieldValues(currentGroup.parsedBody[field], value);
      });
    });

    return Array.from(grouped.values());
  };

  const normalizeResourceUrl = (url) => (url ? url.split("#")[0] : url);

  const getResumeIndexFromResourceUrl = (resourceUrl) => {
    if (!resourceUrl) return null;

    const decodedUrl = decodeURIComponent(String(resourceUrl));
    const queryMatch = decodedUrl.match(/[?&](?:resume[_-]?id|resume[_-]?index)=([^&#]+)/i);
    if (queryMatch?.[1]) {
      const value = queryMatch[1].trim();
      return value || null;
    }

    const pathMatch = decodedUrl.match(/resume(?:[_-]?id|[_-]?index)?[_-]?([0-9]+)/i);
    if (pathMatch?.[1]) {
      const value = pathMatch[1].trim();
      return value || null;
    }

    return null;
  };

  const parseSchemaFieldsFromString = (body) => {
    if (typeof body !== "string") return {};

    const fieldToValues = {};
    const schemaStatementRegex = /<https?:\/\/schema\.org\/([A-Za-z][\w-]*)>\s+([^.;]+)[.;]/gi;
    let statementMatch;

    while ((statementMatch = schemaStatementRegex.exec(body)) !== null) {
      const field = statementMatch[1];
      const rawValueSegment = statementMatch[2] || "";

      const quotedValues = Array.from(rawValueSegment.matchAll(/"([^"]*)"/g))
        .map((match) => match[1]?.trim())
        .filter(Boolean);

      const valuesToStore = quotedValues.length > 0
        ? quotedValues
        : [rawValueSegment.trim().replace(/^<|>$/g, "")].filter(Boolean);

      if (!fieldToValues[field]) {
        fieldToValues[field] = [];
      }

      fieldToValues[field].push(...valuesToStore);
    }

    return Object.fromEntries(
      Object.entries(fieldToValues)
        .map(([field, values]) => {
          const normalizedValues = (values || []).filter(
            (value) => typeof value === "string" && value.trim()
          );

          if (normalizedValues.length === 0) return null;
          if (normalizedValues.length === 1) return [field, normalizedValues[0]];
          return [field, normalizedValues];
        })
        .filter(Boolean)
    );
  };

  const parseFieldsFromObject = (body) => {
    if (!body || typeof body !== "object" || Array.isArray(body)) return {};

    return Object.fromEntries(
      Object.entries(body)
        .map(([field, value]) => {
          if (typeof value === "string") {
            const trimmed = value.trim();
            return trimmed ? [field, trimmed] : null;
          }

          if (Array.isArray(value)) {
            const normalizedArray = value
              .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
              .filter(Boolean);

            if (normalizedArray.length === 0) return null;
            if (normalizedArray.length === 1) return [field, normalizedArray[0]];
            return [field, normalizedArray];
          }

          if (value === null || value === undefined) return null;
          return [field, value];
        })
        .filter(Boolean)
    );
  };

  const fetchResourceData = async (perms) => {
    if (!perms || perms.length === 0) {
      return [];
    }

    const session = getDefaultSession();
    const fetcher = session.fetch;

    return Promise.all(
      perms.map(async (perm) => {
        const resourceUrl = perm.resource_url;
        const resourceBaseUrl = normalizeResourceUrl(resourceUrl);

        try {
          const res = await fetcher(resourceBaseUrl, {
            headers: {
              Accept: "application/ld+json, application/json, text/turtle;q=0.9, */*;q=0.8"
            }
          });

          const contentType = res.headers.get("content-type") || "";

          if (!res.ok) {
            return {
              resource_url: resourceUrl,
              ok: false,
              status: res.status,
              contentType,
              grantedBy: perm.student_webid
            };
          }

          let body;
          if (contentType.includes("application/json") || contentType.includes("application/ld+json")) {
            const jsonResponse = await res.json();
            body = jsonResponse.body || jsonResponse;
          } else {
            body = await res.text();
          }

          const parsedDataFromString = parseSchemaFieldsFromString(body);
          const parsedDataFromObject = parseFieldsFromObject(body);
          const parsedData = Object.keys(parsedDataFromString).length > 0
            ? parsedDataFromString
            : parsedDataFromObject;

          return {
            resource_url: resourceUrl,
            ok: true,
            status: res.status,
            contentType,
            parsedBody: parsedData,
            grantedBy: perm.student_webid
          };
        } catch (fetchErr) {
          return {
            resource_url: resourceUrl,
            ok: false,
            status: 0,
            contentType: "",
            error: fetchErr.message,
            grantedBy: perm.student_webid
          };
        }
      })
    );
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const fetchResume = async () => {
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
          `${API_BASE_URL}/api/permissions/list/?employer_webid=${encodeURIComponent(webIdWithFragment)}`,
          `${API_BASE_URL}/api/permissions/list/?employer_webid=${encodeURIComponent(webIdWithoutFragment)}`
        ];

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const permissionLists = await Promise.all(
          responses.map(async (res) => {
            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || `HTTP ${res.status}`);
            }
            return res.json();
          })
        );

        const mergedPermissions = [...permissionLists[0], ...permissionLists[1]];
        const uniquePermissions = mergedPermissions.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (entry) =>
                entry.employer_webid === item.employer_webid &&
                entry.student_webid === item.student_webid &&
                entry.resource_url === item.resource_url
            )
        );

        const resourceResults = await fetchResourceData(uniquePermissions);
        const groupedResumes = groupResumesByIndex(resourceResults);
        console.log("Grouped resumes before filtering:", groupedResumes);

        const targetResumeId = String(resumeID || "").trim();
        const normalizedRequestedUrl = normalizeResourceUrl(resumeUrl);

        let selectedResume = groupedResumes.find(
          (resume) => String(getResumeIndexValue(resume.parsedBody) || "") === targetResumeId
        );

        console.log("Retrieved filtered resume using resume ID:", {
          resumeID: targetResumeId,
          selectedResume
        });

        if (!selectedResume && normalizedRequestedUrl) {
          selectedResume = groupedResumes.find((resume) =>
            resume.resourceUrls.some((url) => normalizeResourceUrl(url) === normalizedRequestedUrl)
          );
        }

        if (!selectedResume) {
          setError("No accessible resume was found for this Resume ID.");
          setResumeData(null);
          setGrantedBy("");
        } else {
          setResumeData(selectedResume.parsedBody);
          setGrantedBy(selectedResume.grantedBy || "");
        }
      } catch (fetchErr) {
        console.error("Failed to fetch resume data:", fetchErr);
        setError("Failed to load resume from accessible resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeID, resumeUrl]);

  const fieldLookup = useMemo(() => {
    if (!resumeData || typeof resumeData !== "object") return {};

    return Object.entries(resumeData).reduce((acc, [key, value]) => {
      acc[normalizeFieldName(key)] = value;
      return acc;
    }, {});
  }, [resumeData]);

  const getFieldValue = (...aliases) => {
    for (const alias of aliases) {
      const value = fieldLookup[normalizeFieldName(alias)];
      if (value !== undefined && value !== null) return value;
    }
    return null;
  };

  const getDisplayValue = (...aliases) => {
    const value = getFieldValue(...aliases);
    if (Array.isArray(value)) {
      const cleaned = value.map((item) => String(item).trim()).filter(Boolean);
      return cleaned.length > 0 ? cleaned.join(", ") : "[To be loaded from Pod]";
    }

    if (value === null || value === undefined) return "[To be loaded from Pod]";
    const cleaned = String(value).trim();
    return cleaned || "[To be loaded from Pod]";
  };

  const skills = (() => {
    const value = getFieldValue("Skill", "Skills");
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }

    if (value !== null && value !== undefined) {
      const single = String(value).trim();
      return single ? [single] : [];
    }

    return [];
  })();

  return (
      <div className="main-feed">
        <div className="resume">
          <div className="tag-header">
            <h1 className="employer-h1">Resume Preview</h1>
            <Link to="/employer-homefeed">
              <button className="employer-button">Back to Applications</button>
            </Link>
          </div>

          <div className="resume-placeholder">
            <h2>{studentName || "Student"}'s Resume</h2>
            <p>Resume ID: {resumeID}</p>
            <p className="placeholder-text">
              {loading
                ? "loading resumes..."
                : error || "Resume data loaded from accessible Solid Pod resources."}
            </p>

            {grantedBy && <p>Granted By: {grantedBy}</p>}
            
            {resumeUrl && (
              <div className="resume-url-info">
                <p><strong>Resume URL:</strong></p>
                <code className="url-display">{resumeUrl}</code>
              </div>
            )}

            <div className="placeholder-sections">
              <div className="placeholder-section">
                <h3>Personal Information</h3>
                <p className="resume-item">Name: {getDisplayValue("FullName", "Name", "StudentName")}</p>
                <p className="resume-item">Email: {getDisplayValue("Email")}</p>
                <p className="resume-item">Phone: {getDisplayValue("ContactNumber", "Phone", "PhoneNumber")}</p>
                <p className="resume-item">Location: {getDisplayValue("Location", "Address")}</p>
              </div>

              <div className="placeholder-section">
                <h3>Education</h3>
                <p className="resume-item">Degree: {getDisplayValue("Degree")}</p>
                <p className="resume-item">Institution: {getDisplayValue("School", "Institution", "University")}</p>
                <p className="resume-item">Graduation Date: {getDisplayValue("EndDate", "GraduationDate")}</p>
              </div>

              <div className="placeholder-section">
                <h3>Skills</h3>
                {skills.length > 0 ? (
                  skills.slice(0, 3).map((skill, index) => (
                    <p key={`${skill}-${index}`} className="resume-item">• {skill}</p>
                  ))
                ) : (
                  <>
                    <p className="resume-item">• [To be loaded from Pod]</p>
                    <p className="resume-item">• [To be loaded from Pod]</p>
                    <p className="resume-item">• [To be loaded from Pod]</p>
                  </>
                )}
              </div>

              <div className="placeholder-section">
                <h3>Experience</h3>
                <p className="resume-item">Job Title: {getDisplayValue("PositionTitle", "JobTitle")}</p>
                <p className="resume-item">Company: {getDisplayValue("Organization", "Company")}</p>
                <p className="resume-item">Duration: {getDisplayValue("Duration")}</p>
              </div>

              <div className="placeholder-section">
                <h3>Projects</h3>
                <p className="resume-item">Project Name: {getDisplayValue("ProjectName", "ProjectTitle")}</p>
                <p className="resume-item">Description: {getDisplayValue("Summary", "Description", "ProjectDescription")}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}

export default EmployerViewResume;
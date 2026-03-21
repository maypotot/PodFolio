import React, { useEffect, useState, useRef } from "react";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import "./main.css";

function EmployerAccessResumes() {
  const [permissions, setPermissions] = useState([]);
  const [resourceResults, setResourceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  const formatFieldLabel = (field) => {
    if (!field) return "";
    return field
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .trim();
  };

  const isResumeIndexField = (field) => {
    if (!field) return false;
    return field.toLowerCase() === "resumeindex";
  };

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

      const resumeIndex = getResumeIndexValue(resume.parsedBody) || "no-index";
      const groupKey = `${resume.grantedBy}::${resumeIndex}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          grantedBy: resume.grantedBy,
          parsedBody: {}
        });
      }

      const currentGroup = grouped.get(groupKey);

      Object.entries(resume.parsedBody).forEach(([field, value]) => {
        if (isResumeIndexField(field)) return;

        if (currentGroup.parsedBody[field] === undefined) {
          currentGroup.parsedBody[field] = value;
          return;
        }

        currentGroup.parsedBody[field] = mergeFieldValues(currentGroup.parsedBody[field], value);
      });
    });

    return Array.from(grouped.values());
  };

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

          const schemaFieldValues = (() => {
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

            return fieldToValues;
          })();

          const parsedDataFromString = Object.fromEntries(
            Object.entries(schemaFieldValues)
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

          const parsedDataFromObject = (() => {
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
          })();

          const parsedData = Object.keys(parsedDataFromString).length > 0
            ? parsedDataFromString
            : parsedDataFromObject;

          console.log("Parsed resume data:", {
            resource_url: resourceUrl,
            grantedBy: perm.student_webid,
            parsedData
          });

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

  const groupedResumes = groupResumesByIndex(resourceResults);

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
          {groupedResumes.map((resume, index) => (
              <div key={index} className="resume-section">
                <h2>Resume from {resume.grantedBy}</h2>
                {Object.keys(resume.parsedBody).length === 0 ? (
                  <p>No parsed fields found.</p>
                ) : (
                  Object.entries(resume.parsedBody).map(([field, value]) => {
                    if (Array.isArray(value)) {
                      return (
                        <div key={field}>
                          <h3>{formatFieldLabel(field)}</h3>
                          <ul>
                            {value.map((item, i) => (
                              <li key={`${field}-${i}`}>{String(item)}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    return (
                      <p key={field}>
                        <strong>{formatFieldLabel(field)}:</strong> {String(value)}
                      </p>
                    );
                  })
                )}
              </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerAccessResumes;

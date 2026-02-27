import React, { useEffect, useState } from "react";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import "./main.css";

function EmployerAccessResumes() {
  const [permissions, setPermissions] = useState([]);
  const [resourceResults, setResourceResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              error: errorText
            };
          }

          let body;
          if (contentType.includes("application/json") || contentType.includes("application/ld+json")) {
            body = await res.json();
          } else {
            body = await res.text();
          }

          return {
            resource_url: resourceUrl,
            ok: true,
            status: res.status,
            contentType,
            body
          };
        } catch (err) {
          return {
            resource_url: resourceUrl,
            ok: false,
            status: 0,
            contentType: "",
            error: err.message
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
        <div className="job-listing">
          <h3>Raw Permissions</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(permissions, null, 2)}
          </pre>

          <h3>Resource Data</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(resourceResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default EmployerAccessResumes;

import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./employer-side.css";
import API_BASE_URL from "./config/api.js";

function StudentSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    async function fetchStudents() {
      setLoading(true);
      setSearched(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/students/search/?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to search students:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [query]);

  return (
      <div className="main-feed">

        <div className="search-results-header">
          <h1 className="employer-h1">Student Search</h1>
          {query && (
            <p className="search-query-label">
              Results for: <span className="search-query-highlight">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && <p className="search-status">Searching...</p>}

        {/* No query entered */}
        {!query && (
          <p className="search-status">Use the search bar above to find students by skill or interest.</p>
        )}

        {/* No results */}
        {searched && !loading && results.length === 0 && (
          <div className="no-results">
            <p>No students found with the skill or interest "<strong>{query}</strong>".</p>
            <p>Try a different keyword.</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <p className="results-count">
              {results.length} student{results.length !== 1 ? "s" : ""} found
            </p>
            <div className="student-results-list">
              {results.map((student) => (
                <div key={student.id} className="student-result-card">
                  <div className="student-result-header">
                    <img
                      src="/user-image.png"
                      alt="Student"
                      className="student-result-avatar"
                    />
                    <div className="student-result-info">
                      <h2 className="student-result-name">
                        {student.first_name} {student.last_name}
                      </h2>
                      <p className="student-result-email">{student.email}</p>
                      {student.bio && student.bio !== "Add Bio" && (
                        <p className="student-result-bio">{student.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Skills/interests tags */}
                  {student.tags && student.tags.length > 0 && (
                    <div className="student-result-tags">
                      {student.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className={`student-tag-chip ${
                            tag.tag_name.toLowerCase().includes(query.toLowerCase())
                              ? "student-tag-chip--match"
                              : ""
                          }`}
                        >
                          {tag.tag_name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="student-result-actions">
                    <Link
                      to={`/employer-view-student?webid=${encodeURIComponent(student.webid)}`}
                      className="view-profile-link"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
  );
}

export default StudentSearch;
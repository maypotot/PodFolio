import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css"; 
import StudentLayout from "./student-layout";

function Profile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [saving, setSaving] = useState(false);

  // Tag state
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [savingTags, setSavingTags] = useState(false);
  const [tagMessage, setTagMessage] = useState("");

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const webid = sessionStorage.getItem("webid");
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];

          // Fetch student account data
          const response = await fetch(
            `http://127.0.0.1:8000/api/students/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (response.ok) {
            const data = await response.json();
            setStudentData(data);
            setBioText(data.bio || "Add Bio");
          }

          // Fetch existing student tags
          const tagsRes = await fetch(
            `http://127.0.0.1:8000/api/students/tags/get/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (tagsRes.ok) {
            const tagsData = await tagsRes.json();
            setTags(tagsData.map(t => t.tag_name));
          }
        }
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentData();
  }, []);

  // ── Bio handlers ───────────────────────────────────────────────────────────

  const handleBioClick = () => {
    if (bioText === "Add Bio") setBioText("");
    setIsEditingBio(true);
  };

  const handleBioSave = async () => {
    setSaving(true);
    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/bio/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio: bioText || "Add Bio" }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        setBioText(data.bio);
        setIsEditingBio(false);
      } else {
        alert("Failed to update bio. Please try again.");
      }
    } catch (error) {
      alert("Error updating bio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBioCancel = () => {
    setBioText(studentData?.bio || "Add Bio");
    setIsEditingBio(false);
  };

  // ── Tag handlers ───────────────────────────────────────────────────────────

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.map(t => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveTags = async () => {
    setSavingTags(true);
    setTagMessage("");
    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `http://127.0.0.1:8000/api/students/tags/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tags }),
        }
      );
      if (response.ok) {
        const savedTags = await response.json();
        setTags(savedTags.map(t => t.tag_name));
        setTagMessage("✓ Skills saved");
        setTimeout(() => setTagMessage(""), 2500);
      } else {
        setTagMessage("Failed to save. Please try again.");
      }
    } catch (error) {
      setTagMessage("Network error. Please try again.");
    } finally {
      setSavingTags(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <StudentLayout>
        <div className="main-feed"><p>Loading...</p></div>
      </StudentLayout>
    );
  }

  const displayName = studentData
    ? `${studentData.first_name} ${studentData.last_name}`
    : "User Name";

  return (
    <StudentLayout>
      <div className="main-feed">

        {/* ── Profile Header ── */}
        <div className="profile-details">
          <h1>Profile</h1>
          <img src="/user-image.png" alt="User Avatar" className="profile-picture"/>
          <h5>{displayName}</h5>

          {isEditingBio ? (
            <div className="bio-edit-container">
              <textarea
                className="bio-textarea"
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <div className="bio-buttons">
                <button className="bio-save-button" onClick={handleBioSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="bio-cancel-button" onClick={handleBioCancel} disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className={bioText === "Add Bio" ? "bio-placeholder" : "bio-text"}
              onClick={handleBioClick}
              style={{ cursor: "pointer" }}
            >
              {bioText}
            </p>
          )}
        </div>

        {/* ── Skills & Interests ── */}
        {/* <div className="tags-section"> */}

          <div className="tag-group">
            <div className="tag-header">
              <h3 className="tag-title">Skills & Interests</h3>
              {tagMessage && (
                <span className="tag-save-message">{tagMessage}</span>
              )}
            </div>

            {/* Tag input row */}
            <div className="tag-input-container">
              <input
                type="text"
                className="skills-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="e.g. Web Development, UI/UX Design..."
              />
              <button
                type="button"
                className="student-add-tag-button"
                onClick={addTag}
              >
                Add
              </button>
            </div>
            <small className="field-hint">
              Press Enter or click Add. These help employers find you.
            </small>

            {/* Tag chips */}
            {tags.length > 0 ? (
              <div className="profile-tags-display">
                {tags.map((tag, index) => (
                  <span key={index} className="profile-tag-chip">
                    {tag}
                    <button
                      type="button"
                      className="profile-tag-remove"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="bio-placeholder">No skills added yet. Add some above!</p>
            )}

            {/* Save button — only show if there are tags */}
            <button
              className="student-add-tag-button"
              onClick={handleSaveTags}
              disabled={savingTags}
              style={{ marginTop: "1rem" }}
            >
              {savingTags ? "Saving..." : "Save Skills"}
            </button>
          </div>

          {/* ── Resumes ── */}
          <div className="tag-group">
            <div className="tag-header">
              <h3 className="tag-title">Resumes</h3>
              <Link to="/create-resume">
                <button className="student-add-tag-button">+ Add Resume</button>
              </Link>
            </div>
            <div className="tag-list">
              <p className="tag-item">
                Web Development.
                <img src="/pencil.png" alt="edit" className="edit-icon"/>
              </p>
            </div>
          </div>

        {/* </div> */}
      </div>
    </StudentLayout>
  );
}

export default Profile;
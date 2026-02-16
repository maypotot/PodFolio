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

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const webid = sessionStorage.getItem("webid");
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];
          const response = await fetch(
            `http://127.0.0.1:8000/api/students/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          
          if (response.ok) {
            const data = await response.json();
            setStudentData(data);
            setBioText(data.bio || "Add Bio");
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

  const handleBioClick = () => {
    if (bioText === "Add Bio") {
      setBioText("");
    }
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio: bioText || "Add Bio"
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        setBioText(data.bio);
        setIsEditingBio(false);
      } else {
        console.error("Failed to update bio");
        alert("Failed to update bio. Please try again.");
      }
    } catch (error) {
      console.error("Error updating bio:", error);
      alert("Error updating bio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBioCancel = () => {
    setBioText(studentData?.bio || "Add Bio");
    setIsEditingBio(false);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="main-feed">
          <p>Loading...</p>
        </div>
      </StudentLayout>
    );
  }

  const displayName = studentData 
    ? `${studentData.first_name} ${studentData.last_name}`
    : "User Name";

  return (
    <StudentLayout>
      <div className="main-feed">
        <div className="profile-details">
          <h1>Profile</h1>
          <img src="/Spongebob.webp" alt="User Avatar" className="profile-picture"/>
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
                <button 
                  className="bio-save-button" 
                  onClick={handleBioSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button 
                  className="bio-cancel-button" 
                  onClick={handleBioCancel}
                  disabled={saving}
                >
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
        
        <div className="tags-section">
          <div className="tag-group">
            <div className="tag-header">
              <h3 className="tag-title">Resumes</h3>
              <Link to="/create-resume">
                <button className="add-tag-button">+ Add Resume</button>
              </Link>
            </div>
            <div className="tag-list">
              <p className="tag-item">
                Web Development.
                <img src="/pencil.png" alt="edit" className="edit-icon"></img>
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Profile;
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./main.css"; 
import StudentLayout from "./student-layout";
import { restoreSession, loadInformation } from "./solid.js";
import API_BASE_URL from "./config/api.js";

let podInfolist = [];
let resumeIndexList = [];
let maxResumeIndex = 0;


function Profile() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Tag state
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [savingTags, setSavingTags] = useState(false);
  const [tagMessage, setTagMessage] = useState("");

  // Picture upload state
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);

  // Resume state
  const [resumes, setResumes] = useState([]);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [creatingResume, setCreatingResume] = useState(false);
  const [editingResumeId, setEditingResumeId] = useState(null);
  const [editingResumeTitle, setEditingResumeTitle] = useState("");


  useEffect( () => {
    async function getInfo() {
    const user =  await restoreSession();
    const podInformation = await loadInformation();
  
    for (let i in podInformation){
      for (let j in podInformation[i].information){
            podInfolist.push(podInformation[i].information[j]);
      }
    }
  
    resumeIndexList = Array.from(
      new Set(podInfolist.map((info) => Number(info.ResumeIndex)).filter((value) => !Number.isNaN(value)))
    );
    maxResumeIndex = resumeIndexList.length > 0 ? Math.max(...resumeIndexList) : null;
    }
  getInfo();

    async function fetchStudentData() {
      try {
        const webid = sessionStorage.getItem("webid");
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];

          // Fetch student account data
          const response = await fetch(
            `${API_BASE_URL}/api/students/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (response.ok) {
            const data = await response.json();
            setStudentData(data);
            setBioText(data.bio || "Add Bio");
            setFirstName(data.first_name || "");
            setLastName(data.last_name || "");
            setEmail(data.email || "");
          }

          // Fetch existing student tags
          const tagsRes = await fetch(
            `${API_BASE_URL}/api/students/tags/get/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (tagsRes.ok) {
            const tagsData = await tagsRes.json();
            setTags(tagsData.map(t => t.tag_name));
          }

          // Fetch student resumes
          const resumesRes = await fetch(
            `${API_BASE_URL}/api/resumes/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (resumesRes.ok) {
            const resumesData = await resumesRes.json();
            setResumes(resumesData);
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
        `${API_BASE_URL}/api/students/bio/?webid=${encodeURIComponent(webidWithoutFragment)}`,
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

  // ── Name handlers ──────────────────────────────────────────────────────────

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert("Both first and last name are required");
      return;
    }

    setSavingName(true);
    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/students/name/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName.trim(),
            last_name: lastName.trim()
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setIsEditingName(false);
        window.location.reload();
      } else {
        alert("Failed to update name. Please try again.");
      }
    } catch (error) {
      alert("Error updating name. Please try again.");
    } finally {
      setSavingName(false);
    }
  };

  const handleNameCancel = () => {
    setFirstName(studentData?.first_name || "");
    setLastName(studentData?.last_name || "");
    setIsEditingName(false);
  };

  // ── Email handlers ─────────────────────────────────────────────────────────

  const handleEmailClick = () => {
    setIsEditingEmail(true);
  };

  const handleEmailSave = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert("Please enter a valid email address");
      return;
    }

    setSavingEmail(true);
    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/students/email/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        setEmail(data.email);
        setIsEditingEmail(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update email. Please try again.");
      }
    } catch (error) {
      alert("Error updating email. Please try again.");
    } finally {
      setSavingEmail(false);
    }
  };

  const handleEmailCancel = () => {
    setEmail(studentData?.email || "");
    setIsEditingEmail(false);
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
        `${API_BASE_URL}/api/students/tags/?webid=${encodeURIComponent(webidWithoutFragment)}`,
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

  // ── Picture upload handlers ────────────────────────────────────────────────

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingPicture(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        const webid = sessionStorage.getItem("webid");
        const webidWithoutFragment = webid.split('#')[0];

        const response = await fetch(
          `${API_BASE_URL}/api/students/picture/?webid=${encodeURIComponent(webidWithoutFragment)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile_picture: base64String }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStudentData(data);
          window.location.reload();
        } else {
          alert("Failed to upload picture. Please try again.");
        }
      };

      reader.onerror = () => {
        alert("Error reading file. Please try again.");
        setUploadingPicture(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      alert("Error uploading picture. Please try again.");
      setUploadingPicture(false);
    }
  };

  // ── Resume handlers ────────────────────────────────────────────────────────

  const handleAddResume = () => {
    setResumeTitle("");
    setShowResumeModal(true);
  };

  const handleCreateResume = async () => {
    if (!resumeTitle.trim()) {
      alert("Please enter a resume title");
      return;
    }

    setCreatingResume(true);
    try {
      const webid = sessionStorage.getItem("webid");
      const webidWithoutFragment = webid.split('#')[0];
      
      const response = await fetch(
        `${API_BASE_URL}/api/resumes/create/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: resumeTitle.trim()}),
        }
      );

      if (response.ok) {
        const newResume = await response.json();
        // Store resume ID in sessionStorage to use in create-resume page

        alert(`Resume created successfully!\nResume ID: ${newResume.id}\nTitle: ${newResume.title}`);

        sessionStorage.setItem("current_resume_id", newResume.id);
        sessionStorage.setItem("current_resume_title", newResume.title);
        
        // Navigate to create-resume page
        navigate("/create-resume");
      } else {
        alert("Failed to create resume. Please try again.");
      }
    } catch (error) {
      alert("Error creating resume. Please try again.");
    } finally {
      setCreatingResume(false);
    }
  };

  const handleEditResume = (resume) => {
    // Store resume ID and navigate to create-resume page for editing
    sessionStorage.setItem("current_resume_id", resume.id);
    sessionStorage.setItem("current_resume_title", resume.title);
    navigate("/edit-resume");
  };

  const handleEditResumeTitle = (resume) => {
    setEditingResumeId(resume.id);
    setEditingResumeTitle(resume.title);
  };

  const handleSaveResumeTitle = async (resumeId) => {
    if (!editingResumeTitle.trim()) {
      alert("Resume title cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resumes/${resumeId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editingResumeTitle.trim() }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setResumes(resumes.map(r => r.id === resumeId ? updated : r));
        setEditingResumeId(null);
      } else {
        alert("Failed to update title. Please try again.");
      }
    } catch (error) {
      alert("Error updating title. Please try again.");
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/resumes/${resumeId}/delete/`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setResumes(resumes.filter(r => r.id !== resumeId));
      } else {
        alert("Failed to delete resume. Please try again.");
      }
    } catch (error) {
      alert("Error deleting resume. Please try again.");
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

  const profilePicture = studentData?.profile_picture || "/user-image.png";

  return (
    <StudentLayout>
      <div className="main-feed">

        {/* ── Profile Header ── */}
        <div className="profile-details">
          <h1>Profile</h1>

          {/* Profile picture with upload */}
          <div className="profile-picture-container">
            <img
              src={profilePicture}
              alt="User Avatar"
              className="profile-picture"
            />
            <button
              className="upload-picture-button"
              onClick={handlePictureClick}
              disabled={uploadingPicture}
            >
              {uploadingPicture ? "Uploading..." : "Change Picture"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Name with edit button */}
          {isEditingName ? (
            <div className="name-edit-container">
              <div className="name-inputs">
                <label>First Name:</label>
                <input
                  type="text"
                  className="name-input"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label>Last Name:</label>
                <input
                  type="text"
                  className="name-input"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="bio-buttons">
                <button className="bio-save-button" onClick={handleNameSave} disabled={savingName}>
                  {savingName ? "Saving..." : "Save"}
                </button>
                <button className="bio-cancel-button" onClick={handleNameCancel} disabled={savingName}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="name-display-container">
              <h5>{displayName}</h5>
              <button className="student-add-tag-button" onClick={handleNameClick} title="Edit name">
                Edit
              </button>
            </div>
          )}

          {/* Email with edit button */}
          {isEditingEmail ? (
            <div className="name-edit-container">
              <div className="email-input-container">
                <label>Email:</label>
                <input
                  type="email"
                  className="name-input"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="bio-buttons">
                <button className="bio-save-button" onClick={handleEmailSave} disabled={savingEmail}>
                  {savingEmail ? "Saving..." : "Save"}
                </button>
                <button className="bio-cancel-button" onClick={handleEmailCancel} disabled={savingEmail}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="email-display-container">
              <p className="email-text">{email || studentData?.email}</p>
              <button className="student-add-tag-button" onClick={handleEmailClick} title="Edit email">
                Edit
              </button>
            </div>
          )}

          {/* Bio */}
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
        <div className="tag-group">
          <div className="tag-header">
            <h3 className="tag-title">Skills & Interests</h3>
            {tagMessage && (
              <span className="tag-save-message">{tagMessage}</span>
            )}
          </div>

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
            <button className="student-add-tag-button" onClick={handleAddResume}>
              + Add Resume
            </button>
          </div>

          {resumes.length > 0 ? (
            <div className="resume-list">
              {resumes.map((resume) => (
                <div key={resume.id} className="resume-item">
                  {editingResumeId === resume.id ? (
                    <div className="resume-title-edit">
                      <input
                        type="text"
                        className="resume-title-input"
                        value={editingResumeTitle}
                        onChange={(e) => setEditingResumeTitle(e.target.value)}
                      />
                      <button
                        className="resume-save-btn"
                        onClick={() => handleSaveResumeTitle(resume.id)}
                      >
                        ✓
                      </button>
                      <button
                        className="resume-cancel-btn"
                        onClick={() => setEditingResumeId(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="resume-title">{resume.title}</span>
                      <div className="resume-actions">
                        <button
                          className="resume-action-btn"
                          onClick={() => handleEditResume(resume)}
                          title="Edit resume content"
                        >
                          Edit
                        </button>
                        <button
                          className="resume-action-btn"
                          onClick={() => handleEditResumeTitle(resume)}
                          title="Rename resume"
                        >
                          Rename
                        </button>
                        <button
                          className="resume-action-btn resume-delete-btn"
                          onClick={() => handleDeleteResume(resume.id)}
                          title="Delete resume"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="bio-placeholder">No resumes yet. Click "+ Add Resume" to create one!</p>
          )}
        </div>

        {/* Resume Name Modal */}
        {showResumeModal && (
          <div className="modal-overlay" onClick={() => setShowResumeModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Name Your Resume</h3>
              <input
                type="text"
                className="resume-title-input"
                placeholder="e.g., Software Engineer Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                autoFocus
              />
              <div className="modal-buttons">
                <button
                  className="modal-create-btn"
                  onClick={handleCreateResume}
                  disabled={creatingResume}
                >
                  {creatingResume ? "Creating..." : "Create Resume"}
                </button>
                <button
                  className="modal-cancel-btn"
                  onClick={() => setShowResumeModal(false)}
                  disabled={creatingResume}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </StudentLayout>
  );
}

export default Profile;
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./employer-side.css"; 
import EmployerLayout from "./employer-layout";
import API_BASE_URL from "./config/api.js";

function EmployerProfile() {
  const [employerData, setEmployerData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Company name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Contact person editing
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactPerson, setContactPerson] = useState("");
  const [savingContact, setSavingContact] = useState(false);

  // Email editing
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  // Description editing
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState("");
  const [savingDescription, setSavingDescription] = useState(false);

  // Picture upload
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchEmployerData() {
      try {
        const webid = sessionStorage.getItem("employer_webid");
        if (webid) {
          const webidWithoutFragment = webid.split('#')[0];

          const employerRes = await fetch(
            `${API_BASE_URL}/api/employers/?webid=${encodeURIComponent(webidWithoutFragment)}`
          );
          if (employerRes.ok) {
            const data = await employerRes.json();
            setEmployerData(data);
            setCompanyName(data.company_name || "");
            setContactPerson(data.contact_person || "");
            setEmail(data.email || "");
            setDescription(data.company_description || "Add company description");
          } else {
            const errorData = await employerRes.json();
            console.error("Failed to fetch employer data:", employerRes.status, errorData);
          }
        } else {
          console.log("No employer WebID found in sessionStorage");
        }
      } catch (error) {
        console.error("Failed to fetch employer data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployerData();
  }, []);

  // ── Company Name handlers ──────────────────────────────────────────────────

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (!companyName.trim()) {
      alert("Company name is required");
      return;
    }

    setSavingName(true);
    try {
      const webid = sessionStorage.getItem("employer_webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/employers/name/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_name: companyName.trim() }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmployerData(data);
        setCompanyName(data.company_name);
        setIsEditingName(false);
        window.location.reload(); // Refresh to update layout
      } else {
        alert("Failed to update company name. Please try again.");
      }
    } catch (error) {
      alert("Error updating company name. Please try again.");
    } finally {
      setSavingName(false);
    }
  };

  const handleNameCancel = () => {
    setCompanyName(employerData?.company_name || "");
    setIsEditingName(false);
  };

  // ── Contact Person handlers ────────────────────────────────────────────────

  const handleContactClick = () => {
    setIsEditingContact(true);
  };

  const handleContactSave = async () => {
    if (!contactPerson.trim()) {
      alert("Contact person is required");
      return;
    }

    setSavingContact(true);
    try {
      const webid = sessionStorage.getItem("employer_webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/employers/contact/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact_person: contactPerson.trim() }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmployerData(data);
        setContactPerson(data.contact_person);
        setIsEditingContact(false);
      } else {
        alert("Failed to update contact person. Please try again.");
      }
    } catch (error) {
      alert("Error updating contact person. Please try again.");
    } finally {
      setSavingContact(false);
    }
  };

  const handleContactCancel = () => {
    setContactPerson(employerData?.contact_person || "");
    setIsEditingContact(false);
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
      const webid = sessionStorage.getItem("employer_webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/employers/email/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmployerData(data);
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
    setEmail(employerData?.email || "");
    setIsEditingEmail(false);
  };

  // ── Description handlers ───────────────────────────────────────────────────

  const handleDescriptionClick = () => {
    if (description === "Add company description") setDescription("");
    setIsEditingDescription(true);
  };

  const handleDescriptionSave = async () => {
    setSavingDescription(true);
    try {
      const webid = sessionStorage.getItem("employer_webid");
      const webidWithoutFragment = webid.split('#')[0];
      const response = await fetch(
        `${API_BASE_URL}/api/employers/description/?webid=${encodeURIComponent(webidWithoutFragment)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_description: description || "Add company description" }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEmployerData(data);
        setDescription(data.company_description);
        setIsEditingDescription(false);
      } else {
        alert("Failed to update description. Please try again.");
      }
    } catch (error) {
      alert("Error updating description. Please try again.");
    } finally {
      setSavingDescription(false);
    }
  };

  const handleDescriptionCancel = () => {
    setDescription(employerData?.company_description || "Add company description");
    setIsEditingDescription(false);
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
        const webid = sessionStorage.getItem("employer_webid");
        const webidWithoutFragment = webid.split('#')[0];

        const response = await fetch(
          `${API_BASE_URL}/api/employers/picture/?webid=${encodeURIComponent(webidWithoutFragment)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile_picture: base64String }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setEmployerData(data);
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

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
        <div className="main-feed"><p>Loading...</p></div>
    );
  }

  const profilePicture = employerData?.profile_picture || "/user-image.png";

  return (
      <div className="main-feed">

        {/* ── Profile Header ── */}
        <div className="profile-details">
          <h1>Company Profile</h1>

          {/* Profile picture with upload */}
          <div className="profile-picture-container">
            <img
              src={profilePicture}
              alt="Company Logo"
              className="profile-picture"
            />
            <button
              className="employer-add-picture-button"
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

          {/* Company Name */}
          {isEditingName ? (
            <div className="name-edit-container">
              <div className="email-input-container">
                <label>Company Name:</label>
                <input
                  type="text"
                  className="name-input"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
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
              <h5>{companyName}</h5>
              <button className="employer-add-tag-button" onClick={handleNameClick} title="Edit company name">
                Edit
              </button>
            </div>
          )}

          {/* Contact Person */}
          {isEditingContact ? (
            <div className="name-edit-container">
              <div className="email-input-container">
                <label>Contact Person:</label>
                <input
                  type="text"
                  className="name-input"
                  placeholder="Contact Person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>
              <div className="bio-buttons">
                <button className="bio-save-button" onClick={handleContactSave} disabled={savingContact}>
                  {savingContact ? "Saving..." : "Save"}
                </button>
                <button className="bio-cancel-button" onClick={handleContactCancel} disabled={savingContact}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="email-display-container">
              <p className="email-text"><strong>Contact:</strong> {contactPerson}</p>
              <button className="employer-add-tag-button" onClick={handleContactClick} title="Edit contact person">
                Edit
              </button>
            </div>
          )}

          {/* Email */}
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
              <p className="email-text"><strong>Email:</strong> {email}</p>
              <button className="employer-add-tag-button" onClick={handleEmailClick} title="Edit email">
                Edit
              </button>
            </div>
          )}

          {/* Company Description */}
          {isEditingDescription ? (
            <div className="bio-edit-container">
              <textarea
                className="bio-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your company..."
                rows={4}
              />
              <div className="bio-buttons">
                <button className="bio-save-button" onClick={handleDescriptionSave} disabled={savingDescription}>
                  {savingDescription ? "Saving..." : "Save"}
                </button>
                <button className="bio-cancel-button" onClick={handleDescriptionCancel} disabled={savingDescription}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className={description === "Add company description" ? "bio-placeholder" : "bio-text"}
              onClick={handleDescriptionClick}
              style={{ cursor: "pointer" }}
            >
              {description}
            </p>
          )}
        </div>

      </div>
  );
}

export default EmployerProfile;
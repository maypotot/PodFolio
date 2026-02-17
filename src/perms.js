import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import { loadInformation, loadExperience, loadProject, loadWebsite, loadSkill, restoreSession } from "./solid.js";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { universalAccess } from "@inrupt/solid-client";

async function requestAccess(requestingID, resourceURL) {
  const session = getDefaultSession();

  try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceURL,
      requestingID,
      {
        read: true,
        write: false,
        append: false,
        control: false,
      },
      { fetch: session.fetch }
    );

    if (updatedAccess === null) {
      console.log("Could not update access (Server might not support this API or permission denied)");
    } else {
      alert("Access granted for: " + requestingID);
      console.log("Access granted for:", requestingID);
    }
  } catch (error) {
    console.error("Error granting access:", error);
  }

  return true;
}

async function denyAccess(requestingID, resourceURL) {
  const session = getDefaultSession();

  try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceURL,
      requestingID,
      {
        read: false,
        write: false,
        append: false,
        control: false,
      },
      { fetch: session.fetch }
    );

    if (updatedAccess === null) {
      console.log("Could not update access (Server might not support this API or permission denied)");
    } else {
      alert("Access removed for: " + requestingID);
      console.log("Access removed for:", requestingID);
    }
  } catch (error) {
    console.error("Error removing access:", error);
  }

  return true;
}

async function getAgentAccess(requestingID, resourceURL) {
  const session = getDefaultSession();

  try {
    return await universalAccess.getAgentAccess(
      resourceURL,
      requestingID,
      { fetch: session.fetch }
    );
  } catch (error) {
    console.error("Error reading access:", error);
    return null;
  }
}

function InPerms() {
  const [requests, setRequests] = useState([]);
  const [openRequestId, setOpenRequestId] = useState(null);
  const [selectedPortfolioByReq, setSelectedPortfolioByReq] = useState({});
  const [allowedSectionsByReq, setAllowedSectionsByReq] = useState({});
  const [portfolioOptions, setPortfolioOptions] = useState([]);
  const [infoItems, setInfoItems] = useState([]);
  const [websiteItems, setWebsiteItems] = useState([]);
  const [skillItems, setSkillItems] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [experienceItems, setExperienceItems] = useState([]);

  const accessSections = ["Information", "Website", "Skills", "Project", "Experience"];

  function toggleRequestOptions(requestId) {
    setOpenRequestId((current) => (current === requestId ? null : requestId));
  }

  function selectPortfolio(requestId, portfolioIndex, webId) {
    setSelectedPortfolioByReq((prev) => ({ ...prev, [requestId]: portfolioIndex }));
    loadExistingAccess(requestId, webId, portfolioIndex);
  }

  function toggleSection(requestId, portfolioIndex, section) {
    setAllowedSectionsByReq((prev) => {
      const requestMap = prev[requestId] || {};
      const current = requestMap[portfolioIndex] || [];
      const exists = current.includes(section);

      return {
        ...prev,
        [requestId]: {
          ...requestMap,
          [portfolioIndex]: exists
            ? current.filter((item) => item !== section)
            : [...current, section],
        },
      };
    });
  }

  function getPortfolioLabel(indexValue) {
    const match = portfolioOptions.find((option) => option.index === indexValue);
    return match ? match.label : `Resume ${indexValue}`;
  }

  async function handleSectionAccess(requestId, webId, section) {
    const selectedIndex = selectedPortfolioByReq[requestId];
    if (!selectedIndex) {
      alert("Select a portfolio first.");
      return;
    }

    const current = allowedSectionsByReq[requestId]?.[selectedIndex] || [];
    const alreadyAllowed = current.includes(section);

    if (!alreadyAllowed) {
      const sectionMap = {
        Information: infoItems,
        Website: websiteItems,
        Skills: skillItems,
        Project: projectItems,
        Experience: experienceItems,
      };

      const sectionItems = sectionMap[section] || [];
      const matchingItems = sectionItems.filter(
        (item) => Number(item.ResumeIndex) === Number(selectedIndex)
      );

      if (matchingItems.length === 0) {
        alert("No items found for this section and portfolio.");
        return;
      }

      await Promise.all(
        matchingItems.map((item) => requestAccess(webId, item.url))
      );
    } else {
      const sectionMap = {
        Information: infoItems,
        Website: websiteItems,
        Skills: skillItems,
        Project: projectItems,
        Experience: experienceItems,
      };

      const sectionItems = sectionMap[section] || [];
      const matchingItems = sectionItems.filter(
        (item) => Number(item.ResumeIndex) === Number(selectedIndex)
      );

      if (matchingItems.length === 0) {
        alert("No items found for this section and portfolio.");
        return;
      }

      await Promise.all(
        matchingItems.map((item) => denyAccess(webId, item.url))
      );
    }

    toggleSection(requestId, selectedIndex, section);
  }

  async function loadExistingAccess(requestId, webId, portfolioIndex) {
    const sectionMap = {
      Information: infoItems,
      Website: websiteItems,
      Skills: skillItems,
      Project: projectItems,
      Experience: experienceItems,
    };

    const allowedSections = [];

    for (let i = 0; i < accessSections.length; i += 1) {
      const section = accessSections[i];
      const sectionItems = sectionMap[section] || [];
      const matchingItems = sectionItems.filter(
        (item) => Number(item.ResumeIndex) === Number(portfolioIndex)
      );

      if (matchingItems.length === 0) {
        continue;
      }

      const accessList = await Promise.all(
        matchingItems.map((item) => getAgentAccess(webId, item.url))
      );

      const hasRead = accessList.some((access) => access?.read === true);
      if (hasRead) {
        allowedSections.push(section);
      }
    }

    setAllowedSectionsByReq((prev) => ({
      ...prev,
      [requestId]: {
        ...(prev[requestId] || {}),
        [portfolioIndex]: allowedSections,
      },
    }));
  }

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/requests/all/");
        const data = await res.json();
        console.log("Fetched requests:", data);
        setRequests(data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setRequests([]);
      }
    }

    async function fetchResumeOptions() {
      try {
        const user = await restoreSession();
        if (!user) {
          setPortfolioOptions([]);
          setInfoItems([]);
          setWebsiteItems([]);
          setSkillItems([]);
          setProjectItems([]);
          setExperienceItems([]);
          return;
        }

        const podInformation = await loadInformation();
        const infoList = [];

        for (let i in podInformation) {
          for (let j in podInformation[i].information) {
            infoList.push(podInformation[i].information[j]);
          }
        }

        const podWebsites = await loadWebsite();
        const websiteList = [];
        for (let i in podWebsites) {
          for (let j in podWebsites[i].website) {
            websiteList.push(podWebsites[i].website[j]);
          }
        }

        const podSkills = await loadSkill();
        const skillList = [];
        for (let i in podSkills) {
          for (let j in podSkills[i].skill) {
            skillList.push(podSkills[i].skill[j]);
          }
        }

        const podProjects = await loadProject();
        const projectList = [];
        for (let i in podProjects) {
          for (let j in podProjects[i].projects) {
            projectList.push(podProjects[i].projects[j]);
          }
        }

        const podExperiences = await loadExperience();
        const experienceList = [];
        for (let i in podExperiences) {
          for (let j in podExperiences[i].experience) {
            experienceList.push(podExperiences[i].experience[j]);
          }
        }

        const resumeIndexes = Array.from(
          new Set(infoList.map((info) => Number(info.ResumeIndex)).filter((value) => !Number.isNaN(value)))
        ).sort((a, b) => a - b);

        const nameByIndex = {};
        for (let i = 0; i < infoList.length; i += 1) {
          const indexValue = Number(infoList[i].ResumeIndex);
          if (!Number.isNaN(indexValue) && !nameByIndex[indexValue]) {
            nameByIndex[indexValue] = infoList[i].FullName;
          }
        }

        const options = resumeIndexes.map((index) => {
          const name = nameByIndex[index];
          return {
            index,
            label: name ? `Resume ${index} - ${name}` : `Resume ${index}`,
          };
        });
        setPortfolioOptions(options);
        setInfoItems(infoList);
        setWebsiteItems(websiteList);
        setSkillItems(skillList);
        setProjectItems(projectList);
        setExperienceItems(experienceList);
      } catch (error) {
        console.error("Failed to load resumes:", error);
        setPortfolioOptions([]);
        setInfoItems([]);
        setWebsiteItems([]);
        setSkillItems([]);
        setProjectItems([]);
        setExperienceItems([]);
      }
    }

    fetchRequests();
    fetchResumeOptions();
  }, []);

  return (
    <main className="view-resume">
      {/* Header */}
      <header className="app-header">
        <div className="header-section">
          <Link to="/homefeed">
            <img src="/logo.png" alt="App Logo" className="header-logo" />
          </Link>
          <input type="text" placeholder="Search jobs..." className="search-input" />
          <button className="search-button">Search</button>
        </div>
        <div className="header-section">
          <img src="/Spongebob.webp" alt="User Avatar" className="avatar-icon" />
          <button className="header-buttons">
            <img src="/notifications-icon.png" alt="Notifications" className="button-icons" />
          </button>
          <button className="header-buttons">
            <img src="/settings-icon.png" alt="Settings" className="button-icons" />
          </button>
        </div>
      </header>

      <div className="content">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="left-panel-section">
            <img src="/Spongebob.webp" alt="User" className="user-icon"/>
            <div className="user-name" id="fart">Student User</div>
          </div>
          <div className="left-panel-section">
            <h3>Explore panel</h3>
            <Link className="panel-options" to="/profile">
              <button className="panel-buttons">
                <img src="/user.png" alt="user" className="button-icons-black"/> 
              </button>
              Profile
            </Link><br/>
            <Link className="panel-options" to="/homefeed">
              <button className="panel-buttons">
                <img src="/data-analytics.png" alt="analytics" className="button-icons-black"/> 
              </button>
              User analytics
            </Link><br/>
            <h3>Settings</h3>
            <Link className="panel-options" to="/homefeed">
              <button className="panel-buttons">
                <img src="/settings-icon.png" alt="settings" className="button-icons"/> 
              </button>
              Settings
            </Link><br/>
            <Link className="panel-options" to="/homefeed">
              <button className="panel-buttons">
                <img src="/secure.png" alt="security" className="button-icons-black"/> 
              </button>
              Security data
            </Link><br/>
            <Link to="/">
              <button className="log-out-button">Log Out</button>
            </Link>
          </div>
        </div>

        {/* Main Feed */}
        <div className="resume">
          <h1>All Employer Requests</h1>
          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <ul>
              {requests.map((req) => (
                <li key={req.id} className="incoming-perms">
                  <div className="job-info">
                    <h4>Request from: {req.employer_webid}</h4>
                    <p>Intended for: {req.applicant_webid}</p>
                    <p>Summary: {req.summary}</p>
                    <p>Job Application ID: {req.job_application?.id || "N/A"}</p>
                    <button
                      onClick={() => toggleRequestOptions(req.id)}
                    >
                      Configure Permissions
                    </button>
                    {openRequestId === req.id && (
                      <div className="resume-section">
                        <h4>Select portfolio</h4>
                        <div>
                          {portfolioOptions.length === 0 ? (
                            <p>No resumes found.</p>
                          ) : (
                            portfolioOptions.map((option) => (
                              <button
                                key={option.index}
                                onClick={() => selectPortfolio(req.id, option.index, req.employer_webid)}
                              >
                                {option.label}
                              </button>
                            ))
                          )}
                        </div>
                        {selectedPortfolioByReq[req.id] && (
                          <div>
                            <p>Selected: {getPortfolioLabel(selectedPortfolioByReq[req.id])}</p>
                            <h4>Allow access to</h4>
                            <div>
                              {accessSections.map((section) => (
                                <button
                                  key={section}
                                  onClick={() => handleSectionAccess(req.id, req.employer_webid, section)}
                                >
                                  {allowedSectionsByReq[req.id]?.[selectedPortfolioByReq[req.id]]?.includes(section)
                                    ? "Remove "
                                    : "Allow "}{section}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

export default InPerms;

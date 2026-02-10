import React from "react";
import { Link } from "react-router-dom";
import "./main.css"; 
import { issueAccessRequest }  from "@inrupt/solid-client-access-grants";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { 
  getSolidDatasetWithAcl, 
  getResourceAcl, 
  createAclFromFallbackAcl, 
  setAgentResourceAccess, 
  saveAclFor,
  hasResourceAcl,
  hasAccessibleAcl
} from "@inrupt/solid-client";

import { restoreSession } from "./solid.js";

import { universalAccess } from "@inrupt/solid-client";

import { 
  loadInformation,
  loadAward,
  loadExperience,
  loadImage,
  loadReference,
  loadProject,
  loadTraining,
 } from "./solid.js";

import { 
  createInformation,
  createWebsite,
  createProject,
  createExperience,
  createSkill,
 } from "./main.js";
 
const user = await restoreSession();

async function requestAccess(){
    const session = getDefaultSession();
    let requestingID = document.getElementById("requestingID").value
    let resourceURL = document.getElementById("resourceURL").value

    // // ExamplePrinter sets the requested access (if granted) to expire in 5 minutes.
    // let accessExpiration = new Date( Date.now() +  5 * 60000 );

    // // Call `issueAccessRequest` to create an Access Request
    // //
    // console.log(session)
    // console.log(session.fetch)
    // // 1. Fetch the resource with its ACL
    // const myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL, { fetch: session.fetch });
    // console.log(myDatasetWithAcl)
    // // 2. Get the ACL (or create it if it doesn't exist)
    // let resourceAcl;
    // if (!hasResourceAcl(myDatasetWithAcl)) {
    //   if (!hasAccessibleAcl(myDatasetWithAcl)) {
    //     throw new Error("The current user does not have permission to change access rights to this Resource.");
    //   }
    //   // Create a new ACL based on the fallback
    //   console.log("Creating ACL")
    //   resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
    // } else {
    //   console.log("Getting ACL")
    //   resourceAcl = getResourceAcl(myDatasetWithAcl);
    // }

    // // 3. Update the ACL to give access to a specific WebID
    // console.log("Updating ACL")
    // const updatedAcl = setAgentResourceAccess(
    //   resourceAcl,
    //   resourceRequestingID, // The person you want to give access to
    //   { read: true, write: false, append: false, control: false }
    // );
    // console.log("Saving ACL")
    // // 4. Save the changes
    // await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: session.fetch });
    // alert("Request is finished")

    try {
    const updatedAccess = await universalAccess.setAgentAccess(
      resourceURL, // The URL of the file/folder
      requestingID,   // The WebID of the user to remove
      { 
        read: true, 
        write: false, 
        append: false, 
        control: false 
      },
      { fetch: session.fetch }
    );

    if (updatedAccess === null) {
      console.log("Could not update access (Server might not support this API or permission denied)");
    } else {
      console.log("Access granted for:", requestingID);
    }
  } catch (error) {
    console.error("Error granting access:", error);
  }
  alert("Request is finished")
}

async function checkID(){
    const user = await restoreSession();
    alert(user.storageUrl)
}

function Auth() {
  return (
    <main className= "create-resume">
      <header className = "app-header">
        <div className="header-section">
            <Link to="/homefeed">
              <img src="/logo.png" alt="App Logo" className="header-logo" />
            </Link>
          <input
              type="text"
              placeholder="Search jobs..."
              className = "search-input"
            />
          <button className="search-button">
              Search
          </button>
        </div>
        <div className="header-section">
            <img src="/Spongebob.webp" alt="User Avatar" className="avatar-icon"/>
            <button className="header-buttons">
                <img src="/notifications-icon.png" alt="Notifications" className="button-icons"/>
            </button>
            <button className="header-buttons">
                <img src="/settings-icon.png" alt="Settings" className="button-icons"/>
            </button>
        </div>
      </header>
      <div className="content">
        <div className="resume">
          <div className="tag-header">
            <h1>Authorization</h1>
          </div>
          <div className="notification-list">
            <div className="notification-bubble">
              <h2 className="notification-name">Alyssa Tan</h2>
              <p className="notification-summary">
                Requesting access to your resume for internship screening. Wants to view Personal Info and Projects.
              </p>
              <div className="notification-actions">
                <Link to="/config-perms">
                  <button className="permissions-button">Edit permissions</button>
                </Link>
              </div>
            </div>

            <div className="notification-bubble">
              <h2 className="notification-name">Marco Reyes</h2>
              <p className="notification-summary">
                Requesting data for a software engineer role. Needs Education and Experience sections.
              </p>
              <div className="notification-actions">
                <Link to="/config-perms">
                  <button className="permissions-button">Edit permissions</button>
                </Link>
              </div>
            </div>

            <div className="notification-bubble">
              <h2 className="notification-name">Priya Singh</h2>
              <p className="notification-summary">
                Requesting access for scholarship review. Interested in Awards and Training details.
              </p>
              <div className="notification-actions">
                <Link to="/config-perms">
                  <button className="permissions-button">Edit permissions</button>
                </Link>
              </div>
            </div>

            <div className="notification-bubble">
              <h2 className="notification-name">Jae Kim</h2>
              <p className="notification-summary">
                Requesting resume data for freelance collaboration. Wants to view Skills and Projects.
              </p>
              <div className="notification-actions">
                <Link to="/config-perms">
                  <button className="permissions-button">Edit permissions</button>
                </Link>
              </div>
            </div>

            <div className="notification-bubble">
              <h2 className="notification-name">Elena Cruz</h2>
              <p className="notification-summary">
                Requesting access for job application review. Interested in Personal Info and Experience.
              </p>
              <div className="notification-actions">
                <Link to="/config-perms">
                  <button className="permissions-button">Edit permissions</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </main>
  );
}


export default Auth;



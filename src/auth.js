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
    let resourceRequestingID = document.getElementById("requestingID").value
    let resourceURL = document.getElementById("resourceURL").value

    // ExamplePrinter sets the requested access (if granted) to expire in 5 minutes.
    let accessExpiration = new Date( Date.now() +  5 * 60000 );

    // Call `issueAccessRequest` to create an Access Request
    //
    console.log(session)
    console.log(session.fetch)
    // 1. Fetch the resource with its ACL
    const myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL, { fetch: session.fetch });
    console.log(myDatasetWithAcl)
    // 2. Get the ACL (or create it if it doesn't exist)
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
      if (!hasAccessibleAcl(myDatasetWithAcl)) {
        throw new Error("The current user does not have permission to change access rights to this Resource.");
      }
      // Create a new ACL based on the fallback
      console.log("Creating ACL")
      resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
    } else {
      console.log("Getting ACL")
      resourceAcl = getResourceAcl(myDatasetWithAcl);
    }

    // 3. Update the ACL to give access to a specific WebID
    console.log("Updating ACL")
    const updatedAcl = setAgentResourceAccess(
      resourceAcl,
      resourceRequestingID, // The person you want to give access to
      { read: true, write: false, append: false, control: false }
    );
    console.log("Saving ACL")
    // 4. Save the changes
    await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: session.fetch });
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
          <h2>Requesting ID</h2>
          <input id="requestingID"></input>
          <h2>Resource URL</h2>
          <input id="resourceURL"></input>
          <br></br>
          <br></br>
          <button onClick={requestAccess}>Request data</button>
          <button onClick={checkID}>Check WebID</button>

          
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h2>Target ID</h2>
          <input id="targetID"></input>
          <h2>Request Description</h2>
          <textarea 
            rows={5}
            id="requestDescription"></textarea>
          <br></br>
          <br></br>
          <button onClick={requestAccess}>Request data</button>
          <button onClick={checkID}>Check WebID</button>



        </div>
      </div>
    
    </main>
  );
}


export default Auth;



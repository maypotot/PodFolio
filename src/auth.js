import React from "react";
import { Link } from "react-router-dom";
import "./main.css"; 
import { issueAccessRequest }  from "@inrupt/solid-client-access-grants";

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

    let resourceOwner = document.getElementById("targetID").value
    let resourceURL = document.getElementById("resourceURL").value

    // ExamplePrinter sets the requested access (if granted) to expire in 5 minutes.
    let accessExpiration = new Date( Date.now() +  5 * 60000 );

    // Call `issueAccessRequest` to create an Access Request
    //
    const requestVC = await issueAccessRequest(
        {
            "access":  { read: true },
            "resources": resourceURL,
            "resourceOwner": resourceOwner,
            "expirationDate": accessExpiration,
            "purpose": [ "https://example.com/purposes#print" ]
        },
        { fetch : user.fetch } // From the requestor's (i.e., ExamplePrinter's) authenticated session
    );
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
          <h2>Target ID</h2>
          <input id="targetID"></input>
          <h2>Requesting ID</h2>
          <input id="tequestingID"></input>
          <h2>Resource URL</h2>
          <input id="resourceURL"></input>
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



import { useState } from "react";
import "./App.css";

function App() {
  // --- State for login/logout ---
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // --- Example placeholder functions ---
  function login() {
    // Here you'll later connect your Solid login logic
    setLoggedIn(true);
    setUsername("Bianca Mae");
  }

  function logout() {
    setLoggedIn(false);
    setUsername("");
  }

  function createInformation() {
    alert("Information saved! (hook this up later)");
  }

  return (
    <main>
      <h1>
        Solid Hello World
        <br />
        <small>(REST API)</small>
      </h1>

      {/* LOADING SECTION */}
      <div id="loading" style={{ display: "none" }}>
        <p>Loading...</p>
      </div>

      {/* GUEST VIEW */}
      {!loggedIn && (
        <div id="auth-guest">
          <p>Hi there!</p>
          <p>
            This page is a showcase of a simple{" "}
            <a href="https://solidproject.org/" target="_blank" rel="noreferrer">
              Solid application
            </a>{" "}
            built using JavaScript, CSS and HTML. You can look at the source code and learn how to use it in{" "}
            <a
              href="https://github.com/0dataapp/hello/tree/main/solid/solid-rest-api"
              target="_blank"
              rel="noreferrer"
            >
              the repository
            </a>.
          </p>

          <p>
            If you want to see other examples, you can find them here:{" "}
            <a href="../">Solid Hello World Examples</a>.
          </p>

          <button type="button" onClick={login}>
            Log in with Solid
          </button>

          <p>
            <small>
              If you don't have one, you can{" "}
              <a href="https://solidproject.org/users/get-a-pod" target="_blank" rel="noreferrer">
                get a Solid Pod
              </a>.
            </small>
          </p>
        </div>
      )}

      {/* USER VIEW */}
      {loggedIn && (
        <div id="auth-user">
          <p>Hello, <span>{username}</span>!</p>
          <button type="button" onClick={logout}>
            Log out
          </button>
          <br />
          <br />

          <input type="text" placeholder="Please enter your full name" />
          <br />
          <input type="text" placeholder="Please enter your professional title" />
          <br />
          <input type="text" placeholder="Please enter a brief summary about yourself" />
          <br />
          <input type="text" placeholder="Please enter your email address" />
          <br />
          <input type="text" placeholder="Please enter your contact number" />
          <br />
          <input type="text" placeholder="Please enter your location" />
          <br />
          <input type="text" placeholder="Please enter your website link" />
          <br />
          <input type="text" placeholder="Please enter your professional summary" />
          <br />
          <input type="text" placeholder="Please enter your school" />
          <br />
          <input type="text" placeholder="Please enter your degree" />
          <br />
          <input type="text" placeholder="Please enter your program" />
          <br />
          <input type="text" placeholder="Please enter your start date" />
          <br />
          <input type="text" placeholder="Please enter your end date" />
          <br />
          <input type="text" placeholder="Please enter your relevant coursework" />
          <br />
          <input type="text" placeholder="Please enter your honors" />
          <br />
          <input type="text" placeholder="Please enter your thesis title" />
          <br />
          <button type="button" onClick={createInformation}>
            Save Information
          </button>

          <ul id="information"></ul>
        </div>
      )}
    </main>
  );
}

export default App;

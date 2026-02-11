import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomeFeed from "./homefeed";
import Profile from "./profile";
import CreateResume from "./create_resume";
import ViewResume from "./view_resume";
import ConfigPerms from "./config_perms";
import InPerms from "./perms"
import EmployerLogin from "./employer_login.js";
import EmployerHomeFeed from "./employer-homefeed.js";
import JobApplicants from "./employer-job-applicants.js";
import EmployerLayout from "./employer-layout.js";



import { useNavigate } from "react-router-dom";

import { login, logout } from "./main.js";
import { restoreSession } from "./solid.js";

const user = await restoreSession();

function Home() {
  return (
    <main className="home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <div className="button-container">
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        { !user ? (
          <button onClick={login}>Log In</button>
        ) : (
          <Link to="/homefeed">
            <button>Go to Home</button>
          </Link>
        )}
          <button onClick={logout}>Logout</button>
      </div>
      <Link to="/employer-login">
        <p className="plink">Are you an employer? Sign up as an Employer</p>
      </Link>
    </main>
  )
}

function Signup() {
  return (
    <main className = "home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <Link to="/">← Back to Home</Link>
    </main>
  )
}

function Login() {
  const [webid, setWebId] = useState("");
  const navigate = useNavigate();

  function handleLogin(){
    console.log("Logging in with WebID:", webid);
    if (webid.trim() !== "") {
      sessionStorage.setItem("webid", webid);
      navigate("/homefeed");
    }
  }


  return (
    <main className = "home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>WebID</label>
          <input
            type="text"
            value={webid}
            onChange={(e) => setWebId(e.target.value)}
            placeholder="https://yourpod.solidcommunity.net/"
            className = "webid-input"
          />
        </div>
        <button className="login-button" type="submit">Log In</button>
        <Link className="back-link" to="/">← Back </Link>
      </form>
    </main>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homefeed" element={<HomeFeed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-resume" element={<CreateResume/>}/>
        <Route path="/view-resume" element={<ViewResume/>}/>
        <Route path="/in-perms" element={<InPerms/>}/>
        <Route path="/config-perms" element={<ConfigPerms/>}/>
        <Route path="/employer-login" element={<EmployerLogin/>}/>
        <Route path="/employer-homefeed" element={<EmployerLayout><EmployerHomeFeed/></EmployerLayout>}/>
        <Route path="/jobs/:jobId/applicants" element={<EmployerLayout><JobApplicants/></EmployerLayout>}/>
      </Routes>
    </Router>
  )
}

export default App;


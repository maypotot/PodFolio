import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import HomeFeed from "./student-homefeed.js";
import Profile from "./student-profile.js";
import CreateResume from "./student-create_resume.js";
import ViewResume from "./student-view-resume.js";
import EditResume from "./student-edit-resume.js";
import ConfigPerms from "./student-config-perms.js";
import InPerms from "./student-perms.js"
import { EmployerHome, EmployerSignup, EmployerLogin } from "./employer-auth.js";
import EmployerHomeFeed from "./employer-homefeed.js";
import EmployerCreateJob from "./employer-create-job.js";
import JobApplicants from "./employer-job-applicants.js";
import EmployerLayout from "./employer-layout.js";
import StudentSearch from "./employer-search-result.js";
import EmployerProfile from "./employer-profile.js"; 
import EmployerNotifs from "./employer-notifs.js";
import EmployerViewResume from "./employer-view-resume.js";
import EmployerAccessResumes from "./employer-access-resumes.js";

import { useNavigate } from "react-router-dom";

import { login, logout } from "./main.js";
import { restoreSession } from "./solid.js";
import StudentLayout from "./student-layout.js";

import API_BASE_URL from "./config/api.js";

let solidUser; // Global variable to hold the authenticated Solid user

function Home() {
  return (
    <main className="home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <div className="button-container">
        <Link to="/signup">
          <button className="student-login-button">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="student-login-button">Log In</button>
        </Link>
      </div>
      <Link to="/employer-home">
        <p className="plink">Are you an employer? Sign up as an Employer</p>
      </Link>
    </main>
  )
}

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    webid: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.webid) {
      setError("Please fill in all required fields");
      return;
    }

    // Strip the fragment (#me) from WebID before saving
    const webidWithoutFragment = formData.webid.split('#')[0];

    try {
      const response = await fetch(`${API_BASE_URL}/api/students/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          webid: webidWithoutFragment  // Save without #me
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Handle validation errors
        if (data.email) {
          setError("Email already exists");
        } else if (data.webid) {
          setError("WebID already exists");
        } else {
          setError(data.error || "Failed to create account. Please try again.");
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <main className="home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <h2>Create Your Account</h2>
      
      {success ? (
        <div className="success-message">
          <p>Account created successfully! Please log in with your Solid Pod...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="webid">WebID *</label>
            <input
              type="text"
              id="webid"
              name="webid"
              value={formData.webid}
              onChange={handleChange}
              placeholder="https://yourpod.solidcommunity.net/profile/card#me"
              className="webid-input"
              required
            />
            <small className="field-hint">
              Make sure this matches your Solid Pod WebID exactly
            </small>
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
          
          <div className="signup-links">
            <Link to="/" className="back-link">← Back to Home</Link>
            <a 
              href="https://solidcommunity.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="solid-link"
            >
              No WebID? Register for a Solid Pod Here
            </a>
          </div>
        </form>
      )}
    </main>
  )
}

function Login() {
  const [webid, setWebId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Check DB, Step 2: Solid Auth
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if we're returning from Solid authentication
  useEffect(() => {
    async function checkSolidSession() {
      try {
        console.log("Checking Solid session...");
        // Get the WebID that was stored before Solid auth
        const expectedWebId = sessionStorage.getItem("login_webid");
        console.log("Expected WebID from sessionStorage:", expectedWebId);

        // Check if there's a Solid session
        if (sessionStorage.getItem("login_webid")) {
          solidUser = await restoreSession();
        } else {
          console.log("Skipping restoreSession as user has not initiated Solid authentication.");
        }
        console.log("Solid session restored:", solidUser);

        if (solidUser) {
          console.log("Detected Solid session after redirect:", solidUser.url);
          console.log("Expected WebID:", expectedWebId);

          if (solidUser.url === expectedWebId) {
            console.log("WebIDs match! Completing login...");

            // Store the full WebID in session storage
            sessionStorage.setItem("webid", expectedWebId);

            // Clear the temporary login WebID
            sessionStorage.removeItem("login_webid");

            // Show connected state and wait for user action
            setStep(3);
            return;
          } else {
            console.log("WebIDs don't match");
            setError("The Solid account you logged in with doesn't match. Please try again.");
            sessionStorage.removeItem("login_webid");
            setStep(1);
          }
        }
      } catch (err) {
        console.error("Error checking Solid session:", err);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkSolidSession();
  }, [navigate]);

  async function handleCheckWebId(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Checking WebID in database:", webid);

    if (webid.trim() === "") {
      setError("Please enter your WebID");
      setLoading(false);
      return;
    }

    try {
      // Strip fragment before checking database
      const webidWithoutFragment = webid.split('#')[0];
      console.log("WebID without fragment:", webidWithoutFragment);

      // Check if WebID exists in database
      const response = await fetch(
        `${API_BASE_URL}/api/students/?webid=${encodeURIComponent(webidWithoutFragment)}`
      );
      console.log("Database response status:", response.status);

      if (response.ok) {
        // WebID exists in database - proceed to Solid authentication
        const studentData = await response.json();
        console.log("WebID found in database:", studentData);

        // Store the WebID temporarily so we can verify it after Solid redirect
        sessionStorage.setItem("login_webid", webid);

        // Move to step 2: Solid authentication
        setStep(2);
        setLoading(false);
      } else if (response.status === 404) {
        // WebID not found in database
        setError("Account not found. Please sign up first.");
        setLoading(false);
      } else {
        // Other error
        setError("Error checking account. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Database check error:", err);
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  async function handleSolidAuth() {
    setError("");
    setLoading(true);

    try {
      // Trigger Solid authentication
      console.log("Starting Solid authentication...");
      await login();
      // After login() triggers, Solid will redirect back to this page
      // The useEffect will handle the rest
    } catch (err) {
      console.error("Solid authentication error:", err);
      setError("Solid authentication failed. Please try again.");
      setLoading(false);
    }
  }

  // DEBUGGING: Direct navigation to homefeed with WebID stored
  function handleDebugNavigation() {
    // Store the WebID in sessionStorage before navigating
    sessionStorage.setItem("webid", webid);
    console.log("DEBUG: Stored WebID in sessionStorage:", webid);
    navigate("/homefeed");
  }

  if (checkingAuth) {
    return (
      <main className="home">
        <img src="/logo.png" alt="App Logo" className="logo" />
        <div className="login-form">
          <p>Checking authentication...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <h2>Log In</h2>
      
      <div className="login-form">
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 && !sessionStorage.getItem("login_webid") ? (
          // Step 1: Enter WebID and check database
          <>
            <p className="login-info">
              Enter your WebID to log in. We'll verify your account before connecting to your Solid Pod.
            </p>
            
            <form onSubmit={handleCheckWebId}>
              <div className="form-group">
                <label htmlFor="webid">WebID</label>
                <input
                  type="text"
                  id="webid"
                  value={webid}
                  onChange={(e) => setWebId(e.target.value)}
                  placeholder="https://yourpod.solidcommunity.net/profile/card#me"
                  className="webid-input"
                  required
                />
              </div>
              
              <button 
                className="login-button" 
                type="submit"
                disabled={loading}
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          </>
        ) : step === 3 ? (
          // Step 3: Solid connected
          <>
            <div className="success-badge">
              ✓ Solid Pod Connected
            </div>

            <p className="login-info">
              Solid Pod has been connected. You can now continue to your homefeed.
            </p>

            <button
              className="solid-auth-button"
              onClick={() => navigate("/homefeed")}
            >
              Go to Homefeed
            </button>
          </>
        ) : step === 2 ? (
          // Step 2: Authenticate with Solid
          <>
            <div className="success-badge">
              ✓ Account Found
            </div>
            
            <p className="login-info">
              Now authenticate with your Solid Pod to complete login.
            </p>
            
            <button 
              className="solid-auth-button" 
              onClick={handleSolidAuth}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Authenticate with Solid"}
            </button>

            {/* DEBUG BUTTON - Remove this in production */}
            <button 
              className="debug-button" 
              onClick={handleDebugNavigation}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "0.5rem"
              }}
            >
              DEBUG: Go to Homefeed (Skip Solid Auth)
            </button>

            <button 
              className="back-button" 
              onClick={() => {
                setStep(1);
                sessionStorage.removeItem("login_webid");
              }}
              disabled={loading}
            >
              ← Use Different WebID
            </button>
          </>
           ): (
          <p className="login-info">
            Checking Solid Pod Connection...
          </p>
        )}
        
        <div className="login-links">
          <Link className="back-link" to="/">← Back to Home</Link>
          <Link to="/signup" className="signup-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homefeed" element={<HomeFeed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-resume" element={<StudentLayout><CreateResume/></StudentLayout>}/>
        <Route path="/edit-resume" element={<StudentLayout><EditResume/></StudentLayout>}/>
        <Route path="/view-resume" element={<StudentLayout><ViewResume/></StudentLayout>}/>
        <Route path="/in-perms" element={<StudentLayout><InPerms/></StudentLayout>}/>
        <Route path="/config-perms" element={<StudentLayout><ConfigPerms/></StudentLayout>}/>
        
        {/* Employer Routes */}
        <Route path="/employer-home" element={<EmployerHome/>}/>
        <Route path="/employer-signup" element={<EmployerSignup/>}/>
        <Route path="/employer-login" element={<EmployerLogin/>}/>
        <Route path="/employer-homefeed" element={<EmployerLayout><EmployerHomeFeed/></EmployerLayout>}/>
        <Route path="/employer-create-job" element={<EmployerCreateJob/>}/>
        <Route path="/jobs/:jobId/applicants" element={<EmployerLayout><JobApplicants/></EmployerLayout>}/>
        <Route path="/employer-student-search" element={<EmployerLayout><StudentSearch/></EmployerLayout>}/>
        <Route path="/employer-profile" element={<EmployerLayout><EmployerProfile/></EmployerLayout>}/>
        <Route path="/employer-notifs" element={<EmployerLayout><EmployerNotifs/></EmployerLayout>}/>
        <Route path="/employer-view-resume" element={<EmployerLayout><EmployerViewResume/></EmployerLayout>}/>
        <Route path="/employer-access-resumes" element={<EmployerLayout><EmployerAccessResumes/></EmployerLayout>}/>
      </Routes>
    </Router>
  )
}

export default App;
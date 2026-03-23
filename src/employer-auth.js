import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./employer-side.css";
import { login } from "./main.js";
import { restoreSession } from "./solid.js";

let solidUser; // Global variable to hold the authenticated Solid user

function EmployerHome() {
  return (
    <main className="home">
      <img src="/logo-green-01.png" alt="App Logo" className="logo" />
      <div className="button-container">
        <Link to="/employer-signup">
          <button className="employer-button">Sign Up</button>
        </Link>
        <Link to="/employer-login">
          <button className="employer-button">Log In</button>
        </Link>
      </div>
      <Link to="/">
        <p className="plink">Are you a job seeker? Sign up as a Job Seeker</p>
      </Link>
    </main>
  );
}

function EmployerSignup() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
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
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.webid) {
      setError("Please fill in all required fields");
      return;
    }

    // Strip the fragment (#me) from WebID before saving
    const webidWithoutFragment = formData.webid.split('#')[0];

    try {
      const response = await fetch("https://podfolio-b952.onrender.com/api/employers/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          webid: webidWithoutFragment  // Save without #me
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirect to employer login after 2 seconds
        setTimeout(() => {
          navigate("/employer-login");
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
      console.error("Employer signup error:", err);
    }
  };

  return (
    <main className="home">
      <img src="/logo-green-01.png" alt="App Logo" className="logo" />
      <h2>Create Employer Account</h2>
      
      {success ? (
        <div className="success-message">
          <p>Account created successfully! Please log in with your Solid Pod...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactPerson">Contact Person *</label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Enter contact person name"
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
              placeholder="company@example.com"
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
            <Link to="/employer-home" className="back-link">← Back to Home</Link>
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
  );
}

function EmployerLogin() {
  const [webid, setWebId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  // Check if returning from Solid authentication
  useEffect(() => {
    async function checkSolidSession() {
      console.log("employer login")
      try {
        const expectedWebId = sessionStorage.getItem("employer_login_webid");
        console.log("Checking for Solid session... Expected WebID:", expectedWebId);
        if (expectedWebId) {
          solidUser = await restoreSession();
        } else {
          console.log("Skipping restoreSession: employer has not initiated Solid authentication.");
        }
        console.log("restoreSession returned:", solidUser);
        
        if (solidUser) {
          console.log("Detected Solid session for employer:", solidUser.url);
          console.log("Expected WebID:", expectedWebId);

          if (solidUser.url === expectedWebId) {  
            console.log("Employer WebIDs match! Completing login...");
            
            sessionStorage.setItem("employer_webid", expectedWebId);

            sessionStorage.removeItem("employer_login_webid");
            
            setStep(3);
            return;
          } else {
            console.log("WebIDs don't match");
            console.log("Solid returned:", solidUser.url);
            console.log("Expected:", expectedWebId);
            setError("The Solid account you logged in with doesn't match. Please try again.");
            sessionStorage.removeItem("employer_login_webid");
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

    console.log("Checking employer WebID in database:", webid);
    
    if (webid.trim() === "") {
      setError("Please enter your WebID");
      setLoading(false);
      return;
    }

    try {
      const webidWithoutFragment = webid.split('#')[0];
      
      const response = await fetch(
        `https://podfolio-b952.onrender.com/api/employers/?webid=${encodeURIComponent(webidWithoutFragment)}`
      );

      if (response.ok) {
        const employerData = await response.json();
        console.log("Employer WebID found in database:", employerData);
        
        sessionStorage.setItem("employer_login_webid", webid);
        setStep(2);
        setLoading(false);
      } else if (response.status === 404) {
        setError("Employer account not found. Please sign up first.");
        setLoading(false);
      } else {
        setError("Error checking account. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Database check error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  async function handleSolidAuth() {
    setError("");
    setLoading(true);

    try {
      console.log("Starting Solid authentication for employer...");
      sessionStorage.removeItem("login_webid");
      await login();
    } catch (err) {
      console.error("Solid authentication error:", err);
      setError("Solid authentication failed. Please try again.");
      setLoading(false);
    }
  }

  function handleDebugNavigation() {
    sessionStorage.setItem("employer_webid", webid);
    console.log("DEBUG: Stored employer WebID:", webid);
    navigate("/employer-homefeed");
  }

  if (checkingAuth) {
    return (
      <main className="home">
        <img src="/logo-green-01.png" alt="App Logo" className="logo" />
        <div className="login-form">
          <p>Checking authentication...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <img src="/logo-green-01.png" alt="App Logo" className="logo" />
      <h2>Employer Log In</h2>
      
      <div className="login-form">
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <>
            <p className="login-info">
              Enter your WebID to log in. We'll verify your employer account first.
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
              onClick={() => navigate("/employer-homefeed")}
            >
              Go to Homefeed
            </button>
          </>
        ) : step === 2 ? (
          <>
            <div className="success-badge">
              ✓ Employer Account Found
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
              DEBUG: Go to Employer Feed
            </button>

            <button 
              className="back-button" 
              onClick={() => {
                setStep(1);
                sessionStorage.removeItem("employer_login_webid");
              }}
              disabled={loading}
            >
              ← Use Different WebID
            </button>
          </>
           ): (
          <p className="login-info">
            Unexpected state. Please refresh the page and try again.
          </p>
        )}
        
        <div className="login-links">
          <Link className="back-link" to="/employer-home">← Back to Home</Link>
          <Link to="/employer-signup" className="signup-link">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

export { EmployerHome, EmployerSignup, EmployerLogin };
import { useState } from "react";
import { Link } from "react-router-dom";
import "./employer-side.css"; 
import { useNavigate } from "react-router-dom";

function EmployerLogin() {
  const [webid, setWebId] = useState("");
  const navigate = useNavigate();

function handleLogin(e){
  e.preventDefault();
  console.log("Logging in with WebID:", webid);
  if (webid.trim() !== "") {
    sessionStorage.setItem("webid", webid);
    navigate("/employer-homefeed");
  }
}



  return (
    <main className = "home">
      <img src="/logo-green-01.png" alt="App Logo" className="logo" />
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

export default EmployerLogin

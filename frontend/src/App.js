import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { login } from "@inrupt/solid-client-authn-browser";

function Home() {
  return (
    <main className="home">
      <img src="/logo.png" alt="App Logo" className="logo" />
      <div className="button-container">
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Log In</button>
        </Link>
      </div>
      <Link to="#">
        <p className="plink">Are you an employer? Sign up as an Employer</p>
      </Link>
    </main>
  )
}

function Signup() {
  return (
    <main>
      <h1>Sign Up Page</h1>
      <Link to="/">← Back to Home</Link>
    </main>
  )
}

function Login() {
  return (
    <main>
      <h1>Log In Page</h1>
      <Link to="/">← Back to Home</Link>
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
      </Routes>
    </Router>
  )
}

export default App;

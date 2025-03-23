import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Drivers from "./pages/Drivers";
import Trucks from "./pages/Trucks";
import Assignments from "./pages/Assignments";
import "./App.css";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const isAdmin = userRole === "admin";

  // Update role when localStorage changes (e.g., after login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setUserRole(null); // Clear state
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="App">
      <nav className="navbar">
  <div className="nav-left">
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      {isAdmin && <li><Link to="/drivers">Drivers</Link></li>}
      {isAdmin && <li><Link to="/trucks">Trucks</Link></li>}
      <li><Link to="/assignments">Assignments</Link></li>
    </ul>
  </div>
  <div className="nav-right">
    <ul className="nav-links">
      <li><Link to="/register">Register</Link></li>
      <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
    </ul>
  </div>
</nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            {isAdmin && <Route path="/drivers" element={<Drivers />} />}
            {isAdmin && <Route path="/trucks" element={<Trucks />} />}
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
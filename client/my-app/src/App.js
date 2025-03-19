import React, { useState, useEffect } from "react";
import {Routes, Route, Link, Navigate } from "react-router-dom"; // ✅ Added BrowserRouter
import Trucks from "./pages/Trucks";
import Assignments from "./pages/Assignments";
import "./App.css";

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const isAdmin = userRole === "admin";

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  return (
    <div className="App">
      <nav className="navbar">
  <div className="nav-left">
    <ul className="nav-links">
      <li><Link to="/trucks">Trucks</Link></li>
      <li><Link to="/assignments">Assignments</Link></li>
      {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
    </ul>
  </div>
</nav>


      <div className="content">
        <Routes> {/* ✅ Make sure Router is not used here */}
          <Route path="/trucks" element={<Trucks />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

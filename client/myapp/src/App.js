import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Drivers from "./pages/Drivers";
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



  return (

      <div className="App">
      <nav className="navbar">
  <div className="nav-left">
    <ul className="nav-links">
      
      {isAdmin && <li><Link to="/drivers">Drivers</Link></li>}
    
    </ul>
  </div>
  
  <div className="nav-right">
    <ul className="nav-links">
    <li><Link to="/drivers">Drivers</Link></li>
    {isAdmin && <li><Link to="/admin">Admin Panel</Link></li>}
      
    </ul>
  </div>
</nav>

        <div className="content">
          <Routes>
          
            <Route path="/drivers" element={<Drivers />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
   
  );
}

export default App;
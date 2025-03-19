import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Assignments.css"; // ✅ Importing the CSS file

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);

  // 🔄 Fetch Assignments from Backend (to be implemented)
  useEffect(() => {
    axios
      .get("http://localhost:5000/assignments")
      .then((response) => setAssignments(response.data))
      .catch((error) => console.error("Error fetching assignments:", error));
  }, []);

  // ➕ Add Assignment
  const handleAddAssignment = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: assignments.length + 1, // This will be replaced with backend ID
      truckId: "T003", // Replace with form input
      driverName: "New Driver", // Replace with form input
      status: "Pending",
    };

    setAssignments([...assignments, newAssignment]); // Temporary before backend
    // Later, replace with a POST request to backend
  };

  // ✏️ Update Assignment
  const handleUpdateAssignment = (id) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === id ? { ...assignment, status: "Ongoing" } : assignment
    );
    setAssignments(updatedAssignments);
    // Later, replace with a PUT request to backend
  };

  // ❌ Delete Assignment
  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
    // Later, replace with a DELETE request to backend
  };

  return (
    <div className="assignments-container">
      <h2>Assignment Management</h2>

      {/* Form */}
      <form className="assignment-form" onSubmit={handleAddAssignment}>
        <label>Truck ID:</label>
        <input type="text" placeholder="Enter Truck ID" required />

        <label>Driver Name:</label>
        <input type="text" placeholder="Enter Driver Name" required />

        <label>Status:</label>
        <select>
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Complete">Complete</option>
        </select>

        <button type="submit">Add Assignment</button>
      </form>

      {/* Table */}
      <table className="assignment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Truck ID</th>
            <th>Driver Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>{assignment.id}</td>
              <td>{assignment.truckId}</td>
              <td>{assignment.driverName}</td>
              <td>{assignment.status}</td>
              <td className="action-buttons">
                <button
                  className="update-btn"
                  onClick={() => handleUpdateAssignment(assignment.id)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAssignment(assignment.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assignments;

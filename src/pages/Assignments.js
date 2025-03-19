import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    driver_id: "",
    truck_id: "",
    start_date: "",
    end_date: "",
    status: "Pending",
  });

  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchAssignments();
    fetchDrivers();
    fetchTrucks();
  }, []);

  const fetchAssignments = () => {
    axios.get("http://localhost:5000/assignments")
      .then(response => {
        setAssignments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching assignments:", error);
        setError("Failed to load assignments.");
        setLoading(false);
      });
  };

  const fetchDrivers = () => {
    axios.get("http://localhost:5000/drivers")
      .then(response => setDrivers(response.data))
      .catch(error => console.error("Error fetching drivers:", error));
  };

  const fetchTrucks = () => {
    axios.get("http://localhost:5000/trucks")
      .then(response => setTrucks(response.data))
      .catch(error => console.error("Error fetching trucks:", error));
  };

  const handleInputChange = (e) => {
    setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/assignments", newAssignment)
      .then(() => {
        fetchAssignments();
        setNewAssignment({
          driver_id: "",
          truck_id: "",
          start_date: "",
          end_date: "",
          status: "Pending",
        });
      })
      .catch(error => {
        console.error("Error adding assignment:", error);
        setError("Failed to add assignment.");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/assignments/${id}`)
      .then(() => fetchAssignments())
      .catch(error => {
        console.error("Error deleting assignment:", error);
        setError("Failed to delete assignment.");
      });
  };

  return (
    <div className="assignments-list">
      <h2>Assignments</h2>

      {isAdmin && (
        <form className="assignment-form" onSubmit={handleSubmit}>
          <select name="driver_id" value={newAssignment.driver_id} onChange={handleInputChange} required>
            <option value="">Select Driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
          </select>

          <select name="truck_id" value={newAssignment.truck_id} onChange={handleInputChange} required>
            <option value="">Select Truck</option>
            {trucks.map(truck => (
              <option key={truck.id} value={truck.id}>{truck.model} ({truck.plate_number})</option>
            ))}
          </select>

          <input type="date" name="start_date" value={newAssignment.start_date} onChange={handleInputChange} required />
          <input type="date" name="end_date" value={newAssignment.end_date} onChange={handleInputChange} required />

          <select name="status" value={newAssignment.status} onChange={handleInputChange} required>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <button type="submit" className="add-assignment-btn">Assign Driver</button>
        </form>
      )}

      {loading && <p className="loading">Loading assignments...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && assignments.length === 0 && (
        <p className="no-data">No assignments available.</p>
      )}

      {!loading && !error && assignments.length > 0 && (
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Assignment ID</th>
              <th>Driver</th>
              <th>Truck</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {assignments.map(assignment => (
              <tr key={assignment.id}>
                <td>{assignment.id}</td>
                <td>{assignment.driver_name}</td>
                <td>{assignment.truck_model} ({assignment.truck_plate})</td>
                <td>{assignment.start_date}</td>
                <td>{assignment.end_date}</td>
                <td>{assignment.status}</td>
                {isAdmin && (
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(assignment.id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Assignments;

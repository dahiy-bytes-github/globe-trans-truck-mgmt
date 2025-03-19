import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Trucks.css";

function Trucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTruck, setNewTruck] = useState({ model: "", plate_number: "", status: "Available", created_at: "" });
  const [editingTruck, setEditingTruck] = useState(null);

  //const userRole = localStorage.getItem("role");
  //const isAdmin = userRole === "admin";
  const isAdmin = true;
 



  useEffect(() => {
    axios.get("http://localhost:5000/trucks")
      .then(response => {
        setTrucks(response.data);
        setLoading(false);
      })
      .catch(() => setError("Failed to load trucks."));
  }, []);

  const handleInputChange = (e) => {
    setNewTruck((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/trucks", newTruck)
      .then((response) => {
        setTrucks([...trucks, response.data]);
        setNewTruck({ model: "", plate_number: "", status: "Available", created_at: "" });
      })
      .catch(() => setError("Failed to add truck."));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/trucks/${id}`)
      .then(() => {
        setTrucks(trucks.filter(truck => truck.id !== id));
      })
      .catch(() => setError("Failed to delete truck."));
  };

  const handleEditClick = (truck) => {
    setEditingTruck(truck);
  };

  const handleEditChange = (e) => {
    setEditingTruck({
      ...editingTruck,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/trucks/${editingTruck.id}`, editingTruck)
      .then(() => {
        setTrucks(trucks.map(truck => (truck.id === editingTruck.id ? editingTruck : truck)));
        setEditingTruck(null);
      })
      .catch(() => setError("Failed to update truck."));
  };

  return (
    <div className="trucks-list">
      <h2>Trucks</h2>
      
      {isAdmin && !editingTruck && (
        <form className="truck-form" onSubmit={handleSubmit}>
          <input type="text" name="model" placeholder="Truck Model" value={newTruck.model} onChange={handleInputChange} required />
          <input type="text" name="plate_number" placeholder="Plate Number" value={newTruck.plate_number} onChange={handleInputChange} required />
          <select name="status" value={newTruck.status} onChange={handleInputChange} required>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <input type="datetime-local" name="created_at" value={newTruck.created_at} onChange={handleInputChange} required />
          <button type="submit">Add Truck</button>
        </form>
      )}

      {editingTruck && (
        <form className="truck-form" onSubmit={handleEditSubmit}>
          <input type="text" name="model" value={editingTruck.model} onChange={handleEditChange} required />
          <input type="text" name="plate_number" value={editingTruck.plate_number} onChange={handleEditChange} required />
          <select name="status" value={editingTruck.status} onChange={handleEditChange} required>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button type="submit">Update Truck</button>
          <button type="button" onClick={() => setEditingTruck(null)}>Cancel</button>
        </form>
      )}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Plate Number</th><th>Model</th><th>Status</th><th>Created At</th>{isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {trucks.map(truck => (
            <tr key={truck.id}>
              <td>{truck.id}</td>
              <td>{truck.plate_number}</td>
              <td>{truck.model}</td>
              <td>{truck.status}</td>
              <td>{truck.created_at}</td>
              {isAdmin && (
                <td>
                  <button onClick={() => handleEditClick(truck)}>Edit</button>
                  <button onClick={() => handleDelete(truck.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Trucks;

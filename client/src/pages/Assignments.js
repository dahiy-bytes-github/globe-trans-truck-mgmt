import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    status: 'Active',
    driver_id: '',
    truck_id: ''
  });
  const [error, setError] = useState('');

  const getErrorMsg = (err, fallback = 'An error occurred.') => {
    return err.response?.data?.error || err.response?.data?.message || fallback;
  };

  // ✅ Wrap fetchAssignments in useCallback to avoid re-creation
  const fetchAssignments = useCallback(() => {
    axios.get('http://localhost:5555/assignments', { withCredentials: true })
      .then(response => setAssignments(response.data))
      .catch(err => setError(getErrorMsg(err, 'Failed to fetch assignments.')));
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]); // ✅ Dependency is now correctly managed

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingAssignment
      ? axios.patch(`http://localhost:5555/assignments/${editingAssignment.id}`, formData, { withCredentials: true })
      : axios.post('http://localhost:5555/assignments', formData, { withCredentials: true });

    request
      .then(() => {
        fetchAssignments();
        resetForm();
      })
      .catch(err => setError(getErrorMsg(err, editingAssignment ? 'Failed to update assignment.' : 'Failed to create assignment.')));
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      start_date: assignment.start_date,
      end_date: assignment.end_date || '',
      status: assignment.status,
      driver_id: assignment.driver_id,
      truck_id: assignment.truck_id
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5555/assignments/${id}`, { withCredentials: true })
      .then(() => fetchAssignments())
      .catch(err => setError(getErrorMsg(err, 'Failed to delete assignment.')));
  };

  const handleGetById = (id) => {
    axios.get(`http://localhost:5555/assignments/${id}`, { withCredentials: true })
      .then(response => alert(JSON.stringify(response.data, null, 2)))
      .catch(err => setError(getErrorMsg(err, 'Failed to fetch assignment details.')));
  };

  const resetForm = () => {
    setEditingAssignment(null);
    setFormData({
      start_date: '',
      end_date: '',
      status: 'Active',
      driver_id: '',
      truck_id: ''
    });
    setError('');
  };

  return (
    <div>
      <h1>Assignments</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="driver_id"
          placeholder="Driver ID"
          value={formData.driver_id}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="truck_id"
          placeholder="Truck ID"
          value={formData.truck_id}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="start_date"
          placeholder="Start Date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="end_date"
          placeholder="End Date (optional)"
          value={formData.end_date}
          onChange={handleChange}
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">{editingAssignment ? 'Update Assignment' : 'Add Assignment'}</button>
        {editingAssignment && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>
            <p>
              <strong>ID:</strong> {assignment.id} | <strong>Start:</strong> {assignment.start_date} | <strong>End:</strong> {assignment.end_date || 'N/A'} | <strong>Status:</strong> {assignment.status} | <strong>Driver ID:</strong> {assignment.driver_id} | <strong>Truck ID:</strong> {assignment.truck_id}
            </p>
            <button onClick={() => handleGetById(assignment.id)}>View Details</button>
            <button onClick={() => handleEdit(assignment)}>Edit</button>
            <button onClick={() => handleDelete(assignment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;

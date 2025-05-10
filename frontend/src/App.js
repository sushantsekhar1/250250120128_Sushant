import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:2000/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    department_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); //  Success message state

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API}/departments`);
      setDepartments(res.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId === null) {
        await axios.post(`${API}/employees`, form);
        setSuccessMessage(" Employee added successfully!");
      } else {
        await axios.put(`${API}/employees/${editId}`, form);
        setSuccessMessage("Employee updated successfully!");
        setEditId(null);
      }
      setForm({ name: "", dob: "", phone: "", email: "", department_id: "" });
      fetchEmployees();

      //  Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error submitting employee form:", error);
    }
  };

  const handleEdit = (emp) => {
    const formattedDob = emp.dob.split("T")[0];
    setForm({
      name: emp.name,
      dob: formattedDob,
      phone: emp.phone,
      email: emp.email,
      department_id: emp.department_id,
    });
    setEditId(emp.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="container mt-5 justify-content-center align-items-center d-flex flex-column w-100 h-100 bg-light p-4 rounded shadow text-center text-dark border border-2 border-primary">
      <h2 className="mb-3">Employee Management</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="DOB"
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <select
          className="form-control mb-2"
          value={form.department_id}
          onChange={(e) =>
            setForm({ ...form, department_id: parseInt(e.target.value, 10) })
          }
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" type="submit">
          {editId === null ? "Add Employee" : "Update Employee"}
        </button>
      </form>

      {/* Success message alert */}
      {successMessage && (
        <div className="alert alert-success w-100 text-center" role="alert">
          {successMessage}
        </div>
      )}

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.dob}</td>
              <td>{emp.phone}</td>
              <td>{emp.email}</td>
              <td>
                {departments.find((d) => d.id === emp.department_id)?.name ||
                  "N/A"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(emp.id)}
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
}

export default App;

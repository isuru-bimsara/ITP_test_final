// frontend/src/pages/hrmanager/UpdateEmployee.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function EmployeeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeID: "",
    name: "",
    department: "",
    position: "",
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${API_URL}/employees/list`);
        const emp = res.data.employees.find((e) => e._id === id);
        if (emp) {
          setForm({
            employeeID: emp.employeeID || "",
            name: emp.name || "",
            department: emp.department || "",
            position: emp.position || "",
            contactNumber: emp.contactNumber || "",
            address: emp.address || "",
          });
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        alert("Employee not found");
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/employees/update/${id}`, form);
      alert("Employee updated!");
      navigate("/hrmanager/our-employees");
    } catch (err) {
      alert("Failed to update employee");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-xl font-bold mb-2">Edit Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm mb-1">Employee ID</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-50" name="employeeID" value={form.employeeID} disabled />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Full Name</label>
          <input className="w-full border rounded px-3 py-2" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Department</label>
          <input className="w-full border rounded px-3 py-2" name="department" value={form.department} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Position</label>
          <input className="w-full border rounded px-3 py-2" name="position" value={form.position} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Contact Number</label>
          <input className="w-full border rounded px-3 py-2" name="contactNumber" value={form.contactNumber} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-gray-600 text-sm mb-1">Address</label>
          <input className="w-full border rounded px-3 py-2" name="address" value={form.address} onChange={handleChange} />
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={() => navigate("/hrmanager/our-employees")}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold flex-1"
          >
            Cancel
          </button>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded font-semibold flex-1 hover:bg-purple-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
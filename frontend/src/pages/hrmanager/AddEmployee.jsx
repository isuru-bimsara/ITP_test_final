
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./HRsidebar";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "",
    contactNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/employees/add`, form);
      setMsg(res.data.message || "Employee added!");
      setForm({
        name: "",
        position: "",
        department: "",
        contactNumber: "",
        address: "",
      });
      // navigate("/hrmanager/our-employees");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Error adding employee."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-blue-700">
            Add Employee
          </h1>
          {error && (
            <div className="mb-4 p-2 rounded text-center bg-red-100 text-red-600 font-medium">
              {error}
            </div>
          )}
          {msg && (
            <div className="mb-4 p-2 rounded text-center bg-green-100 text-green-700 font-medium">
              {msg}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Position</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                required
              >
                <option value="">Select Department</option>
                <option value="HR">HR Department</option>
                <option value="Finance">Finance Department</option>
                <option value="Order & Supply">Order & Supply Department</option>
                <option value="Delivery">Delivery Department</option>
                <option value="Customer Service">Customer Service Department</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-600">Contact Number</label>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full"
                required
                minLength={10}
                type="tel"
                placeholder="e.g. 0771234567"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 text-gray-600">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="border rounded px-4 py-2 w-full"
                required
                placeholder="e.g. Colombo, Sri Lanka"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Sidebar from "./HRsidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFilePdf } from "@react-icons/all-files/fa/FaFilePdf";
import { generateAppointmentLetterPdf } from "./generateAppointmentLetterPdf";

const API_URL = "http://localhost:5000/api";

export default function EmployeeDisplay() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const departmentOptions = [
    "All",
    ...Array.from(new Set(employees.map((emp) => emp.department))).filter(Boolean),
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`${API_URL}/employees/delete/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee");
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (department && department !== "All") params.department = department;
        const res = await axios.get(`${API_URL}/employees/list`, { params });
        setEmployees(res.data.employees);
      } catch (err) {
        setEmployees([]);
      }
      setLoading(false);
    };
    fetchEmployees();
  }, [search, department]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 px-10 py-10">
        <div className="flex items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {departmentOptions.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full">
            <thead>
              <tr className="text-gray-500 text-left text-sm border-b">
                <th className="py-3 px-2">EMPLOYEE ID</th>
                <th className="py-3 px-2">NAME</th>
                <th className="py-3 px-2">POSITION</th>
                <th className="py-3 px-2">DEPARTMENT</th>
                <th className="py-3 px-2">CONTACT NUMBER</th>
                <th className="py-3 px-2">ADDRESS</th>
                <th className="py-3 px-2">DATE</th>
                <th className="py-3 px-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-blue-600 font-bold">
                    Loading...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-400">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="border-b last:border-none hover:bg-blue-50 transition">
                    <td className="py-3 px-2 font-semibold">{emp.employeeID}</td>
                    <td className="py-3 px-2 flex items-center space-x-3">
                      <span className="font-bold">{emp.name}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-xs font-semibold">
                        {emp.position}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-xs font-semibold">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3 px-2">{emp.contactNumber}</td>
                    <td className="py-3 px-2">{emp.address}</td>
                    <td className="py-3 px-2">{formatDate(emp.createdAt)}</td>
                    <td className="py-3 px-2 flex space-x-3">
                      <button
                        title="Edit"
                        className="p-2 rounded-full bg-purple-100 text-purple-600"
                        onClick={() => navigate(`/hrmanager/employee/update/${emp._id}`)}
                      >
                        <svg width={18} height={18} fill="none" stroke="currentColor">
                          <path d="M4 13v3h3l9-9-3-3-9 9z" />
                        </svg>
                      </button>
                      <button
                        title="Delete"
                        className="p-2 rounded-full bg-red-100 text-red-600"
                        onClick={() => handleDelete(emp._id)}
                      >
                        <svg width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2}>
                          <line x1="6" y1="6" x2="12" y2="12" />
                          <line x1="6" y1="12" x2="12" y2="6" />
                        </svg>
                      </button>
                      <button
                        title="Generate PDF"
                        className="p-2 rounded-full bg-pink-100 text-pink-600"
                        onClick={() => generateAppointmentLetterPdf(emp)}
                      >
                        <FaFilePdf size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
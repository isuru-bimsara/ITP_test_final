// frontend/src/pages/hrmanager/HrDashboard.js
import React, { useEffect, useState } from "react";
import Sidebar from "./HRsidebar";
import axios from "axios";
import { createBeautifulEmployeePDF } from "./allpdfGenarator";

const API_URL = "http://localhost:5000/api";

const UserIcon = () => (
  <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-2">
    <svg width={24} height={24} fill="none" stroke="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
    </svg>
  </span>
);

export default function HrDashboard() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [departmentCounts, setDepartmentCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Setup axios Authorization header if token exists
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${localUser.token}`;
    }
  }, []);

  // Fetch department counts
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/employees/department-counts`);
        setDepartmentCounts(data.counts || []);
      } catch (error) {
        console.error("Error fetching department counts:", error);
        setDepartmentCounts([]);
      }
    };
    loadCounts();
  }, []);

  // Fetch all employees (with optional search)
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        const { data } = await axios.get(`${API_URL}/employees/all`, { params });
        setAllEmployees(data.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setAllEmployees([]);
      }
      setLoading(false);
    };
    loadEmployees();
  }, [search]);

  // ---------------- PDF Generation ----------------
  const handleGeneratePDF = () => {
    try {
      if (allEmployees.length === 0) {
        alert("No employees to generate PDF!");
        return;
      }

      const currentUser = {
        name: JSON.parse(localStorage.getItem("user"))?.username || "HR Manager",
        role: JSON.parse(localStorage.getItem("user"))?.role || "hrmanager",
        login: JSON.parse(localStorage.getItem("user"))?.email || "unknown",
      };

      // Simple date formatter
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
          .getDate()
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      };

      createBeautifulEmployeePDF({
        employees: allEmployees,
        department: "All",
        currentUser,
        formatDate,
      });
    } catch (err) {
      alert("PDF generation failed: " + err.message);
      console.error(err);
    }
  };

  // ---------------- Helpers ----------------
  const getDepartmentCount = (deptName) => {
    const found = departmentCounts.find((dep) => dep._id === deptName);
    return found ? found.count : 0;
  };

  const uniqueDepartments = departmentCounts.map((dep) => dep._id || "Unknown");

  // ---------------- Render ----------------
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="p-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <div className="text-3xl font-bold text-gray-900">Overview</div>
              <div className="text-gray-500">Dashboard</div>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search by ID, name, department, etc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                style={{ width: "240px" }}
              />
              <span className="text-gray-500 font-medium ml-4">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </header>

          {/* Welcome + PDF Button */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-800 mb-2">
                  Welcome back!!
                </div>
                <div className="text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                onClick={handleGeneratePDF}
              >
                Generate Employee Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Total Employees */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-between border-4 border-blue-600">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  Total Employees
                </div>
                <div className="text-6xl font-extrabold text-blue-700 mb-2">
                  {allEmployees.length}
                </div>
              </div>
              <UserIcon />
            </div>

            {/* Department Cards */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                {uniqueDepartments.map((dept) => (
                  <div
                    key={dept}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 flex items-center border border-blue-200"
                  >
                    <div className="flex-1">
                      <div className="text-blue-600 font-medium">
                        {dept} Employees
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {getDepartmentCount(dept)}
                      </div>
                    </div>
                    <UserIcon />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">All Employees</h3>
            </div>

            {loading ? (
              <div className="py-10 text-center text-blue-600 font-bold">
                Loading...
              </div>
            ) : allEmployees.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                No employees found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-gray-500 text-left text-sm border-b bg-gray-50">
                      <th className="py-3 px-6">EMPLOYEE ID</th>
                      <th className="py-3 px-6">NAME</th>
                      <th className="py-3 px-6">POSITION</th>
                      <th className="py-3 px-6">DEPARTMENT</th>
                      <th className="py-3 px-6">CONTACT</th>
                      <th className="py-3 px-6">ADDRESS</th>
                      <th className="py-3 px-6">DATE ADDED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allEmployees.map((emp) => (
                      <tr
                        key={emp._id}
                        className="border-b last:border-none hover:bg-blue-50 transition"
                      >
                        <td className="py-4 px-6 font-semibold">{emp.employeeID}</td>
                        <td className="py-4 px-6">{emp.name}</td>
                        <td className="py-4 px-6">{emp.position}</td>
                        <td className="py-4 px-6">{emp.department}</td>
                        <td className="py-4 px-6">{emp.contactNumber}</td>
                        <td className="py-4 px-6">{emp.address}</td>
                        <td className="py-4 px-6">
                          {new Date(emp.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

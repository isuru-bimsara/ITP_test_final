// frontend/src/pages/hrmanager/GenerateReport.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./HRsidebar";
import axios from "axios";
import { createBeautifulEmployeePDF } from "./pdfGenerator";

const API_URL = "http://localhost:5000/api";

export default function GenerateReport() {
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(false);

  const departmentOptions = [
    "All",
    ...Array.from(new Set(employees.map((emp) => emp.department))).filter(Boolean),
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const params = {};
        if (department && department !== "All") params.department = department;
        const res = await axios.get(`${API_URL}/employees/list`, { params });
        setEmployees(res.data.employees);
      } catch (err) {
        setEmployees([]);
      }
      setLoading(false);
    };
    fetchEmployees();
  }, [department]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  const handleGeneratePDF = () => {
    try {
      if (employees.length === 0) {
        alert("No employees to generate PDF!");
        return;
      }

      const currentUser = {
        name: JSON.parse(localStorage.getItem("user"))?.username || "HR Manager",
        role: JSON.parse(localStorage.getItem("user"))?.role || "hrmanager",
      };

      createBeautifulEmployeePDF({
        employees,
        department,
        currentUser,
        formatDate,
      });
    } catch (err) {
      alert("PDF generation failed: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-blue-700">
            Generate Employee Report
          </h1>
          <div className="flex gap-4 mb-6">
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
            <button
              onClick={handleGeneratePDF}
              disabled={loading || employees.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              style={{ minWidth: 140 }}
            >
              {loading ? "Loading..." : "Generate PDF"}
            </button>
          </div>
          <div className="w-full">
            <div className="text-gray-500 mb-2 font-semibold">
              {employees.length} employees found
            </div>
            <div className="bg-gray-50 rounded p-3">
              <ul>
                {employees.map((emp) => (
                  <li key={emp._id} className="mb-2 border-b pb-2 last:border-none">
                    <span className="font-bold">{emp.employeeID}</span> — {emp.name} ({emp.department})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
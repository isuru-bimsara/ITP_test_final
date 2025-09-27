


// // // frontend/src/pages/financialmanager/Salaries.jsx
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import {
// //   validateNumber,
// //   validateText,
// //   validateDate,
// //   preventNonNumericInput,
// //   preventNumericInput,
// // } from "./validation";

// // const Salaries = () => {
// //   const [salaries, setSalaries] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showForm, setShowForm] = useState(false);
// //   const [formData, setFormData] = useState({
// //     employeeName: "",
// //     role: "",
// //     basicSalary: "",
// //     allowances: "0",
// //     deductions: "0",
// //     paymentDate: "",
// //     otHours: "0",
// //     otRate: "1.5",
// //     epfRate: "8",
// //     etfRate: "12",
// //   });
// //   const [calculatedSalary, setCalculatedSalary] = useState({
// //     otPay: 0,
// //     epfDeduction: 0,
// //     etfDeduction: 0,
// //     netSalary: 0,
// //   });
// //   const [errors, setErrors] = useState({});
// //   const [submitting, setSubmitting] = useState(false);
// //   const [updatingStatus, setUpdatingStatus] = useState(null); // Track which salary status is being updated

// //   // Get today's date for validation
// //   const today = new Date().toISOString().split("T")[0];

// //   useEffect(() => {
// //     fetchSalaries();
// //   }, []);

// //   useEffect(() => {
// //     calculateSalary();
// //   }, [formData]);

// //   const fetchSalaries = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get("/api/salaries");
// //       setSalaries(response.data.data);
// //     } catch (error) {
// //       toast.error("Failed to fetch salaries");
// //       console.error("Error fetching salaries:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const calculateSalary = () => {
// //     const basicSalary = parseFloat(formData.basicSalary) || 0;
// //     const allowances = parseFloat(formData.allowances) || 0;
// //     const deductions = parseFloat(formData.deductions) || 0;
// //     const otHours = parseFloat(formData.otHours) || 0;
// //     const otRate = parseFloat(formData.otRate) || 1.5;
// //     const epfRate = parseFloat(formData.epfRate) || 8;
// //     const etfRate = parseFloat(formData.etfRate) || 3;

// //     // Calculate hourly rate (assuming 160 work hours per month)
// //     const hourlyRate = basicSalary / 160;

// //     // Calculate OT Pay
// //     const otPay = otHours * hourlyRate * otRate;

// //     // Calculate EPF & ETF deductions
// //     const epfDeduction = (basicSalary + otPay) * (epfRate / 100);
// //     const etfDeduction = (basicSalary + otPay) * (etfRate / 100);

// //     // Calculate Net Salary
// //     const netSalary =
// //       basicSalary + otPay + allowances - (deductions + epfDeduction);

// //     setCalculatedSalary({
// //       otPay,
// //       epfDeduction,
// //       etfDeduction,
// //       netSalary: netSalary > 0 ? netSalary : 0,
// //     });
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};

// //     // Employee name validation
// //     if (!formData.employeeName.trim()) {
// //       newErrors.employeeName = "Employee name is required";
// //     } else if (!validateText(formData.employeeName)) {
// //       newErrors.employeeName = "Employee name cannot contain numbers";
// //     } else if (formData.employeeName.length > 20) {
// //       newErrors.employeeName = "Employee name cannot exceed 20 characters";
// //     }

// //     // Role validation
// //     if (!formData.role.trim()) {
// //       newErrors.role = "Role is required";
// //     } else if (!validateText(formData.role)) {
// //       newErrors.role = "Role cannot contain numbers";
// //     }

// //     // Basic salary validation
// //     if (!formData.basicSalary || !validateNumber(formData.basicSalary)) {
// //       newErrors.basicSalary = "Basic salary must be a positive number";
// //     } else if (parseFloat(formData.basicSalary) <= 0) {
// //       newErrors.basicSalary = "Basic salary must be greater than 0";
// //     }

// //     // Allowances validation
// //     if (formData.allowances && !validateNumber(formData.allowances)) {
// //       newErrors.allowances = "Allowances must be a non-negative number";
// //     }

// //     // Deductions validation
// //     if (formData.deductions && !validateNumber(formData.deductions)) {
// //       newErrors.deductions = "Deductions must be a non-negative number";
// //     }

// //     // Payment date validation - allow past dates (remove 7-day restriction for salaries)
// //     if (!formData.paymentDate) {
// //       newErrors.paymentDate = "Payment date is required";
// //     } else {
// //       const inputDate = new Date(formData.paymentDate);
// //       const today = new Date();
// //       if (inputDate > today) {
// //         newErrors.paymentDate = "Payment date cannot be in the future";
// //       }
// //     }

// //     // OT hours validation
// //     if (formData.otHours && !validateNumber(formData.otHours)) {
// //       newErrors.otHours = "OT hours must be a non-negative number";
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!validateForm()) {
// //       toast.error("Please fix the form errors");
// //       return;
// //     }

// //     setSubmitting(true);

// //     try {
// //       const salaryData = {
// //         employeeName: formData.employeeName.trim(),
// //         role: formData.role.trim(),
// //         basicSalary: parseFloat(formData.basicSalary),
// //         allowances: parseFloat(formData.allowances || 0),
// //         deductions: parseFloat(formData.deductions || 0),
// //         otHours: parseFloat(formData.otHours || 0),
// //         otRate: parseFloat(formData.otRate || 1.5),
// //         epfRate: parseFloat(formData.epfRate || 8),
// //         etfRate: parseFloat(formData.etfRate || 3),
// //         paymentDate: formData.paymentDate,
// //       };

// //       console.log("Sending salary data:", salaryData);

// //       const response = await axios.post("/api/salaries", salaryData);

// //       if (response.data.success) {
// //         toast.success("Salary added successfully");
// //         setShowForm(false);
// //         setFormData({
// //           employeeName: "",
// //           role: "",
// //           basicSalary: "",
// //           allowances: "0",
// //           deductions: "0",
// //           paymentDate: "",
// //           otHours: "0",
// //           otRate: "1.5",
// //           epfRate: "8",
// //           etfRate: "3",
// //         });
// //         setErrors({});
// //         fetchSalaries();
// //       } else {
// //         toast.error(response.data.message || "Failed to add salary");
// //       }
// //     } catch (error) {
// //       console.error("Full error object:", error);
// //       console.error("Error response data:", error.response?.data);

// //       if (error.response?.data?.message) {
// //         toast.error(`Server Error: ${error.response.data.message}`);
// //       } else if (error.response?.data?.error) {
// //         toast.error(`Server Error: ${error.response.data.error}`);
// //       } else {
// //         toast.error(
// //           "Failed to add salary. Please check your connection and try again."
// //         );
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value,
// //     });

// //     // Clear error when user starts typing
// //     if (errors[name]) {
// //       setErrors({
// //         ...errors,
// //         [name]: "",
// //       });
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this salary record?"))
// //       return;

// //     try {
// //       await axios.delete(`/api/salaries/${id}`);
// //       toast.success("Salary record deleted successfully");
// //       fetchSalaries();
// //     } catch (error) {
// //       toast.error("Failed to delete salary record");
// //       console.error("Error deleting salary record:", error);
// //     }
// //   };

// //   const updateSalaryStatus = async (id, status) => {
// //     try {
// //       setUpdatingStatus(id); // Set the ID of the salary being updated
// //       await axios.put(`/api/salaries/${id}/status`, { status });
// //       toast.success("Salary status updated successfully");
// //       fetchSalaries();
// //     } catch (error) {
// //       toast.error("Failed to update salary status");
// //       console.error("Error updating salary status:", error);
// //     } finally {
// //       setUpdatingStatus(null); // Reset updating status
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-bold text-blue-800">Salaries</h1>
// //         <button
// //           onClick={() => setShowForm(true)}
// //           className="btn-primary"
// //           disabled={submitting}
// //         >
// //           {submitting ? "Processing..." : "Add Salary"}
// //         </button>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //         <div className="card">
// //           <h3 className="text-lg font-semibold text-gray-700 mb-2">
// //             Total Salaries
// //           </h3>
// //           <p className="text-2xl font-bold text-purple-600">
// //             Rs{" "}
// //             {salaries
// //               .reduce((sum, salary) => sum + (salary.netSalary || 0), 0)
// //               .toLocaleString()}
// //           </p>
// //         </div>
// //       </div>

// //       <div className="card">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Employee
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Role
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Basic Salary
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Net Salary
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Payment Date
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Status
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {salaries.length === 0 ? (
// //                 <tr>
// //                   <td
// //                     colSpan="7"
// //                     className="px-6 py-4 text-center text-gray-500"
// //                   >
// //                     No salary records found. Add your first salary record to get
// //                     started.
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 salaries.map((salary) => (
// //                   <tr key={salary._id}>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       {salary.employeeName}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       {salary.role}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       Rs {salary.basicSalary?.toLocaleString() || "0"}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       Rs {salary.netSalary?.toLocaleString() || "0"}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       {salary.paymentDate
// //                         ? new Date(salary.paymentDate).toLocaleDateString()
// //                         : "N/A"}
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap">
// //                       <span
// //                         className={`px-2 py-1 text-xs font-medium rounded-full ${
// //                           salary.status === "Paid"
// //                             ? "bg-green-100 text-green-800"
// //                             : "bg-yellow-100 text-yellow-800"
// //                         }`}
// //                       >
// //                         {salary.status || "Pending"}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
// //                       <button
// //                         onClick={() =>
// //                           updateSalaryStatus(
// //                             salary._id,
// //                             salary.status === "Paid" ? "Pending" : "Paid"
// //                           )
// //                         }
// //                         className={`mr-3 ${
// //                           salary.status === "Paid"
// //                             ? "text-gray-400 cursor-not-allowed"
// //                             : "text-blue-600 hover:text-blue-900"
// //                         }`}
// //                         disabled={
// //                           salary.status === "Paid" ||
// //                           updatingStatus === salary._id
// //                         }
// //                       >
// //                         {updatingStatus === salary._id
// //                           ? "Updating..."
// //                           : "Mark as Paid"}
// //                       </button>
// //                       <button
// //                         onClick={() => handleDelete(salary._id)}
// //                         className="text-red-600 hover:text-red-900"
// //                         disabled={updatingStatus === salary._id}
// //                       >
// //                         Delete
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {showForm && (
// //         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
// //           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-2/3 shadow-lg rounded-md bg-white">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-bold">Add Salary</h3>
// //               <button
// //                 onClick={() => {
// //                   setShowForm(false);
// //                   setErrors({});
// //                 }}
// //                 className="text-gray-500 hover:text-gray-700"
// //                 disabled={submitting}
// //               >
// //                 <svg
// //                   className="w-6 h-6"
// //                   fill="none"
// //                   stroke="currentColor"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth="2"
// //                     d="M6 18L18 6M6 6l12 12"
// //                   />
// //                 </svg>
// //               </button>
// //             </div>

// //             <form onSubmit={handleSubmit}>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Employee Name *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="employeeName"
// //                     value={formData.employeeName}
// //                     onChange={handleChange}
// //                     onKeyDown={preventNumericInput}
// //                     className={`input-field ${
// //                       errors.employeeName ? "border-red-500" : ""
// //                     }`}
// //                     placeholder="Enter employee name"
// //                     required
// //                     disabled={submitting}
// //                   />
// //                   {errors.employeeName && (
// //                     <p className="text-red-500 text-xs mt-1">
// //                       {errors.employeeName}
// //                     </p>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Role *
// //                   </label>
// //                   <input
// //                     type="text"
// //                     name="role"
// //                     value={formData.role}
// //                     onChange={handleChange}
// //                     className={`input-field ${
// //                       errors.role ? "border-red-500" : ""
// //                     }`}
// //                     placeholder="Enter employee role"
// //                     required
// //                     disabled={submitting}
// //                   />
// //                   {errors.role && (
// //                     <p className="text-red-500 text-xs mt-1">{errors.role}</p>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Basic Salary (Rs) *
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="basicSalary"
// //                     value={formData.basicSalary}
// //                     onChange={handleChange}
// //                     onKeyDown={preventNonNumericInput}
// //                     min="0"
// //                     step="0.01"
// //                     className={`input-field ${
// //                       errors.basicSalary ? "border-red-500" : ""
// //                     }`}
// //                     placeholder="0.00"
// //                     required
// //                     disabled={submitting}
// //                   />
// //                   {errors.basicSalary && (
// //                     <p className="text-red-500 text-xs mt-1">
// //                       {errors.basicSalary}
// //                     </p>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Allowances (Rs)
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="allowances"
// //                     value={formData.allowances}
// //                     onChange={handleChange}
// //                     onKeyDown={preventNonNumericInput}
// //                     min="0"
// //                     step="0.01"
// //                     className={`input-field ${
// //                       errors.allowances ? "border-red-500" : ""
// //                     }`}
// //                     placeholder="0.00"
// //                     disabled={submitting}
// //                   />
// //                   {errors.allowances && (
// //                     <p className="text-red-500 text-xs mt-1">
// //                       {errors.allowances}
// //                     </p>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Deductions (Rs)
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="deductions"
// //                     value={formData.deductions}
// //                     onChange={handleChange}
// //                     onKeyDown={preventNonNumericInput}
// //                     min="0"
// //                     step="0.01"
// //                     className={`input-field ${
// //                       errors.deductions ? "border-red-500" : ""
// //                     }`}
// //                     placeholder="0.00"
// //                     disabled={submitting}
// //                   />
// //                   {errors.deductions && (
// //                     <p className="text-red-500 text-xs mt-1">
// //                       {errors.deductions}
// //                     </p>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     OT Hours
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="otHours"
// //                     value={formData.otHours}
// //                     onChange={handleChange}
// //                     onKeyDown={preventNonNumericInput}
// //                     min="0"
// //                     step="0.5"
// //                     className={`input-field ${
// //                       errors.otHours ? "border-red-500" : ""
// //                     }`}
// //                     placeholder="0"
// //                     disabled={submitting}
// //                   />
// //                   {errors.otHours && (
// //                     <p className="text-red-500 text-xs mt-1">
// //                       {errors.otHours}
// //                     </p>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Payment Date *
// //                   </label>
// //                   <input
// //                     type="date"
// //                     name="paymentDate"
// //                     value={formData.paymentDate}
// //                     onChange={handleChange}
// //                     max={today}
// //                     className={`input-field ${
// //                       errors.paymentDate ? "border-red-500" : ""
// //                     }`}
// //                     required
// //                     disabled={submitting}
// //                   />
// //                   {errors.paymentDate && (
// //                     <p className="text-red-500 text-xs mt-1">
// //                       {errors.paymentDate}
// //                     </p>
// //                   )}
// //                   <p className="text-xs text-gray-500 mt-1">
// //                     Select a past date
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Salary Calculation Preview */}
// //               <div className="bg-gray-50 p-4 rounded-lg mb-4">
// //                 <h4 className="font-semibold mb-2">
// //                   Salary Calculation Preview
// //                 </h4>
// //                 <div className="grid grid-cols-2 gap-2 text-sm">
// //                   <div>Basic Salary:</div>
// //                   <div className="text-right">
// //                     Rs {parseFloat(formData.basicSalary || 0).toLocaleString()}
// //                   </div>

// //                   <div>OT Pay:</div>
// //                   <div className="text-right">
// //                     Rs {calculatedSalary.otPay.toLocaleString()}
// //                   </div>

// //                   <div>Allowances:</div>
// //                   <div className="text-right">
// //                     Rs {parseFloat(formData.allowances || 0).toLocaleString()}
// //                   </div>

// //                   <div>Deductions:</div>
// //                   <div className="text-right">
// //                     Rs {parseFloat(formData.deductions || 0).toLocaleString()}
// //                   </div>

// //                   <div>EPF Deduction:</div>
// //                   <div className="text-right">
// //                     Rs {calculatedSalary.epfDeduction.toLocaleString()}
// //                   </div>

// //                   <div>ETF Deduction:</div>
// //                   <div className="text-right">
// //                     Rs {calculatedSalary.etfDeduction.toLocaleString()}
// //                   </div>

// //                   <div className="font-semibold">Net Salary:</div>
// //                   <div className="text-right font-semibold">
// //                     Rs {calculatedSalary.netSalary.toLocaleString()}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="flex justify-end space-x-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setShowForm(false);
// //                     setErrors({});
// //                   }}
// //                   className="btn-secondary"
// //                   disabled={submitting}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="btn-primary"
// //                   disabled={submitting}
// //                 >
// //                   {submitting ? "Adding..." : "Add Salary"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Salaries;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   validateNumber,
//   validateText,
//   validateDate,
//   preventNonNumericInput,
//   preventNumericInput,
// } from "./validation";

// const Salaries = () => {
//   const [salaries, setSalaries] = useState([]);
//   const [employees, setEmployees] = useState([]); // NEW: employees list
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);

//   const [formData, setFormData] = useState({
//     employeeId: "",       // NEW: selected employee id
//     employeeName: "",
//     role: "",
//     department: "",       // NEW: snapshot
//     basicSalary: "",
//     allowances: "0",
//     deductions: "0",
//     paymentDate: "",
//     otHours: "0",
//     otRate: "1.5",
//     epfRate: "8",
//     etfRate: "12",
//   });

//   const [calculatedSalary, setCalculatedSalary] = useState({
//     otPay: 0,
//     epfDeduction: 0,
//     etfDeduction: 0,
//     netSalary: 0,
//   });

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(null);

//   const today = new Date().toISOString().split("T")[0];

//   // Ensure Authorization header is set
//   useEffect(() => {
//     const saved = localStorage.getItem("user");
//     if (saved) {
//       try {
//         const user = JSON.parse(saved);
//         if (user?.token) {
//           axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
//         }
//       } catch {}
//     }
//   }, []);

//   useEffect(() => {
//     fetchSalaries();
//   }, []);

//   useEffect(() => {
//     calculateSalary();
//   }, [formData]);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("/api/employees/all");
//       setEmployees(res.data.employees || []);
//     } catch (err) {
//       console.error("Failed to load employees", err);
//       toast.error("Failed to load employees");
//     }
//   };

//   const fetchSalaries = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("/api/salaries");
//       setSalaries(response.data.data);
//     } catch (error) {
//       toast.error("Failed to fetch salaries");
//       console.error("Error fetching salaries:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateSalary = () => {
//     const basicSalary = parseFloat(formData.basicSalary) || 0;
//     const allowances = parseFloat(formData.allowances) || 0;
//     const deductions = parseFloat(formData.deductions) || 0;
//     const otHours = parseFloat(formData.otHours) || 0;
//     const otRate = parseFloat(formData.otRate) || 1.5;
//     const epfRate = parseFloat(formData.epfRate) || 8;
//     const etfRate = parseFloat(formData.etfRate) || 3;

//     const hourlyRate = basicSalary / 160;
//     const otPay = otHours * hourlyRate * otRate;

//     const epfDeduction = (basicSalary + otPay) * (epfRate / 100);
//     const etfDeduction = (basicSalary + otPay) * (etfRate / 100);

//     const netSalary =
//       basicSalary + otPay + allowances - (deductions + epfDeduction + etfDeduction);

//     setCalculatedSalary({
//       otPay,
//       epfDeduction,
//       etfDeduction,
//       netSalary: netSalary > 0 ? netSalary : 0,
//     });
//   };

//   // Open form and load employees list (once)
//   const handleOpenForm = async () => {
//     setShowForm(true);
//     if (employees.length === 0) {
//       await fetchEmployees();
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // If no employee selected, require manual name/role
//     if (!formData.employeeId) {
//       if (!formData.employeeName.trim()) {
//         newErrors.employeeName = "Employee name is required";
//       } else if (!validateText(formData.employeeName)) {
//         newErrors.employeeName = "Employee name cannot contain numbers";
//       } else if (formData.employeeName.length > 50) {
//         newErrors.employeeName = "Employee name cannot exceed 50 characters";
//       }

//       if (!formData.role.trim()) {
//         newErrors.role = "Role is required";
//       } else if (!validateText(formData.role)) {
//         newErrors.role = "Role cannot contain numbers";
//       }
//     }

//     if (!formData.basicSalary || !validateNumber(formData.basicSalary)) {
//       newErrors.basicSalary = "Basic salary must be a positive number";
//     } else if (parseFloat(formData.basicSalary) <= 0) {
//       newErrors.basicSalary = "Basic salary must be greater than 0";
//     }

//     if (!formData.paymentDate) {
//       newErrors.paymentDate = "Payment date is required";
//     } else {
//       const inputDate = new Date(formData.paymentDate);
//       const dtToday = new Date();
//       if (inputDate > dtToday) {
//         newErrors.paymentDate = "Payment date cannot be in the future";
//       }
//     }

//     if (formData.allowances && !validateNumber(formData.allowances)) {
//       newErrors.allowances = "Allowances must be a non-negative number";
//     }

//     if (formData.deductions && !validateNumber(formData.deductions)) {
//       newErrors.deductions = "Deductions must be a non-negative number";
//     }

//     if (formData.otHours && !validateNumber(formData.otHours)) {
//       newErrors.otHours = "OT hours must be a non-negative number";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleEmployeeChange = (e) => {
//     const selectedId = e.target.value;
//     const emp = employees.find((x) => x._id === selectedId);
//     if (emp) {
//       setFormData((prev) => ({
//         ...prev,
//         employeeId: selectedId,
//         employeeName: emp.name,          // snapshot
//         role: emp.position,              // snapshot
//         department: emp.department || "",// snapshot
//       }));
//       setErrors((prev) => ({ ...prev, employeeName: "", role: "" }));
//     } else {
//       // cleared selection
//       setFormData((prev) => ({
//         ...prev,
//         employeeId: "",
//         employeeName: "",
//         role: "",
//         department: "",
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error("Please fix the form errors");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const payload = {
//         employeeId: formData.employeeId || undefined,
//         employeeName: formData.employeeId ? formData.employeeName : formData.employeeName.trim(),
//         role: formData.role.trim(),
//         department: formData.department || "",
//         basicSalary: parseFloat(formData.basicSalary),
//         allowances: parseFloat(formData.allowances || 0),
//         deductions: parseFloat(formData.deductions || 0),
//         otHours: parseFloat(formData.otHours || 0),
//         otRate: parseFloat(formData.otRate || 1.5),
//         epfRate: parseFloat(formData.epfRate || 8),
//         etfRate: parseFloat(formData.etfRate || 3),
//         paymentDate: formData.paymentDate,
//       };

//       const response = await axios.post("/api/salaries", payload);

//       if (response.data.success) {
//         toast.success("Salary added successfully");
//         setShowForm(false);
//         setFormData({
//           employeeId: "",
//           employeeName: "",
//           role: "",
//           department: "",
//           basicSalary: "",
//           allowances: "0",
//           deductions: "0",
//           paymentDate: "",
//           otHours: "0",
//           otRate: "1.5",
//           epfRate: "8",
//           etfRate: "3",
//         });
//         setErrors({});
//         fetchSalaries();
//       } else {
//         toast.error(response.data.message || "Failed to add salary");
//       }
//     } catch (error) {
//       console.error("Full error object:", error);
//       console.error("Error response data:", error.response?.data);

//       if (error.response?.data?.message) {
//         toast.error(`Server Error: ${error.response.data.message}`);
//       } else if (error.response?.data?.error) {
//         toast.error(`Server Error: ${error.response.data.error}`);
//       } else {
//         toast.error("Failed to add salary. Please check your connection and try again.");
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this salary record?")) return;

//     try {
//       await axios.delete(`/api/salaries/${id}`);
//       toast.success("Salary record deleted successfully");
//       fetchSalaries();
//     } catch (error) {
//       toast.error("Failed to delete salary record");
//       console.error("Error deleting salary record:", error);
//     }
//   };

//   const updateSalaryStatus = async (id, status) => {
//     try {
//       setUpdatingStatus(id);
//       await axios.put(`/api/salaries/${id}/status`, { status });
//       toast.success("Salary status updated successfully");
//       fetchSalaries();
//     } catch (error) {
//       toast.error("Failed to update salary status");
//       console.error("Error updating salary status:", error);
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-blue-800">Salaries</h1>
//         <button onClick={handleOpenForm} className="btn-primary" disabled={submitting}>
//           {submitting ? "Processing..." : "Add Salary"}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="card">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Salaries</h3>
//           <p className="text-2xl font-bold text-purple-600">
//             Rs{" "}
//             {salaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0).toLocaleString()}
//           </p>
//         </div>
//       </div>

//       <div className="card">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Basic Salary
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Net Salary
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {salaries.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
//                     No salary records found. Add your first salary record to get started.
//                   </td>
//                 </tr>
//               ) : (
//                 salaries.map((salary) => (
//                   <tr key={salary._id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {salary.employeeName || salary.employeeId?.name || "-"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">{salary.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       Rs {salary.basicSalary?.toLocaleString() || "0"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       Rs {salary.netSalary?.toLocaleString() || "0"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {salary.paymentDate
//                         ? new Date(salary.paymentDate).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 py-1 text-xs font-medium rounded-full ${
//                           salary.status === "Paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {salary.status || "Pending"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() =>
//                           updateSalaryStatus(
//                             salary._id,
//                             salary.status === "Paid" ? "Pending" : "Paid"
//                           )
//                         }
//                         className={`mr-3 ${
//                           salary.status === "Paid"
//                             ? "text-gray-400 cursor-not-allowed"
//                             : "text-blue-600 hover:text-blue-900"
//                         }`}
//                         disabled={
//                           salary.status === "Paid" || updatingStatus === salary._id
//                         }
//                       >
//                         {updatingStatus === salary._id ? "Updating..." : "Mark as Paid"}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(salary._id)}
//                         className="text-red-600 hover:text-red-900"
//                         disabled={updatingStatus === salary._id}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-2/3 shadow-lg rounded-md bg-white">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold">Add Salary</h3>
//               <button
//                 onClick={() => {
//                   setShowForm(false);
//                   setErrors({});
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//                 disabled={submitting}
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 {/* Employee selector (recommended) */}
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Employee (recommended)
//                   </label>
//                   <select
//                     name="employeeId"
//                     value={formData.employeeId}
//                     onChange={handleEmployeeChange}
//                     className="input-field"
//                   >
//                     <option value="">-- Select employee --</option>
//                     {employees.map((emp) => (
//                       <option key={emp._id} value={emp._id}>
//                         {emp.employeeID} — {emp.name} ({emp.department})
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Selecting an employee auto-fills Role/Department and stores a snapshot.
//                   </p>
//                 </div>

//                 {/* Manual name/role when no employee is selected */}
//                 {!formData.employeeId && (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Employee Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="employeeName"
//                         value={formData.employeeName}
//                         onChange={handleChange}
//                         onKeyDown={preventNumericInput}
//                         className={`input-field ${errors.employeeName ? "border-red-500" : ""}`}
//                         placeholder="Enter employee name"
//                         required
//                         disabled={submitting}
//                       />
//                       {errors.employeeName && (
//                         <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Role *
//                       </label>
//                       <input
//                         type="text"
//                         name="role"
//                         value={formData.role}
//                         onChange={handleChange}
//                         className={`input-field ${errors.role ? "border-red-500" : ""}`}
//                         placeholder="Enter employee role"
//                         required
//                         disabled={submitting}
//                       />
//                       {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
//                     </div>
//                   </>
//                 )}

//                 {/* Read-only snapshots when employee selected */}
//                 {formData.employeeId && (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Role (snapshot)
//                       </label>
//                       <input
//                         type="text"
//                         name="role"
//                         value={formData.role}
//                         readOnly
//                         className="input-field bg-gray-100"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Department (snapshot)
//                       </label>
//                       <input
//                         type="text"
//                         name="department"
//                         value={formData.department}
//                         readOnly
//                         className="input-field bg-gray-100"
//                       />
//                     </div>
//                   </>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Basic Salary (Rs) *
//                   </label>
//                   <input
//                     type="number"
//                     name="basicSalary"
//                     value={formData.basicSalary}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.01"
//                     className={`input-field ${errors.basicSalary ? "border-red-500" : ""}`}
//                     placeholder="0.00"
//                     required
//                     disabled={submitting}
//                   />
//                   {errors.basicSalary && (
//                     <p className="text-red-500 text-xs mt-1">{errors.basicSalary}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Allowances (Rs)
//                   </label>
//                   <input
//                     type="number"
//                     name="allowances"
//                     value={formData.allowances}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.01"
//                     className="input-field"
//                     placeholder="0.00"
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Deductions (Rs)
//                   </label>
//                   <input
//                     type="number"
//                     name="deductions"
//                     value={formData.deductions}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.01"
//                     className="input-field"
//                     placeholder="0.00"
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     OT Hours
//                   </label>
//                   <input
//                     type="number"
//                     name="otHours"
//                     value={formData.otHours}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.5"
//                     className="input-field"
//                     placeholder="0"
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Payment Date *
//                   </label>
//                   <input
//                     type="date"
//                     name="paymentDate"
//                     value={formData.paymentDate}
//                     onChange={handleChange}
//                     max={today}
//                     className={`input-field ${errors.paymentDate ? "border-red-500" : ""}`}
//                     required
//                     disabled={submitting}
//                   />
//                   {errors.paymentDate && (
//                     <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>
//                   )}
//                   <p className="text-xs text-gray-500 mt-1">Select a past date</p>
//                 </div>
//               </div>

//               {/* Salary Calculation Preview */}
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <h4 className="font-semibold mb-2">Salary Calculation Preview</h4>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div>Basic Salary:</div>
//                   <div className="text-right">
//                     Rs {parseFloat(formData.basicSalary || 0).toLocaleString()}
//                   </div>

//                   <div>OT Pay:</div>
//                   <div className="text-right">
//                     Rs {calculatedSalary.otPay.toLocaleString()}
//                   </div>

//                   <div>Allowances:</div>
//                   <div className="text-right">
//                     Rs {parseFloat(formData.allowances || 0).toLocaleString()}
//                   </div>

//                   <div>Deductions:</div>
//                   <div className="text-right">
//                     Rs {parseFloat(formData.deductions || 0).toLocaleString()}
//                   </div>

//                   <div>EPF Deduction:</div>
//                   <div className="text-right">
//                     Rs {calculatedSalary.epfDeduction.toLocaleString()}
//                   </div>

//                   <div>ETF Deduction:</div>
//                   <div className="text-right">
//                     Rs {calculatedSalary.etfDeduction.toLocaleString()}
//                   </div>

//                   <div className="font-semibold">Net Salary:</div>
//                   <div className="text-right font-semibold">
//                     Rs {calculatedSalary.netSalary.toLocaleString()}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     setErrors({});
//                   }}
//                   className="btn-secondary"
//                   disabled={submitting}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn-primary" disabled={submitting}>
//                   {submitting ? "Adding..." : "Add Salary"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Salaries;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  validateNumber,
  validateText,
  validateDate,
  preventNonNumericInput,
  preventNumericInput,
} from "./validation";
import { FaPlus, FaMoneyBillWave, FaTrash, FaEdit } from "react-icons/fa";

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    role: "",
    department: "",
    basicSalary: "",
    allowances: "0",
    deductions: "0",
    paymentDate: "",
    otHours: "0",
    otRate: "1.5",
    epfRate: "8",
    etfRate: "12",
  });

  const [calculatedSalary, setCalculatedSalary] = useState({
    otPay: 0,
    epfDeduction: 0,
    etfDeduction: 0,
    netSalary: 0,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        if (user?.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    fetchSalaries();
  }, []);

  useEffect(() => {
    calculateSalary();
  }, [formData]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/api/employees/all");
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error("Failed to load employees", err);
      toast.error("Failed to load employees");
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/salaries");
      setSalaries(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch salaries");
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalary = () => {
    const basicSalary = parseFloat(formData.basicSalary) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const otHours = parseFloat(formData.otHours) || 0;
    const otRate = parseFloat(formData.otRate) || 1.5;
    const epfRate = parseFloat(formData.epfRate) || 8;
    const etfRate = parseFloat(formData.etfRate) || 3;

    const hourlyRate = basicSalary / 160;
    const otPay = otHours * hourlyRate * otRate;

    const epfDeduction = (basicSalary + otPay) * (epfRate / 100);
    const etfDeduction = (basicSalary + otPay) * (etfRate / 100);

    const netSalary =
      basicSalary + otPay + allowances - (deductions + epfDeduction + etfDeduction);

    setCalculatedSalary({
      otPay,
      epfDeduction,
      etfDeduction,
      netSalary: netSalary > 0 ? netSalary : 0,
    });
  };

  const handleOpenForm = async () => {
    setShowForm(true);
    if (employees.length === 0) {
      await fetchEmployees();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId) {
      if (!formData.employeeName.trim()) {
        newErrors.employeeName = "Employee name is required";
      } else if (!validateText(formData.employeeName)) {
        newErrors.employeeName = "Employee name cannot contain numbers";
      } else if (formData.employeeName.length > 50) {
        newErrors.employeeName = "Employee name cannot exceed 50 characters";
      }

      if (!formData.role.trim()) {
        newErrors.role = "Role is required";
      } else if (!validateText(formData.role)) {
        newErrors.role = "Role cannot contain numbers";
      }
    }

    if (!formData.basicSalary || !validateNumber(formData.basicSalary)) {
      newErrors.basicSalary = "Basic salary must be a positive number";
    } else if (parseFloat(formData.basicSalary) <= 0) {
      newErrors.basicSalary = "Basic salary must be greater than 0";
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    } else {
      const inputDate = new Date(formData.paymentDate);
      const dtToday = new Date();
      if (inputDate > dtToday) {
        newErrors.paymentDate = "Payment date cannot be in the future";
      }
    }

    if (formData.allowances && !validateNumber(formData.allowances)) {
      newErrors.allowances = "Allowances must be a non-negative number";
    }

    if (formData.deductions && !validateNumber(formData.deductions)) {
      newErrors.deductions = "Deductions must be a non-negative number";
    }

    if (formData.otHours && !validateNumber(formData.otHours)) {
      newErrors.otHours = "OT hours must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmployeeChange = (e) => {
    const selectedId = e.target.value;
    const emp = employees.find((x) => x._id === selectedId);
    if (emp) {
      setFormData((prev) => ({
        ...prev,
        employeeId: selectedId,
        employeeName: emp.name,
        role: emp.position,
        department: emp.department || "",
      }));
      setErrors((prev) => ({ ...prev, employeeName: "", role: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        employeeId: "",
        employeeName: "",
        role: "",
        department: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        employeeId: formData.employeeId || undefined,
        employeeName: formData.employeeId ? formData.employeeName : formData.employeeName.trim(),
        role: formData.role.trim(),
        department: formData.department || "",
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances || 0),
        deductions: parseFloat(formData.deductions || 0),
        otHours: parseFloat(formData.otHours || 0),
        otRate: parseFloat(formData.otRate || 1.5),
        epfRate: parseFloat(formData.epfRate || 8),
        etfRate: parseFloat(formData.etfRate || 3),
        paymentDate: formData.paymentDate,
      };

      const response = await axios.post("/api/salaries", payload);

      if (response.data.success) {
        toast.success("Salary added successfully");
        setShowForm(false);
        setFormData({
          employeeId: "",
          employeeName: "",
          role: "",
          department: "",
          basicSalary: "",
          allowances: "0",
          deductions: "0",
          paymentDate: "",
          otHours: "0",
          otRate: "1.5",
          epfRate: "8",
          etfRate: "3",
        });
        setErrors({});
        fetchSalaries();
      } else {
        toast.error(response.data.message || "Failed to add salary");
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);

      if (error.response?.data?.message) {
        toast.error(`Server Error: ${error.response.data.message}`);
      } else if (error.response?.data?.error) {
        toast.error(`Server Error: ${error.response.data.error}`);
      } else {
        toast.error("Failed to add salary. Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    try {
      await axios.delete(`/api/salaries/${id}`);
      toast.success("Salary record deleted successfully");
      fetchSalaries();
    } catch (error) {
      toast.error("Failed to delete salary record");
      console.error("Error deleting salary record:", error);
    }
  };

  const updateSalaryStatus = async (id, status) => {
    try {
      setUpdatingStatus(id);
      await axios.put(`/api/salaries/${id}/status`, { status });
      toast.success("Salary status updated successfully");
      fetchSalaries();
    } catch (error) {
      toast.error("Failed to update salary status");
      console.error("Error updating salary status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Salaries</h1>
          <p className="text-gray-600">Manage employee salaries and payments</p>
        </div>

        {/* Total Salaries Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Salaries</h3>
              <p className="text-3xl font-bold text-purple-600 mt-1">
                Rs {salaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0).toLocaleString()}
              </p>
            </div>
            <button 
              onClick={handleOpenForm} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              disabled={submitting}
            >
              <FaPlus className="mr-2" />
              {submitting ? "Processing..." : "Add Salary"}
            </button>
          </div>
        </div>

        {/* Salaries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    EMPLOYEE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    ROLE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    BASIC SALARY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    NET SALARY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    PAYMENT DATE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="text-gray-400 text-4xl mb-2">💰</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No salary records found</h3>
                      <p className="text-gray-500">Get started by adding your first salary record.</p>
                    </td>
                  </tr>
                ) : (
                  salaries.map((salary, index) => (
                    <tr key={salary._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        {salary.employeeName || salary.employeeId?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {salary.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 border-r border-gray-200">
                        Rs {salary.basicSalary?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 border-r border-gray-200">
                        Rs {salary.netSalary?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {salary.paymentDate
                          ? new Date(salary.paymentDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            salary.status === "Paid"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {salary.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              updateSalaryStatus(
                                salary._id,
                                salary.status === "Paid" ? "Pending" : "Paid"
                              )
                            }
                            className={`flex items-center px-3 py-1 rounded text-xs ${
                              salary.status === "Paid"
                                ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                : "text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            }`}
                            disabled={
                              salary.status === "Paid" || updatingStatus === salary._id
                            }
                          >
                            <FaMoneyBillWave className="mr-1" />
                            {updatingStatus === salary._id ? "Updating..." : "Mark as Paid"}
                          </button>
                          <button
                            onClick={() => handleDelete(salary._id)}
                            className="flex items-center px-3 py-1 rounded text-xs text-red-600 hover:text-red-900 hover:bg-red-50"
                            disabled={updatingStatus === salary._id}
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Salary Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add Salary</h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={submitting}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Employee Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Employee
                    </label>
                    <select
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleEmployeeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select employee --</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.employeeID} — {emp.name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manual Input Fields */}
                  {!formData.employeeId && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee Name *
                        </label>
                        <input
                          type="text"
                          name="employeeName"
                          value={formData.employeeName}
                          onChange={handleChange}
                          onKeyDown={preventNumericInput}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.employeeName ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter employee name"
                          required
                          disabled={submitting}
                        />
                        {errors.employeeName && (
                          <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role *
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.role ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter employee role"
                          required
                          disabled={submitting}
                        />
                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                      </div>
                    </>
                  )}

                  {/* Read-only when employee selected */}
                  {formData.employeeId && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={formData.role}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                    </>
                  )}

                  {/* Salary Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Basic Salary (Rs) *
                    </label>
                    <input
                      type="number"
                      name="basicSalary"
                      value={formData.basicSalary}
                      onChange={handleChange}
                      onKeyDown={preventNonNumericInput}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.basicSalary ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="0.00"
                      required
                      disabled={submitting}
                    />
                    {errors.basicSalary && (
                      <p className="text-red-500 text-xs mt-1">{errors.basicSalary}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowances (Rs)
                    </label>
                    <input
                      type="number"
                      name="allowances"
                      value={formData.allowances}
                      onChange={handleChange}
                      onKeyDown={preventNonNumericInput}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deductions (Rs)
                    </label>
                    <input
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleChange}
                      onKeyDown={preventNonNumericInput}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OT Hours
                    </label>
                    <input
                      type="number"
                      name="otHours"
                      value={formData.otHours}
                      onChange={handleChange}
                      onKeyDown={preventNonNumericInput}
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Date *
                    </label>
                    <input
                      type="date"
                      name="paymentDate"
                      value={formData.paymentDate}
                      onChange={handleChange}
                      max={today}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.paymentDate ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                      disabled={submitting}
                    />
                    {errors.paymentDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Select a past date</p>
                  </div>
                </div>

                {/* Salary Calculation Preview */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Salary Calculation Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-600">Basic Salary:</div>
                    <div className="text-right font-medium">
                      Rs {parseFloat(formData.basicSalary || 0).toLocaleString()}
                    </div>

                    <div className="text-gray-600">OT Pay:</div>
                    <div className="text-right font-medium">
                      Rs {calculatedSalary.otPay.toLocaleString()}
                    </div>

                    <div className="text-gray-600">Allowances:</div>
                    <div className="text-right font-medium">
                      Rs {parseFloat(formData.allowances || 0).toLocaleString()}
                    </div>

                    <div className="text-gray-600">Deductions:</div>
                    <div className="text-right font-medium">
                      Rs {parseFloat(formData.deductions || 0).toLocaleString()}
                    </div>

                    <div className="text-gray-600">EPF Deduction:</div>
                    <div className="text-right font-medium">
                      Rs {calculatedSalary.epfDeduction.toLocaleString()}
                    </div>

                    <div className="text-gray-600">ETF Deduction:</div>
                    <div className="text-right font-medium">
                      Rs {calculatedSalary.etfDeduction.toLocaleString()}
                    </div>

                    <div className="font-semibold text-gray-900">Net Salary:</div>
                    <div className="text-right font-bold text-green-600">
                      Rs {calculatedSalary.netSalary.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setErrors({});
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add Salary"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Salaries;
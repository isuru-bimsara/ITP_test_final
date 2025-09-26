// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { validateNumber, validateText, validateDate, preventNonNumericInput, preventNumericInput } from '../utils/validation';

// const Salaries = () => {
//   const [salaries, setSalaries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     employeeName: '',
//     role: '',
//     basicSalary: '',
//     allowances: '0',
//     deductions: '0',
//     paymentDate: '',
//     otHours: '0',
//     otRate: '1.5',
//     epfRate: '8',
//     etfRate: '12'
//   });
//   const [calculatedSalary, setCalculatedSalary] = useState({
//     otPay: 0,
//     epfDeduction: 0,
//     etfDeduction: 0,
//     netSalary: 0
//   });
//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   // Get today's date for validation
//   const today = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     fetchSalaries();
//   }, []);

//   useEffect(() => {
//     calculateSalary();
//   }, [formData]);

//   const fetchSalaries = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/salaries');
//       setSalaries(response.data.data);
//     } catch (error) {
//       toast.error('Failed to fetch salaries');
//       console.error('Error fetching salaries:', error);
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

//     // Calculate hourly rate (assuming 160 work hours per month)
//     const hourlyRate = basicSalary / 160;

//     // Calculate OT Pay
//     const otPay = otHours * hourlyRate * otRate;

//     // Calculate EPF & ETF deductions
//     const epfDeduction = (basicSalary + otPay) * (epfRate / 100);
//     const etfDeduction = (basicSalary + otPay) * (etfRate / 100);

//     // Calculate Net Salary
//     const netSalary = basicSalary + otPay + allowances - (deductions + epfDeduction );

//     setCalculatedSalary({
//       otPay,
//       epfDeduction,
//       etfDeduction,
//       netSalary: netSalary > 0 ? netSalary : 0
//     });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Employee name validation
//     if (!formData.employeeName.trim()) {
//       newErrors.employeeName = 'Employee name is required';
//     } else if (!validateText(formData.employeeName)) {
//       newErrors.employeeName = 'Employee name cannot contain numbers';
//     }

//     // Role validation
//     if (!formData.role.trim()) {
//     newErrors.role = 'Role is required';
//   } else if (!validateText(formData.role)) {
//     newErrors.role = 'Role cannot contain numbers';
//   }

//     // Basic salary validation
//     if (!formData.basicSalary || !validateNumber(formData.basicSalary)) {
//       newErrors.basicSalary = 'Basic salary must be a positive number';
//     } else if (parseFloat(formData.basicSalary) <= 0) {
//       newErrors.basicSalary = 'Basic salary must be greater than 0';
//     }

//     // Allowances validation
//     if (formData.allowances && !validateNumber(formData.allowances)) {
//       newErrors.allowances = 'Allowances must be a non-negative number';
//     }

//     // Deductions validation
//     if (formData.deductions && !validateNumber(formData.deductions)) {
//       newErrors.deductions = 'Deductions must be a non-negative number';
//     }

//     // Payment date validation - allow past dates (remove 7-day restriction for salaries)
//     if (!formData.paymentDate) {
//       newErrors.paymentDate = 'Payment date is required';
//     } else {
//       const inputDate = new Date(formData.paymentDate);
//       const today = new Date();
//       if (inputDate > today) {
//         newErrors.paymentDate = 'Payment date cannot be in the future';
//       }
//     }

//     // OT hours validation
//     if (formData.otHours && !validateNumber(formData.otHours)) {
//       newErrors.otHours = 'OT hours must be a non-negative number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast.error('Please fix the form errors');
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const salaryData = {
//         employeeName: formData.employeeName.trim(),
//         role: formData.role.trim(),
//         basicSalary: parseFloat(formData.basicSalary),
//         allowances: parseFloat(formData.allowances || 0),
//         deductions: parseFloat(formData.deductions || 0),
//         otHours: parseFloat(formData.otHours || 0),
//         otRate: parseFloat(formData.otRate || 1.5),
//         epfRate: parseFloat(formData.epfRate || 8),
//         etfRate: parseFloat(formData.etfRate || 3),
//         paymentDate: formData.paymentDate
//       };

//       console.log('Sending salary data:', salaryData);

//       const response = await axios.post('/api/salaries', salaryData);

//       if (response.data.success) {
//         toast.success('Salary added successfully');
//         setShowForm(false);
//         setFormData({
//           employeeName: '',
//           role: '',
//           basicSalary: '',
//           allowances: '0',
//           deductions: '0',
//           paymentDate: '',
//           otHours: '0',
//           otRate: '1.5',
//           epfRate: '8',
//           etfRate: '3'
//         });
//         setErrors({});
//         fetchSalaries();
//       } else {
//         toast.error(response.data.message || 'Failed to add salary');
//       }
//     } catch (error) {
//       console.error('Full error object:', error);
//       console.error('Error response data:', error.response?.data);

//       if (error.response?.data?.message) {
//         toast.error(`Server Error: ${error.response.data.message}`);
//       } else if (error.response?.data?.error) {
//         toast.error(`Server Error: ${error.response.data.error}`);
//       } else {
//         toast.error('Failed to add salary. Please check your connection and try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });

//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this salary record?')) return;

//     try {
//       await axios.delete(`/api/salaries/${id}`);
//       toast.success('Salary record deleted successfully');
//       fetchSalaries();
//     } catch (error) {
//       toast.error('Failed to delete salary record');
//       console.error('Error deleting salary record:', error);
//     }
//   };

//   const updateSalaryStatus = async (id, status) => {
//     try {
//       await axios.put(`/api/salaries/${id}/status`, { status });
//       toast.success('Salary status updated successfully');
//       fetchSalaries();
//     } catch (error) {
//       toast.error('Failed to update salary status');
//       console.error('Error updating salary status:', error);
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
//         <button
//           onClick={() => setShowForm(true)}
//           className="btn-primary"
//           disabled={submitting}
//         >
//           {submitting ? 'Processing...' : 'Add Salary'}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         <div className="card">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Salaries</h3>
//           <p className="text-2xl font-bold text-purple-600">
//             Rs {salaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0).toLocaleString()}
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
//                       {salary.employeeName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {salary.role}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       Rs {salary.basicSalary?.toLocaleString() || '0'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       Rs {salary.netSalary?.toLocaleString() || '0'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         salary.status === 'Paid'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {salary.status || 'Pending'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => updateSalaryStatus(salary._id, salary.status === 'Paid' ? 'Pending' : 'Paid')}
//                         className="text-blue-600 hover:text-blue-900 mr-3"
//                       >
//                         {salary.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
//                       </button>
//                       <button
//                         onClick={() => handleDelete(salary._id)}
//                         className="text-red-600 hover:text-red-900"
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
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
//                   <input
//                     type="text"
//                     name="employeeName"
//                     value={formData.employeeName}
//                     onChange={handleChange}
//                     onKeyDown={preventNumericInput}
//                     className={`input-field ${errors.employeeName ? 'border-red-500' : ''}`}
//                     placeholder="Enter employee name"
//                     required
//                     disabled={submitting}
//                   />
//                   {errors.employeeName && <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
//                   <input
//                     type="text"
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     className={`input-field ${errors.role ? 'border-red-500' : ''}`}
//                     placeholder="Enter employee role"
//                     required
//                     disabled={submitting}
//                   />
//                   {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (Rs) *</label>
//                   <input
//                     type="number"
//                     name="basicSalary"
//                     value={formData.basicSalary}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.01"
//                     className={`input-field ${errors.basicSalary ? 'border-red-500' : ''}`}
//                     placeholder="0.00"
//                     required
//                     disabled={submitting}
//                   />
//                   {errors.basicSalary && <p className="text-red-500 text-xs mt-1">{errors.basicSalary}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Allowances (Rs)</label>
//                   <input
//                     type="number"
//                     name="allowances"
//                     value={formData.allowances}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.01"
//                     className={`input-field ${errors.allowances ? 'border-red-500' : ''}`}
//                     placeholder="0.00"
//                     disabled={submitting}
//                   />
//                   {errors.allowances && <p className="text-red-500 text-xs mt-1">{errors.allowances}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Deductions (Rs)</label>
//                   <input
//                     type="number"
//                     name="deductions"
//                     value={formData.deductions}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.01"
//                     className={`input-field ${errors.deductions ? 'border-red-500' : ''}`}
//                     placeholder="0.00"
//                     disabled={submitting}
//                   />
//                   {errors.deductions && <p className="text-red-500 text-xs mt-1">{errors.deductions}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">OT Hours</label>
//                   <input
//                     type="number"
//                     name="otHours"
//                     value={formData.otHours}
//                     onChange={handleChange}
//                     onKeyDown={preventNonNumericInput}
//                     min="0"
//                     step="0.5"
//                     className={`input-field ${errors.otHours ? 'border-red-500' : ''}`}
//                     placeholder="0"
//                     disabled={submitting}
//                   />
//                   {errors.otHours && <p className="text-red-500 text-xs mt-1">{errors.otHours}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
//                   <input
//                     type="date"
//                     name="paymentDate"
//                     value={formData.paymentDate}
//                     onChange={handleChange}
//                     max={today}
//                     className={`input-field ${errors.paymentDate ? 'border-red-500' : ''}`}
//                     required
//                     disabled={submitting}
//                   />
//                   {errors.paymentDate && <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>}
//                   <p className="text-xs text-gray-500 mt-1">Select a past date</p>
//                 </div>
//               </div>

//               {/* Salary Calculation Preview */}
//               <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                 <h4 className="font-semibold mb-2">Salary Calculation Preview</h4>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div>Basic Salary:</div>
//                   <div className="text-right">Rs {parseFloat(formData.basicSalary || 0).toLocaleString()}</div>

//                   <div>OT Pay:</div>
//                   <div className="text-right">Rs {calculatedSalary.otPay.toLocaleString()}</div>

//                   <div>Allowances:</div>
//                   <div className="text-right">Rs {parseFloat(formData.allowances || 0).toLocaleString()}</div>

//                   <div>Deductions:</div>
//                   <div className="text-right">Rs {parseFloat(formData.deductions || 0).toLocaleString()}</div>

//                   <div>EPF Deduction:</div>
//                   <div className="text-right">Rs {calculatedSalary.epfDeduction.toLocaleString()}</div>

//                   <div>ETF Deduction:</div>
//                   <div className="text-right">Rs {calculatedSalary.etfDeduction.toLocaleString()}</div>

//                   <div className="font-semibold">Net Salary:</div>
//                   <div className="text-right font-semibold">Rs {calculatedSalary.netSalary.toLocaleString()}</div>
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
//                 <button
//                   type="submit"
//                   className="btn-primary"
//                   disabled={submitting}
//                 >
//                   {submitting ? 'Adding...' : 'Add Salary'}
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


// frontend/src/pages/financialmanager/Incomes.jsx
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

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    role: "",
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
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which salary status is being updated

  // Get today's date for validation
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchSalaries();
  }, []);

  useEffect(() => {
    calculateSalary();
  }, [formData]);

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

    // Calculate hourly rate (assuming 160 work hours per month)
    const hourlyRate = basicSalary / 160;

    // Calculate OT Pay
    const otPay = otHours * hourlyRate * otRate;

    // Calculate EPF & ETF deductions
    const epfDeduction = (basicSalary + otPay) * (epfRate / 100);
    const etfDeduction = (basicSalary + otPay) * (etfRate / 100);

    // Calculate Net Salary
    const netSalary =
      basicSalary + otPay + allowances - (deductions + epfDeduction);

    setCalculatedSalary({
      otPay,
      epfDeduction,
      etfDeduction,
      netSalary: netSalary > 0 ? netSalary : 0,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Employee name validation
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = "Employee name is required";
    } else if (!validateText(formData.employeeName)) {
      newErrors.employeeName = "Employee name cannot contain numbers";
    } else if (formData.employeeName.length > 20) {
      newErrors.employeeName = "Employee name cannot exceed 20 characters";
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    } else if (!validateText(formData.role)) {
      newErrors.role = "Role cannot contain numbers";
    }

    // Basic salary validation
    if (!formData.basicSalary || !validateNumber(formData.basicSalary)) {
      newErrors.basicSalary = "Basic salary must be a positive number";
    } else if (parseFloat(formData.basicSalary) <= 0) {
      newErrors.basicSalary = "Basic salary must be greater than 0";
    }

    // Allowances validation
    if (formData.allowances && !validateNumber(formData.allowances)) {
      newErrors.allowances = "Allowances must be a non-negative number";
    }

    // Deductions validation
    if (formData.deductions && !validateNumber(formData.deductions)) {
      newErrors.deductions = "Deductions must be a non-negative number";
    }

    // Payment date validation - allow past dates (remove 7-day restriction for salaries)
    if (!formData.paymentDate) {
      newErrors.paymentDate = "Payment date is required";
    } else {
      const inputDate = new Date(formData.paymentDate);
      const today = new Date();
      if (inputDate > today) {
        newErrors.paymentDate = "Payment date cannot be in the future";
      }
    }

    // OT hours validation
    if (formData.otHours && !validateNumber(formData.otHours)) {
      newErrors.otHours = "OT hours must be a non-negative number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);

    try {
      const salaryData = {
        employeeName: formData.employeeName.trim(),
        role: formData.role.trim(),
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances || 0),
        deductions: parseFloat(formData.deductions || 0),
        otHours: parseFloat(formData.otHours || 0),
        otRate: parseFloat(formData.otRate || 1.5),
        epfRate: parseFloat(formData.epfRate || 8),
        etfRate: parseFloat(formData.etfRate || 3),
        paymentDate: formData.paymentDate,
      };

      console.log("Sending salary data:", salaryData);

      const response = await axios.post("/api/salaries", salaryData);

      if (response.data.success) {
        toast.success("Salary added successfully");
        setShowForm(false);
        setFormData({
          employeeName: "",
          role: "",
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
        toast.error(
          "Failed to add salary. Please check your connection and try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?"))
      return;

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
      setUpdatingStatus(id); // Set the ID of the salary being updated
      await axios.put(`/api/salaries/${id}/status`, { status });
      toast.success("Salary status updated successfully");
      fetchSalaries();
    } catch (error) {
      toast.error("Failed to update salary status");
      console.error("Error updating salary status:", error);
    } finally {
      setUpdatingStatus(null); // Reset updating status
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Salaries</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Add Salary"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Salaries
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            Rs{" "}
            {salaries
              .reduce((sum, salary) => sum + (salary.netSalary || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salaries.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No salary records found. Add your first salary record to get
                    started.
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rs {salary.basicSalary?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Rs {salary.netSalary?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.paymentDate
                        ? new Date(salary.paymentDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          salary.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {salary.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          updateSalaryStatus(
                            salary._id,
                            salary.status === "Paid" ? "Pending" : "Paid"
                          )
                        }
                        className={`mr-3 ${
                          salary.status === "Paid"
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-900"
                        }`}
                        disabled={
                          salary.status === "Paid" ||
                          updatingStatus === salary._id
                        }
                      >
                        {updatingStatus === salary._id
                          ? "Updating..."
                          : "Mark as Paid"}
                      </button>
                      <button
                        onClick={() => handleDelete(salary._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={updatingStatus === salary._id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Salary</h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={submitting}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    onKeyDown={preventNumericInput}
                    className={`input-field ${
                      errors.employeeName ? "border-red-500" : ""
                    }`}
                    placeholder="Enter employee name"
                    required
                    disabled={submitting}
                  />
                  {errors.employeeName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.employeeName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`input-field ${
                      errors.role ? "border-red-500" : ""
                    }`}
                    placeholder="Enter employee role"
                    required
                    disabled={submitting}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className={`input-field ${
                      errors.basicSalary ? "border-red-500" : ""
                    }`}
                    placeholder="0.00"
                    required
                    disabled={submitting}
                  />
                  {errors.basicSalary && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.basicSalary}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className={`input-field ${
                      errors.allowances ? "border-red-500" : ""
                    }`}
                    placeholder="0.00"
                    disabled={submitting}
                  />
                  {errors.allowances && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.allowances}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className={`input-field ${
                      errors.deductions ? "border-red-500" : ""
                    }`}
                    placeholder="0.00"
                    disabled={submitting}
                  />
                  {errors.deductions && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.deductions}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className={`input-field ${
                      errors.otHours ? "border-red-500" : ""
                    }`}
                    placeholder="0"
                    disabled={submitting}
                  />
                  {errors.otHours && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.otHours}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    max={today}
                    className={`input-field ${
                      errors.paymentDate ? "border-red-500" : ""
                    }`}
                    required
                    disabled={submitting}
                  />
                  {errors.paymentDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.paymentDate}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Select a past date
                  </p>
                </div>
              </div>

              {/* Salary Calculation Preview */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">
                  Salary Calculation Preview
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Basic Salary:</div>
                  <div className="text-right">
                    Rs {parseFloat(formData.basicSalary || 0).toLocaleString()}
                  </div>

                  <div>OT Pay:</div>
                  <div className="text-right">
                    Rs {calculatedSalary.otPay.toLocaleString()}
                  </div>

                  <div>Allowances:</div>
                  <div className="text-right">
                    Rs {parseFloat(formData.allowances || 0).toLocaleString()}
                  </div>

                  <div>Deductions:</div>
                  <div className="text-right">
                    Rs {parseFloat(formData.deductions || 0).toLocaleString()}
                  </div>

                  <div>EPF Deduction:</div>
                  <div className="text-right">
                    Rs {calculatedSalary.epfDeduction.toLocaleString()}
                  </div>

                  <div>ETF Deduction:</div>
                  <div className="text-right">
                    Rs {calculatedSalary.etfDeduction.toLocaleString()}
                  </div>

                  <div className="font-semibold">Net Salary:</div>
                  <div className="text-right font-semibold">
                    Rs {calculatedSalary.netSalary.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setErrors({});
                  }}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
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
  );
};

export default Salaries;

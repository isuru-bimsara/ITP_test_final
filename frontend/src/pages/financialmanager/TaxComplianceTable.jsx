// frontend/src/pages/financialmanager/TaxComplianceTable.jsx
import React, { useState } from 'react';

const TaxComplianceTable = ({ records, onEdit, onDelete, onPayment }) => {
  const [paymentData, setPaymentData] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handlePaymentClick = (record) => {
    setSelectedRecord(record);
    setPaymentData({
      paymentAmount: record.amount - record.paidAmount,
      paymentDate: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    onPayment(selectedRecord._id, paymentData);
    setShowPaymentModal(false);
    setSelectedRecord(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partially Paid': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid
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
              {records.map((record) => (
                <tr key={record._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.taxType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(record.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs {record.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs {record.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEdit(record)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePaymentClick(record)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Payment
                    </button>
                    <button
                      onClick={() => onDelete(record._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Record Payment</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Tax: {selectedRecord.taxType}</p>
              <p className="text-sm text-gray-600">Period: {selectedRecord.period}</p>
              <p className="text-sm text-gray-600">Total Amount: Rs {selectedRecord.amount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Already Paid: Rs {selectedRecord.paidAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Remaining: Rs {(selectedRecord.amount - selectedRecord.paidAmount).toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
              <input
                type="number"
                value={paymentData.paymentAmount}
                onChange={(e) => setPaymentData({...paymentData, paymentAmount: e.target.value})}
                className="input-field"
                max={selectedRecord.amount - selectedRecord.paidAmount}
                min="0"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentData.paymentDate}
                onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="btn-primary"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaxComplianceTable;

// import React, { useState, useEffect } from 'react';

// const TaxComplianceForm = ({ record, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     taxType: '',
//     period: '',
//     dueDate: '',
//     amount: '',
//     description: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [wordCount, setWordCount] = useState(0);

//   useEffect(() => {
//     if (record) {
//       setFormData({
//         taxType: record.taxType || '',
//         period: record.period || '',
//         dueDate: record.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : '',
//         amount: record.amount || '',
//         description: record.description || ''
//       });
//       // Set initial word count when editing
//       setWordCount(record.description ? record.description.split(/\s+/).filter(word => word.length > 0).length : 0);
//     }
//   }, [record]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'description') {
//       const words = value.split(/\s+/).filter(word => word.length > 0);
//       setWordCount(words.length);
//     }
    
//     setFormData({ ...formData, [name]: value });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: '' });
//     }
//   };

//   const validatePeriod = (period) => {
//     const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/; // YYYY-MM format
//     if (!periodRegex.test(period)) {
//       return 'Period must be in YYYY-MM format (e.g., 2023-10)';
//     }
    
//     const [year, month] = period.split('-');
//     const inputDate = new Date(parseInt(year), parseInt(month) - 1);
//     const currentDate = new Date();
    
//     // Optional: Add future date restriction if needed
//     if (inputDate > currentDate) {
//       return 'Period cannot be in the future';
//     }
    
//     return '';
//   };

//   const validateDueDate = (dueDate) => {
//     if (!dueDate) return 'Due date is required';
    
//     const due = new Date(dueDate);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    
//     // Check if due date is in the past
//     if (due < today) {
//       return 'Due date cannot be in the past';
//     }
    
//     // Optional: Add reasonable future limit (e.g., 5 years)
//     const maxFutureDate = new Date();
//     maxFutureDate.setFullYear(today.getFullYear() + 5);
//     if (due > maxFutureDate) {
//       return 'Due date cannot be more than 5 years in the future';
//     }
    
//     return '';
//   };

//   const validateDescription = (description) => {
//     const words = description.split(/\s+/).filter(word => word.length > 0);
//     if (words.length > 50) {
//       return `Description cannot exceed 50 words (current: ${words.length})`;
//     }
//     return '';
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Required field validation
//     if (!formData.taxType.trim()) newErrors.taxType = 'Tax type is required';
//     if (!formData.period.trim()) newErrors.period = 'Period is required';
//     if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
//     if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    
//     // Custom validations
//     const periodError = validatePeriod(formData.period);
//     if (periodError) newErrors.period = periodError;
    
//     const dueDateError = validateDueDate(formData.dueDate);
//     if (dueDateError) newErrors.dueDate = dueDateError;
    
//     const descriptionError = validateDescription(formData.description);
//     if (descriptionError) newErrors.description = descriptionError;
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       onSubmit(formData);
//     }
//   };

//   const handlePeriodChange = (e) => {
//     let value = e.target.value;
    
//     // Auto-format as YYYY-MM
//     if (value.length === 4 && !value.includes('-')) {
//       value += '-';
//     }
    
//     // Only allow numbers and hyphen, max 7 characters
//     value = value.replace(/[^\d-]/g, '').slice(0, 7);
    
//     setFormData({ ...formData, period: value });
    
//     if (errors.period) {
//       setErrors({ ...errors, period: '' });
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//       <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
//         <h3 className="text-lg font-bold mb-4">
//           {record ? 'Edit Tax Record' : 'Add Tax Record'}
//         </h3>
//         <form onSubmit={handleSubmit}>
//           {/* Tax Type Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type</label>
//             <select
//               name="taxType"
//               value={formData.taxType}
//               onChange={handleChange}
//               className={`input-field ${errors.taxType ? 'border-red-500' : ''}`}
//             >
//               <option value="">Select Tax Type</option>
//               <option value="Income Tax">Income Tax</option>
//               <option value="VAT">VAT</option>
//               <option value="NBT">NBT</option>
//               <option value="ESC">ESC</option>
//               <option value="Stamp Duty">Stamp Duty</option>
//               <option value="Other">Other</option>
//             </select>
//             {errors.taxType && <p className="text-red-500 text-xs mt-1">{errors.taxType}</p>}
//           </div>

//           {/* Period Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM)</label>
//             <input
//               type="text"
//               name="period"
//               value={formData.period}
//               onChange={handlePeriodChange}
//               placeholder="2023-10"
//               className={`input-field ${errors.period ? 'border-red-500' : ''}`}
//             />
//             {errors.period && <p className="text-red-500 text-xs mt-1">{errors.period}</p>}
//           </div>

//           {/* Due Date Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
//             <input
//               type="date"
//               name="dueDate"
//               value={formData.dueDate}
//               onChange={handleChange}
//               min={new Date().toISOString().split('T')[0]} // Set min to today
//               className={`input-field ${errors.dueDate ? 'border-red-500' : ''}`}
//             />
//             {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
//           </div>

//           {/* Amount Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
//             <input
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               min="0.01"
//               step="0.01"
//               className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
//             />
//             {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
//           </div>

//           {/* Description Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Description <span className="text-gray-500 text-xs">({wordCount}/50 words)</span>
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               className={`input-field ${errors.description ? 'border-red-500' : ''} ${wordCount > 50 ? 'border-yellow-500' : ''}`}
//               rows="3"
//               placeholder="Enter description (max 50 words)"
//             />
//             <div className="flex justify-between text-xs mt-1">
//               {errors.description ? (
//                 <p className="text-red-500">{errors.description}</p>
//               ) : (
//                 <p className={`${wordCount > 45 ? 'text-yellow-600' : 'text-gray-500'}`}>
//                   {wordCount > 50 ? 'Word limit exceeded!' : `${50 - wordCount} words remaining`}
//                 </p>
//               )}
//               <span className="text-gray-500">{wordCount}/50 words</span>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="btn-secondary"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btn-primary"
//             >
//               {record ? 'Update' : 'Create'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TaxComplianceForm;
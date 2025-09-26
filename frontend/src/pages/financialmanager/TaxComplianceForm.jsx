// frontend/src/pages/financialmanager/TaxComplianceForm.jsx
import React, { useState, useEffect } from 'react';

const TaxComplianceForm = ({ record, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    taxType: '',
    period: '',
    dueDate: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (record) {
      setFormData({
        taxType: record.taxType || '',
        period: record.period || '',
        dueDate: record.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : '',
        amount: record.amount || '',
        description: record.description || ''
      });
    }
  }, [record]);

  // Calculate min and max dates for due date validation
  const getDateConstraints = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1); // Tomorrow
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7); // 7 days from today
    
    return {
      minDate: minDate.toISOString().split('T')[0],
      maxDate: maxDate.toISOString().split('T')[0],
      today: today.toISOString().split('T')[0]
    };
  };

  const { minDate, maxDate, today } = getDateConstraints();

  const validateForm = () => {
    const newErrors = {};

    // Tax Type validation
    if (!formData.taxType.trim()) {
      newErrors.taxType = 'Tax type is required';
    }

    // Period validation (YYYY-MM format)
    if (!formData.period.trim()) {
      newErrors.period = 'Period is required';
    } else if (!/^\d{4}-\d{2}$/.test(formData.period)) {
      newErrors.period = 'Period must be in YYYY-MM format';
    }

    // Due Date validation (must be within next 7 days)
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);
      
      if (selectedDate <= today) {
        newErrors.dueDate = 'Due date must be a future date';
      } else if (selectedDate > sevenDaysLater) {
        newErrors.dueDate = 'Due date cannot be more than 7 days in the future';
      }
    }

    // Amount validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    // Description validation (max 50 characters)
    if (formData.description.length > 50) {
      newErrors.description = 'Description cannot exceed 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Apply character limit for description
    if (name === 'description' && value.length > 50) {
      processedValue = value.slice(0, 50);
    }
    
    setFormData({ 
      ...formData, 
      [name]: processedValue 
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">
          {record ? 'Edit Tax Record' : 'Add Tax Record'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Type *</label>
            <select
              name="taxType"
              value={formData.taxType}
              onChange={handleChange}
              className={`input-field ${errors.taxType ? 'border-red-500' : ''}`}
              required
            >
              <option value="">Select Tax Type</option>
              <option value="Income Tax">Income Tax</option>
              <option value="VAT">VAT</option>
              <option value="NBT">NBT</option>
              <option value="ESC">ESC</option>
              <option value="Stamp Duty">Stamp Duty</option>
              <option value="Other">Other</option>
            </select>
            {errors.taxType && <p className="text-red-500 text-xs mt-1">{errors.taxType}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM) *</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              placeholder="2025-10"
              className={`input-field ${errors.period ? 'border-red-500' : ''}`}
              required
            />
            {errors.period && <p className="text-red-500 text-xs mt-1">{errors.period}</p>}
            <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM (e.g., 2025-10)</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={minDate}
              max={maxDate}
              className={`input-field ${errors.dueDate ? 'border-red-500' : ''}`}
              required
            />
            {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Select a date between {minDate} and {maxDate}
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
              required
            />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-xs text-gray-500 ml-1">
                ({formData.description.length}/50 characters)
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              rows="3"
              maxLength={50}
              placeholder="Enter description (max 50 characters)"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {record ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxComplianceForm;
// frontend/src/pages/financialmanager/FinancialFilter.jsx
import React from 'react';

const FinancialFilter = ({ dateRange, onFilterChange }) => {
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...dateRange, [name]: value });
  };

  return (
    <div className="flex space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          className="input-field"
        />
      </div>
    </div>
  );
};

export default FinancialFilter;
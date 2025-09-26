// frontend/src/pages/financialmanager/FinancialKPI.jsx
import React from 'react';

const FinancialKPI = ({ title, value, growth, icon, subValue }) => {
  const growthColor = growth >= 0 ? 'text-green-500' : 'text-red-500';
  const growthIcon = growth >= 0 ? '↑' : '↓';

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-sm text-gray-500">{subValue}</p>}
          {growth !== undefined && (
            <p className={`text-sm ${growthColor}`}>
              {growthIcon} {Math.abs(growth)}% from last period
            </p>
          )}
        </div>
        <div className="text-blue-500 text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default FinancialKPI;
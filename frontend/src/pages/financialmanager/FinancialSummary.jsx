// frontend/src/pages/financialmanager/FinancialSummary.jsx
import React from 'react';

const FinancialSummary = ({ summary }) => {
  if (!summary) {
    // Skeleton Loader
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Handle both field names for backward compatibility
  const totalRevenue = summary.totalRevenue || summary.totalIncomes || 0;
  const totalExpenses = summary.totalExpenses || 0;
  const netProfit = summary.netProfit || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Revenue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Total Revenue
          </h3>
        </div>
        <p className="text-2xl font-bold text-green-600">
          Rs {totalRevenue.toLocaleString()}
        </p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">All income sources</span>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Total Expenses
          </h3>
        </div>
        <p className="text-2xl font-bold text-red-600">
          Rs {totalExpenses.toLocaleString()}
        </p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">All expense categories</span>
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            Net Profit
          </h3>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          Rs {netProfit.toLocaleString()}
        </p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Revenue - Expenses</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;


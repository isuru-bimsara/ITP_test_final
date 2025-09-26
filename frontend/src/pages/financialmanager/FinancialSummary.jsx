// import React from 'react';

// const FinancialSummary = ({ summary }) => {
//   if (!summary) return null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//       <div className="card">
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
//         <p className="text-2xl font-bold text-green-600">Rs {summary.totalRevenue?.toLocaleString()}</p>
//       </div>
//       <div className="card">
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
//         <p className="text-2xl font-bold text-red-600">Rs {summary.totalExpenses?.toLocaleString()}</p>
//       </div>
//       <div className="card">
//         <h3 className="text-lg font-semibold text-gray-700 mb-2">Net Profit</h3>
//         <p className="text-2xl font-bold text-blue-600">Rs {summary.netProfit?.toLocaleString()}</p>
//       </div>
//     </div>
//   );
// };

// export default FinancialSummary;


// frontend/src/pages/financialmanager/FinancialSummary.jsx
import React from 'react';

const FinancialSummary = ({ summary }) => {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        </div>
        <div className="card animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Handle both field names for backward compatibility
  const totalRevenue = summary.totalRevenue || summary.totalIncomes || 0;
  const totalExpenses = summary.totalExpenses || 0;
  const netProfit = summary.netProfit || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
        <p className="text-2xl font-bold text-green-600">Rs {totalRevenue.toLocaleString()}</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600">Rs {totalExpenses.toLocaleString()}</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Net Profit</h3>
        <p className="text-2xl font-bold text-blue-600">Rs {netProfit.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default FinancialSummary;
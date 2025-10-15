// frontend/src/pages/financialmanager/TaxSummary.jsx
import React from 'react';

const TaxSummary = ({ records }) => {
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0);
  const totalPaid = records.reduce((sum, record) => sum + record.paidAmount, 0);
  const totalRemaining = totalAmount - totalPaid;

  const statusCounts = records.reduce((counts, record) => {
    counts[record.status] = (counts[record.status] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Tax Liability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Tax Liability</h3>
        </div>
        <p className="text-3xl font-bold text-gray-900">Rs {totalAmount.toLocaleString()}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Total outstanding amount</span>
        </div>
      </div>

      {/* Total Paid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Paid</h3>
        </div>
        <p className="text-3xl font-bold text-green-600">Rs {totalPaid.toLocaleString()}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Amount cleared</span>
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Remaining</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">Rs {totalRemaining.toLocaleString()}</p>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Balance to be paid</span>
        </div>
      </div>

      {/* Records */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Records</h3>
          <span className="text-2xl font-bold text-gray-900">{records.length}</span>
        </div>
        <div className="space-y-2 mt-3">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{status}:</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;
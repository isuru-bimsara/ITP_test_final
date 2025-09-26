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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tax Liability</h3>
        <p className="text-2xl font-bold text-red-600">Rs {totalAmount.toLocaleString()}</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Paid</h3>
        <p className="text-2xl font-bold text-green-600">Rs {totalPaid.toLocaleString()}</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Remaining</h3>
        <p className="text-2xl font-bold text-blue-600">Rs {totalRemaining.toLocaleString()}</p>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Records</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex justify-between">
              <span className="text-sm">{status}:</span>
              <span className="text-sm font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;
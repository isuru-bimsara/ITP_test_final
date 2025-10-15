// export default TaxCompliance;
// frontend/src/pages/financialmanager/TaxCompliance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaFilePdf, FaDownload, FaFilter, FaPlus } from "react-icons/fa";
import TaxComplianceForm from "./TaxComplianceForm";
import TaxComplianceTable from "./TaxComplianceTable";
import TaxSummary from "./TaxSummary";
import { generateTaxSummaryPDF } from "./pdfGenerator";

const TaxCompliance = () => {
  const [taxRecords, setTaxRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [filters, setFilters] = useState({
    period: "",
    status: "",
    taxType: "",
  });
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchTaxRecords();
  }, [filters]);

  const fetchTaxRecords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.period) params.append("period", filters.period);
      if (filters.status) params.append("status", filters.status);
      if (filters.taxType) params.append("taxType", filters.taxType);

      const response = await axios.get(`/api/taxes?${params}`);
      setTaxRecords(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch tax records");
      console.error("Error fetching tax records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (taxRecords.length === 0) {
      toast.warning("No tax records available to generate report");
      return;
    }

    setGeneratingPDF(true);
    try {
      await generateTaxSummaryPDF(taxRecords, filters);
      toast.success("PDF report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF report");
      console.error("Error generating PDF:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const response = await axios.post("/api/taxes", formData);
      setTaxRecords([...taxRecords, response.data.data]);
      setShowForm(false);
      toast.success("Tax record created successfully");
    } catch (error) {
      toast.error("Failed to create tax record");
      console.error("Error creating tax record:", error);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const response = await axios.put(`/api/taxes/${id}`, formData);
      setTaxRecords(
        taxRecords.map((record) =>
          record._id === id ? response.data.data : record
        )
      );
      setEditingRecord(null);
      toast.success("Tax record updated successfully");
    } catch (error) {
      toast.error("Failed to update tax record");
      console.error("Error updating tax record:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tax record?"))
      return;

    try {
      await axios.delete(`/api/taxes/${id}`);
      setTaxRecords(taxRecords.filter((record) => record._id !== id));
      toast.success("Tax record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete tax record");
      console.error("Error deleting tax record:", error);
    }
  };

  const handlePayment = async (id, paymentData) => {
    try {
      const response = await axios.post(
        `/api/taxes/${id}/payment`,
        paymentData
      );
      setTaxRecords(
        taxRecords.map((record) =>
          record._id === id ? response.data.data : record
        )
      );
      toast.success("Payment recorded successfully");
    } catch (error) {
      toast.error("Failed to record payment");
      console.error("Error recording payment:", error);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Compliance</h1>
          <p className="text-gray-600">Manage and track your tax obligations</p>
        </div>

        {/* Summary Cards */}
        <TaxSummary records={taxRecords} />

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FaFilter className="mr-2 text-gray-500" />
              Filters
            </h2>
            <button
              onClick={() => setFilters({ period: "", status: "", taxType: "" })}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <input
                type="text"
                placeholder="YYYY-MM"
                value={filters.period}
                onChange={(e) =>
                  setFilters({ ...filters, period: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Type
              </label>
              <select
                value={filters.taxType}
                onChange={(e) =>
                  setFilters({ ...filters, taxType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Income Tax">Income Tax</option>
                <option value="VAT">VAT</option>
                <option value="NBT">NBT</option>
                <option value="ESC">ESC</option>
                <option value="Stamp Duty">Stamp Duty</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Tax Records ({taxRecords.length})
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateReport}
              disabled={generatingPDF || taxRecords.length === 0}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {generatingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FaFilePdf className="mr-2" />
                  Download Report
                </>
              )}
            </button>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlus className="mr-2" />
              Add Tax Record
            </button>
          </div>
        </div>

        {/* Table */}
        <TaxComplianceTable
          records={taxRecords}
          onEdit={setEditingRecord}
          onDelete={handleDelete}
          onPayment={handlePayment}
        />

        {/* Form Modal */}
        {(showForm || editingRecord) && (
          <TaxComplianceForm
            record={editingRecord}
            onSubmit={
              editingRecord
                ? (data) => handleUpdate(editingRecord._id, data)
                : handleCreate
            }
            onCancel={() => {
              setShowForm(false);
              setEditingRecord(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaxCompliance;
// frontend/src/pages/financialmanager/FinancialDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaChartLine, FaMoneyBillWave, FaUserTie, FaShoppingCart, FaFilePdf } from 'react-icons/fa';
import FinancialSummary from './FinancialSummary';
import RevenueExpenseChart from './RevenueExpenseChart';
import FinancialKPI from './FinancialKPI';
import FinancialFilter from './FinancialFilter';
import { generateDashboardPDF } from './dashboardPdfGenerator';

const FinancialDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const summaryResponse = await axios.get('/api/finance/summary', {
        params: dateRange
      });
      setSummary(summaryResponse.data.data);

      const kpisResponse = await axios.get('/api/finance/kpis');
      setKpis(kpisResponse.data.data);

      const monthlyResponse = await axios.get('/api/finance/monthly');
      setMonthlyData(monthlyResponse.data.data);

    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!kpis || !summary || monthlyData.length === 0) {
      toast.warning('Please wait for dashboard data to load');
      return;
    }

    setGeneratingPDF(true);
    try {
      await generateDashboardPDF(kpis, summary, monthlyData, dateRange);
      toast.success('Dashboard PDF report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF report');
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Summary</h1>
        </div>

        {/* KPI Cards - Matching the screenshot layout */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Revenue</h3>
                <FaChartLine className="text-green-500 text-lg" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Rs {kpis.revenue?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center text-xs text-green-600">
                <span className="font-medium">100% from last period</span>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Expenses</h3>
                <FaMoneyBillWave className="text-red-500 text-lg" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Rs {kpis.expenses?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center text-xs text-red-600">
                <span className="font-medium">100% from last period</span>
              </div>
            </div>

            {/* Employees Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Employees</h3>
                <FaUserTie className="text-purple-500 text-lg" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {kpis.employees || '0'}
              </p>
              <div className="text-xs text-gray-500">
                <span>Active staff</span>
              </div>
            </div>

            {/* Profit Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Profit</h3>
                <FaShoppingCart className="text-blue-500 text-lg" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                Rs {kpis.profit?.toLocaleString() || '0'}
              </p>
              <div className="flex items-center text-xs text-blue-600">
                <span className="font-medium">{kpis.profitMargin || '0'}% margin</span>
              </div>
            </div>
          </div>
        )}

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Date Range</h2>
            <button
              onClick={handleGenerateReport}
              disabled={generatingPDF || !kpis || !summary}
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
          </div>
          <FinancialFilter dateRange={dateRange} onFilterChange={setDateRange} />
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Financial Overview</h2>
          <FinancialSummary summary={summary} />
        </div>

        {/* Revenue vs Expenses Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue vs Expenses Trend</h2>
          <RevenueExpenseChart data={monthlyData} />
        </div>

        {/* PDF Generation Status */}
        {generatingPDF && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            Generating PDF Report...
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;


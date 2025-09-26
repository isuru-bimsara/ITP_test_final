// frontend/src/pages/financialmanager/Financialdashboard.jsx
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
      
      // Fetch financial summary
      const summaryResponse = await axios.get('/api/finance/summary', {
        params: dateRange
      });
      setSummary(summaryResponse.data.data);

      // Fetch KPIs
      const kpisResponse = await axios.get('/api/finance/kpis');
      setKpis(kpisResponse.data.data);

      // Fetch monthly data
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Dashboard</h1>
        <button
          onClick={handleGenerateReport}
          disabled={generatingPDF || !kpis || !summary}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
        >
          {generatingPDF ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <FaFilePdf className="mr-2" />
              Downloard Report
            </>
          )}
        </button>
      </div>
      
      {/* KPI Summary Cards */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <FinancialKPI 
            title="Revenue" 
            value={`Rs ${kpis.revenue?.toLocaleString()}`} 
            growth={kpis.revenueGrowth} 
            icon={<FaChartLine className="text-green-500" size={24} />} 
          />
          <FinancialKPI 
            title="Expenses" 
            value={`Rs ${kpis.expenses?.toLocaleString()}`} 
            growth={kpis.expensesGrowth} 
            icon={<FaMoneyBillWave className="text-red-500" size={24} />} 
          />
          <FinancialKPI 
            title="Employees" 
            value={kpis.employees} 
            icon={<FaUserTie className="text-purple-500" size={24} />} 
          />
          <FinancialKPI 
            title="Profit" 
            value={`Rs ${kpis.profit?.toLocaleString()}`} 
            subValue={`${kpis.profitMargin}% margin`} 
            icon={<FaShoppingCart className="text-blue-500" size={24} />} 
          />
        </div>
      )}
      
      {/* Financial Summary Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Financial Summary</h2>
          <div className="flex items-center space-x-4">
            <FinancialFilter dateRange={dateRange} onFilterChange={setDateRange} />
          </div>
        </div>
        
        <FinancialSummary summary={summary} />
      </div>
      
      {/* Revenue and Expenses Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Revenue vs Expenses (Last 12 Months)</h2>
        </div>
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
  );
};

export default FinancialDashboard;
// frontend/src/pages/financialmanager/Financialdashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const FinancialDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    invoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentTransactions] = useState([
    { id: 1, type: "revenue", message: "Payment received: $5,000", time: "10 mins ago" },
    { id: 2, type: "expense", message: "Office rent paid: $2,000", time: "1 hour ago" },
    { id: 3, type: "profit", message: "Q3 profit report generated", time: "2 hours ago" },
    { id: 4, type: "invoice", message: "Invoice #1234 pending approval", time: "4 hours ago" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const [revRes, expRes, profRes, invRes] = await Promise.all([
          axios.get(`${API_URL}/revenue`),
          axios.get(`${API_URL}/expenses`),
          axios.get(`${API_URL}/profit`),
          axios.get(`${API_URL}/invoices`),
        ]);
        setStats({
          revenue: revRes.data.total,
          expenses: expRes.data.total,
          profit: profRes.data.total,
          invoices: invRes.data.length,
        });
      } catch (err) {
        console.error("Failed to fetch finance stats:", err);
        setError("Failed to load financial dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Revenue",
      value: `$${stats.revenue}`,
      color: "#16a34a",
      bgColor: "#dcfce7",
      trend: "+8%",
      trendUp: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V3a8 8 0 018 8h-8zM11 11h-8a8 8 0 008 8v-8z" />
        </svg>
      ),
    },
    {
      title: "Expenses",
      value: `$${stats.expenses}`,
      color: "#ef4444",
      bgColor: "#fee2e2",
      trend: "-5%",
      trendUp: false,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8" />
        </svg>
      ),
    },
    {
      title: "Profit",
      value: `$${stats.profit}`,
      color: "#2563eb",
      bgColor: "#dbeafe",
      trend: "+12%",
      trendUp: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7" />
        </svg>
      ),
    },
    {
      title: "Invoices",
      value: stats.invoices,
      color: "#f59e0b",
      bgColor: "#fef3c7",
      trend: "+3%",
      trendUp: true,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6h6v6m-7 4h8a2 2 0 002-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-xl shadow-lg border text-center">
          <h3 className="text-lg font-bold mb-2 text-red-600">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Financial Dashboard</h1>
        <p className="text-gray-500 mb-6">Quick overview of financial performance and transactions.</p>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
                <div className="w-24 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition"
              >
                <div
                  className="w-14 h-14 flex items-center justify-center rounded-lg mb-4"
                  style={{ backgroundColor: card.bgColor, color: card.color }}
                >
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-600">{card.title}</h3>
                <p className="text-3xl font-bold" style={{ color: card.color }}>
                  {card.value}
                </p>
                <p className={`mt-2 text-sm font-medium ${card.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {card.trend}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                  <span className="font-bold">{txn.type[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{txn.message}</p>
                  <p className="text-sm text-gray-500">{txn.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;

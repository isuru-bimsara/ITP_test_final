// frontend/src/pages/financialmanager/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartLine,
  FaMoneyBillWave,
  FaUserTie,
  FaFileInvoiceDollar
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/expenses', name: 'Expenses', icon: <FaMoneyBillWave /> },
    { path: '/incomes', name: 'Incomes', icon: <FaMoneyBillWave /> },
    { path: '/salaries', name: 'Salaries', icon: <FaUserTie /> },
    { path: '/tax-compliance', name: 'Tax Compliance', icon: <FaFileInvoiceDollar /> },
  ];

  return (
    <div className="w-64 bg-blue-800 text-white h-full">
      <div className="p-6">
        <h2 className="text-xl font-bold">Finance System</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              location.pathname === item.path
                ? 'bg-blue-900 text-white'
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
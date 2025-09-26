// // frontend/src/layouts/Financelayout.jsx
// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from '../components/dashboard/Sidebar';
// import Header from '../components/dashboard/Header';

// const FinanceLayout = () => {
//   const navLinks = [
//     { name: "Dashboard", path: "/financialmanager/dashboard" },
//     // { name: 'Drivers', path: '/financialmanager/drivers' },
//     // { name: 'Vehicles', path: '/financialmanager/vehicles' },
//     // { name: 'Deliveries', path: '/financialmanager/deliveries' },
//     // { name: 'FAQs', path: '/financialmanager/faqs' },
//     // { name: 'Inquiries', path: '/financialmanager/inquiries' },
//     // { name: 'Contacts', path: '/financialmanager/contacts' },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar navLinks={navLinks} />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FinanceLayout;

import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaMoneyBillWave,
  FaUserTie,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import Navbar from "../pages/financialmanager/Navbar";

const FinanceLayout = () => {
  const location = useLocation();

  const items = [
    {
      to: "/financialmanager/dashboard",
      label: "Dashboard",
      icon: <FaChartLine />,
    },
    {
      to: "/financialmanager/expenses",
      label: "Expenses",
      icon: <FaMoneyBillWave />,
    },
    {
      to: "/financialmanager/incomes",
      label: "Incomes",
      icon: <FaMoneyBillWave />,
    },
    {
      to: "/financialmanager/salaries",
      label: "Salaries",
      icon: <FaUserTie />,
    },
    {
      to: "/financialmanager/tax-compliance",
      label: "Tax Compliance",
      icon: <FaFileInvoiceDollar />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold">Finance System</h2>
        </div>
        <nav className="mt-2">
          {items.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-900 text-white"
                    : "text-blue-100 hover:bg-blue-700"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FinanceLayout;

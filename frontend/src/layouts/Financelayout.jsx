// frontend/src/layouts/Financelayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

const FinanceLayout = () => {
  const navLinks = [
    { name: "Dashboard", path: "/financialmanager/dashboard" },
    // { name: 'Drivers', path: '/financialmanager/drivers' },
    // { name: 'Vehicles', path: '/financialmanager/vehicles' },
    // { name: 'Deliveries', path: '/financialmanager/deliveries' },
    // { name: 'FAQs', path: '/financialmanager/faqs' },
    // { name: 'Inquiries', path: '/financialmanager/inquiries' },
    // { name: 'Contacts', path: '/financialmanager/contacts' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar navLinks={navLinks} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FinanceLayout;

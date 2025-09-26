// frontend/src/pages/financialmanager/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">FabricLK Finance Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


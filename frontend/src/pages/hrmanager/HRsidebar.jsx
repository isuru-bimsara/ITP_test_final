// frontend/src/pages/hrmanager/HRsidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      window.dispatchEvent(new Event("auth:update"));
      window.location.href = "/login";
    }
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      path: "/hrmanager/dashboard",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 10L10 3L17 10" stroke="#2563eb" />
            <rect x="6" y="10" width="8" height="7" rx="1" stroke="#2563eb" />
          </svg>
        </span>
      ),
    },
    {
      label: "Add Employee",
      path: "/hrmanager/add-employee",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="9" cy="7" r="4" stroke="#222" />
            <path d="M5 21c0-4 4-7 9-7" stroke="#222" />
            <line x1="19" y1="8" x2="19" y2="14" stroke="#222" />
            <line x1="16" y1="11" x2="22" y2="11" stroke="#222" />
          </svg>
        </span>
      ),
    },
    {
      label: "Your Employees",
      path: "/hrmanager/our-employees",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="9" cy="7" r="4" stroke="#222" />
            <path d="M2 21c0-4 3-7 7-7" stroke="#222" />
            <circle cx="17" cy="7" r="3" stroke="#222" />
            <path d="M22 21c0-3-2-6-5-6" stroke="#222" />
          </svg>
        </span>
      ),
    },
    {
      label: "Generate Report",
      path: "/hrmanager/GenerateReport",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </span>
      ),
    },
    {
      label: "My Profile",
      path: "/hrmanager/profile",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
      ),
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen">
      <div className="px-6 py-8">
        <div className="flex items-center mb-10">
          <span className="text-blue-600 font-extrabold text-2xl">
            HR Panel
          </span>
        </div>
        <nav className="space-y-2 font-medium text-gray-700">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-semibold border-r-4 border-blue-600"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-6 py-6 border-t border-gray-200">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {JSON.parse(localStorage.getItem("user"))?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {JSON.parse(localStorage.getItem("user"))?.username || "User"}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {JSON.parse(localStorage.getItem("user"))?.role || "hrmanager"}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
          <span className="mr-3 flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
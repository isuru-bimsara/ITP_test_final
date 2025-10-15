import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const SupplierDashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600">
        <div className="text-center">
          <div className="animate-pulse text-lg">Loading supplier details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Welcome back, {user.username || 'Supplier'} 👋
          </h1>
          <p className="text-blue-600">Manage your supplier profile and information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6 pb-4 border-b border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {user.username?.charAt(0).toUpperCase() || 'S'}
            </div>
            <h2 className="text-2xl font-semibold text-blue-900">
              Supplier Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-600 text-sm font-medium mb-1">Username</p>
              <p className="text-blue-900 font-semibold text-lg">{user.username}</p>
            </div>

            {/* Email */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-600 text-sm font-medium mb-1">Email</p>
              <p className="text-blue-900 font-semibold text-lg break-all">{user.email}</p>
            </div>

            {/* Company Name */}
            {user.clientcompanyName && (
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                <p className="text-cyan-600 text-sm font-medium mb-1">Company Name</p>
                <p className="text-cyan-900 font-semibold text-lg">{user.clientcompanyName}</p>
              </div>
            )}

            {/* Contact Person */}
            {user.clientcontactName && (
              <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                <p className="text-cyan-600 text-sm font-medium mb-1">Contact Person</p>
                <p className="text-cyan-900 font-semibold text-lg">{user.clientcontactName}</p>
              </div>
            )}

            {/* Phone */}
            {user.clientphone && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-blue-600 text-sm font-medium mb-1">Phone</p>
                <p className="text-blue-900 font-semibold text-lg">{user.clientphone}</p>
              </div>
            )}

            {/* Address */}
            {user.clientaddress && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-blue-600 text-sm font-medium mb-1">Address</p>
                <p className="text-blue-900 font-semibold text-lg">{user.clientaddress}</p>
              </div>
            )}

            {/* Role */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-600 text-sm font-medium mb-1">Role</p>
              <p className="text-blue-900 font-semibold text-lg capitalize">{user.role}</p>
            </div>

            {/* Account Status */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-600 text-sm font-medium mb-1">Account Status</p>
              <span
                className={`inline-block text-sm font-semibold px-4 py-2 rounded-full ${
                  user.clientisActive
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-md'
                }`}
              >
                {user.clientisActive ? '✓ Active' : '✕ Inactive'}
              </span>
            </div>

            {/* Product Categories */}
            {user.clientproductCategories && user.clientproductCategories.length > 0 && (
              <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                <p className="text-blue-600 text-sm font-medium mb-3">Product Categories</p>
                <div className="flex flex-wrap gap-2">
                  {user.clientproductCategories.map((cat, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
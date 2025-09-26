//frontend/src/dashboards/HRmanager/HRprofile.jsx

import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiEdit,
  FiSave,
  FiX,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiKey,
  FiLogOut,
} from "react-icons/fi";
import axios from "axios";
// ✅ FIXED: Using the same import pattern as your UpdateEmployee.jsx
import Sidebar from "./HRsidebar";

const backendUrl = "http://localhost:5000"; // use your .env in prod

// Sign Out Handler (inline, consistent with Navbar)
const handleSignOut = async () => {
  try {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/auth/signout", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (_) {
    // ignore
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    // Dispatch auth update event
    window.dispatchEvent(new Event("auth:update"));

    window.location.href = "/login"; // or use navigate("/login") if available
  }
};

const ProfileField = ({ icon, label, value, isEditing, inputProps }) => (
  <div>
    <div className="text-lg font-semibold text-gray-700 mb-2">{label}</div>
    <div className="flex items-center text-blue-600 text-xl">
      {icon}
      {isEditing ? (
        <input
          {...inputProps}
          className="border border-gray-300 rounded px-2 py-1 text-gray-800 w-full"
        />
      ) : (
        <span className="text-gray-800">{value || "Not provided"}</span>
      )}
    </div>
  </div>
);

function renderRoleFields(
  role,
  roleData,
  isEditing,
  editedRoleData,
  onChangeRoleField
) {
  if (!roleData && !editedRoleData) return null;
  const data = isEditing ? editedRoleData : roleData;

  switch (role) {
    case "shopowner":
      return (
        <>
          <ProfileField
            icon={<FiPhone className="mr-2" />}
            label="Contact Number"
            value={data?.contactNumber}
            isEditing={isEditing}
            inputProps={{
              name: "contactNumber",
              value: data?.contactNumber || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiMapPin className="mr-2" />}
            label="Address"
            value={data?.address}
            isEditing={isEditing}
            inputProps={{
              name: "address",
              value: data?.address || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiBriefcase className="mr-2" />}
            label="Shop Type"
            value={data?.ShopType}
            isEditing={isEditing}
            inputProps={{
              name: "ShopType",
              value: data?.ShopType || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiBriefcase className="mr-2" />}
            label="Shop Name"
            value={data?.ShopName}
            isEditing={isEditing}
            inputProps={{
              name: "ShopName",
              value: data?.ShopName || "",
              onChange: onChangeRoleField,
            }}
          />
        </>
      );
    case "supplier":
      return (
        <>
          <ProfileField
            icon={<FiBriefcase className="mr-2" />}
            label="Company Name"
            value={data?.companyName}
            isEditing={isEditing}
            inputProps={{
              name: "companyName",
              value: data?.companyName || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiPhone className="mr-2" />}
            label="Contact Number"
            value={data?.contactNumber}
            isEditing={isEditing}
            inputProps={{
              name: "contactNumber",
              value: data?.contactNumber || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiMapPin className="mr-2" />}
            label="Address"
            value={data?.address}
            isEditing={isEditing}
            inputProps={{
              name: "address",
              value: data?.address || "",
              onChange: onChangeRoleField,
            }}
          />
        </>
      );
    case "HRmanager":
    case "financialmanager":
    case "ordersupplymanager":
    case "deliverymanager":
    case "feedbackservicemanager":
      return (
        <>
          <ProfileField
            icon={<FiBriefcase className="mr-2" />}
            label="Department"
            value={data?.department}
            // isEditing={isEditing} // Department not editable
            inputProps={{
              name: "department",
              value: data?.department || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiPhone className="mr-2" />}
            label="Contact Number"
            value={data?.contactNumber}
            isEditing={isEditing}
            inputProps={{
              name: "contactNumber",
              value: data?.contactNumber || "",
              onChange: onChangeRoleField,
            }}
          />
          <ProfileField
            icon={<FiMapPin className="mr-2" />}
            label="Address"
            value={data?.address}
            isEditing={isEditing}
            inputProps={{
              name: "address",
              value: data?.address || "",
              onChange: onChangeRoleField,
            }}
          />
        </>
      );
    default:
      return null;
  }
}

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [editedRoleData, setEditedRoleData] = useState({});

  // Password section state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Current user info
  const currentUser = {
    login: "isuru-bimsara",
    currentDateTime: "2025-09-21 07:28:03",
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.user) {
          setUser(data.user);
          setRoleData(data.roleData || {});
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          alert("Failed to load profile data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // When entering edit mode, copy current data to edit state
  const startEdit = () => {
    setEditedUser(user);
    setEditedRoleData(roleData || {});
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user);
    setEditedRoleData(roleData || {});
  };

  const handleEditUser = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRoleData = (e) => {
    const { name, value } = e.target;
    setEditedRoleData((prev) => ({ ...prev, [name]: value }));
  };

  // Enhanced saveProfile function with proper event dispatching
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        {
          name: editedUser.name,
          email: editedUser.email,
          roleSpecific: editedRoleData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setUser(data.user);
      setRoleData(data.roleData || {});
      setIsEditing(false);

      // Update localStorage to keep data in sync
      localStorage.setItem("userName", data.user.name || "");
      localStorage.setItem("email", data.user.email || "");
      localStorage.setItem("role", data.user.role || "");

      // Dispatch event to notify Navbar about profile update
      window.dispatchEvent(new Event("profile:updated"));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Password Change Handlers
  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Enhanced password change with event dispatching
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${backendUrl}/api/user/update-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(data.message || "Password updated successfully!");

      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);

      // Dispatch event if password change affects user data
      window.dispatchEvent(new Event("profile:updated"));
    } catch (error) {
      console.error("Password update failed:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update password. Please check your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Enhanced sign out handler
  const handleSignOutLocal = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      await handleSignOut();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-xl text-gray-600 mb-4">
                Loading profile...
              </div>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-xl text-red-600 mb-4">
                Failed to load profile data
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // ✅ FIXED SCROLL LAYOUT: h-screen container, overflow-y-auto on main content only
    <div className="flex h-screen bg-gray-50">
      {/* ✅ FIXED SIDEBAR */}
      <Sidebar />

      {/* ✅ SCROLLABLE MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-12 flex items-center gap-8 relative">
              <div className="rounded-full bg-white w-32 h-32 flex items-center justify-center">
                <FiUser className="text-6xl text-blue-600" />
              </div>
              <div>
                <div className="text-white text-2xl font-bold">
                  {user.name || "User Name"}
                </div>
                <div className="text-blue-200 mt-2 text-lg">
                  Role:{" "}
                  <span className="capitalize">{user.role || "user"}</span>
                </div>
                <div className="text-blue-200 mt-1 text-sm">
                  {user.email || "user@example.com"}
                </div>
                <div className="text-blue-100 mt-2 text-xs">
                  Login: {currentUser.login} | {currentUser.currentDateTime} UTC
                </div>
              </div>
              <button
                onClick={handleSignOutLocal}
                className="absolute right-10 top-10 group bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                title="Sign Out"
              >
                <div className="flex items-center">
                  <FiLogOut className="mr-3 text-lg group-hover:animate-pulse" />
                  <span className="text-lg">Sign Out</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Profile Details */}
            <div className="px-12 py-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
                    onClick={startEdit}
                    disabled={isSaving}
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center text-green-600 hover:text-green-800 font-medium text-lg transition-colors disabled:opacity-50"
                      onClick={saveProfile}
                      disabled={isSaving}
                    >
                      <FiSave className="mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="flex items-center text-red-600 hover:text-red-800 font-medium text-lg transition-colors"
                      onClick={cancelEdit}
                      disabled={isSaving}
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Name */}
                <ProfileField
                  icon={<FiUser className="mr-2" />}
                  label="Full Name"
                  value={isEditing ? editedUser.name : user.name}
                  isEditing={isEditing}
                  inputProps={{
                    name: "name",
                    value: editedUser.name || "",
                    onChange: handleEditUser,
                    required: true,
                  }}
                />

                {/* Email */}
                <ProfileField
                  icon={<FiMail className="mr-2" />}
                  label="Email Address"
                  value={isEditing ? editedUser.email : user.email}
                  isEditing={isEditing}
                  inputProps={{
                    name: "email",
                    type: "email",
                    value: editedUser.email || "",
                    onChange: handleEditUser,
                    required: true,
                  }}
                />

                {/* Role-specific fields */}
                {renderRoleFields(
                  user.role,
                  roleData,
                  isEditing,
                  editedRoleData,
                  handleEditRoleData
                )}
              </div>

              {/* Password Change Section */}
              <div className="border border-gray-200 rounded-lg p-6 mt-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <FiKey className="text-blue-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Change Password
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm((show) => !show)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    disabled={passwordLoading}
                  >
                    {showPasswordForm ? "Cancel" : "Change Password"}
                  </button>
                </div>

                {showPasswordForm && (
                  <form
                    onSubmit={handlePasswordChange}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        required
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={passwordLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        required
                        minLength={6}
                        value={passwordData.newPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={passwordLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        required
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInput}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        disabled={passwordLoading}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        disabled={passwordLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiEdit,
  FiSave,
  FiX,
  FiLogOut,
  FiKey,
} from "react-icons/fi";
import axios from "axios";
import Sidebar from "../financialmanager/Sidebar"; // Adjust path if needed
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5000";

function getAuthToken() {
  const direct = localStorage.getItem("token");
  if (direct) return direct;
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.token) return parsed.token;
    }
  } catch {}
  return null;
}

const handleSignOut = async () => {
  try {
    const token = getAuthToken();
    await fetch(`${backendUrl}/api/auth/signout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (_) {
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("auth:update"));
    window.location.href = "/login";
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

const FinanceProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/users/profile`);
        let normalized;
        if (data?.user) {
          normalized = {
            _id: data.user._id,
            name: data.user.name || data.user.username || "",
            email: data.user.email || "",
            role: data.user.role || "",
          };
        } else {
          normalized = {
            _id: data._id,
            name: data.name || data.username || "",
            email: data.email || "",
            role: data.role || "",
          };
        }
        setUser(normalized);
      } catch (err) {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        } else {
          toast.error(
            err?.response?.data?.message || "Failed to load profile data"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const startEdit = () => {
    setEditedUser(user || {});
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditedUser(user || {});
  };

  const handleEditUser = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      setIsSaving(true);
      const payload = {
        name: editedUser.name,
        email: editedUser.email,
      };
      const { data } = await axios.put(
        `${backendUrl}/api/users/profile`,
        payload
      );
      let updatedUser;
      if (data?.user) {
        updatedUser = {
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };
      } else {
        updatedUser = {
          _id: data._id,
          name: data.name || data.username,
          email: data.email,
          role: data.role,
        };
      }
      setUser(updatedUser);
      setIsEditing(false);
      localStorage.setItem("userName", updatedUser.name || "");
      localStorage.setItem("email", updatedUser.email || "");
      localStorage.setItem("role", updatedUser.role || "");
      window.dispatchEvent(new Event("profile:updated"));
      toast.success(data.message || "Profile updated successfully!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const token = getAuthToken();
    try {
      setPasswordLoading(true);
      const { data } = await axios.put(
        `${backendUrl}/api/users/update-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      window.dispatchEvent(new Event("profile:updated"));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update password. Check your current password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        
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
       
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-red-600 mb-4">
              Failed to load profile
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
   
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
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
              </div>
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to sign out?"))
                    await handleSignOut();
                }}
                className="absolute right-10 top-10 group bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                <div className="flex items-center">
                  <FiLogOut className="mr-3 text-lg group-hover:animate-pulse" />
                  <span className="text-lg">Sign Out</span>
                </div>
              </button>
            </div>

            <div className="px-12 py-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
                    onClick={startEdit}
                  >
                    <FiEdit className="mr-2" /> Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center text-green-600 hover:text-green-800 font-medium text-lg"
                      onClick={saveProfile}
                      disabled={isSaving}
                    >
                      <FiSave className="mr-2" />{" "}
                      {isSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="flex items-center text-red-600 hover:text-red-800 font-medium text-lg"
                      onClick={cancelEdit}
                      disabled={isSaving}
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ProfileField
                  icon={<FiUser className="mr-2" />}
                  label="Full Name"
                  value={isEditing ? editedUser.name : user.name}
                  isEditing={isEditing}
                  inputProps={{
                    name: "name",
                    value: editedUser.name || "",
                    onChange: (e) => handleEditUser(e),
                    required: true,
                  }}
                />

                <ProfileField
                  icon={<FiMail className="mr-2" />}
                  label="Email Address"
                  value={isEditing ? editedUser.email : user.email}
                  isEditing={isEditing}
                  inputProps={{
                    name: "email",
                    type: "email",
                    value: editedUser.email || "",
                    onChange: (e) => handleEditUser(e),
                    required: true,
                  }}
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-6 mt-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <FiKey className="text-blue-600 mr-3" />
                    <h3 className="text-lg font-medium text-gray-800">
                      Change Password
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm((s) => !s)}
                    className="text-blue-600 hover:text-blue-800"
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
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
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
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        disabled={passwordLoading}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
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

export default FinanceProfile;

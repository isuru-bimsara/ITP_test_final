import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiShield,
  FiEdit,
  FiSave,
  FiX,
  FiKey,
} from "react-icons/fi";

// Read token from "token" or "user.token"
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

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  // Backend returns { _id, username, email, role }
  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [form, setForm] = useState({ name: "", email: "" });

  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Simple client-side validation
  const [errors, setErrors] = useState({ name: "", email: "" });

  const isDirty = useMemo(
    () => form.name !== user.name || form.email !== user.email,
    [form, user]
  );

  const initials = useMemo(() => {
    const src = (user.name || user.email || "U").trim();
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }, [user.name, user.email]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login to access your profile");
      window.location.href = "/login";
      return;
    }
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/users/profile");
        const payload = {
          name: data.username || "",
          email: data.email || "",
          role: data.role || "",
        };
        setUser(payload);
        setForm({ name: payload.name, email: payload.email });
      } catch (err) {
        console.error(
          "Profile load error:",
          err?.response?.data || err.message
        );
        toast.error(err?.response?.data?.message || "Failed to load profile");
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validate = () => {
    const next = { name: "", email: "" };
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      next.email = "Please enter a valid email";
    }
    setErrors(next);
    return !next.name && !next.email;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await axios.put("/api/users/profile", {
        name: form.name.trim(),
        email: form.email.trim(),
      });
      setUser((u) => ({
        ...u,
        name: form.name.trim(),
        email: form.email.trim(),
      }));
      localStorage.setItem("userName", form.name.trim());
      localStorage.setItem("email", form.email.trim());
      window.dispatchEvent(new Event("profile:updated"));
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.error("Save profile error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setPwdSaving(true);
      await axios.put("/api/users/update-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPassword(false);
    } catch (err) {
      console.error(
        "Update password error:",
        err?.response?.data || err.message
      );
      toast.error(
        err?.response?.data?.message ||
          "Failed to update password. Check your current password."
      );
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8">
      {/* Header banner */}
      <div className="rounded-2xl overflow-hidden shadow-md bg-white">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/95 shadow flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-bold text-blue-700">
                {initials}
              </span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user.name || user.email || "Your Profile"}
              </h1>
              <div className="mt-1 opacity-90">{user.email}</div>
              <div className="mt-2 inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full">
                <FiShield className="opacity-90" />
                <span className="capitalize font-medium">
                  {user.role || "user"}
                </span>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-medium shadow"
              >
                <FiEdit /> Edit Profile
              </button>
            ) : (
              <div className="ml-auto flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving || !isDirty}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-60"
                >
                  <FiSave /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setForm({ name: user.name, email: user.email });
                    setErrors({ name: "", email: "" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  disabled={!editing}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, name: e.target.value }));
                    if (errors.name) setErrors((er) => ({ ...er, name: "" }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editing
                      ? "border-gray-300"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FiMail /> Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled={!editing}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    if (errors.email) setErrors((er) => ({ ...er, email: "" }));
                  }}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editing
                      ? "border-gray-300"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showPassword ? "Close" : "Open"}
                </button>
              </div>

              {showPassword && (
                <form
                  onSubmit={handlePasswordUpdate}
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          currentPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={pwdSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                    >
                      <FiKey /> {pwdSaving ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Quick summary card */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Account Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Name</span>
                  <span
                    className="font-medium text-gray-900 truncate max-w-[60%]"
                    title={user.name}
                  >
                    {user.name || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email</span>
                  <span
                    className="font-medium text-gray-900 truncate max-w-[60%]"
                    title={user.email}
                  >
                    {user.email || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium capitalize text-gray-900">
                    {user.role || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tips</h3>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                <li>Use a valid email you actively check.</li>
                <li>Choose a strong password you don’t reuse.</li>
                <li>Click “Edit Profile” to modify your name or email.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;

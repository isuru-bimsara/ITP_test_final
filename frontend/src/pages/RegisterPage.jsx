// frontend/src/pages/RegisterPage.jsx

import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ new success message state
  const { register } = useAuth();

  // ✅ frontend validation function
  const validateForm = () => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3)
      return "Username must be at least 3 characters long";
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    if (!role) return "Please select a role";
    return null; // no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await register(username, email, password, role);
      setSuccess("Registration successful! 🎉 You can now log in.");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("Customer");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(
          "Failed to register. The username or email might already be in use."
        );
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title="Create an Account">
        {/* ✅ success message */}
        {success && (
          <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
            {success}
          </p>
        )}

        {/* ❌ error message */}
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-[var(--color-text-main)]">
              Username
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[var(--color-border-main)] rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[var(--color-text-main)]">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-[var(--color-border-main)] rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[var(--color-text-main)]">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-[var(--color-border-main)] rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-[var(--color-text-main)]">
              Register as:
            </label>
            <select
              className="w-full px-3 py-2 border border-[var(--color-border-main)] rounded-md"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Customer">Customer</option>
              <option value="Admin">Admin</option>
              <option value="hrmanager">HR Manager</option>
              <option value="financialmanager">Financial Manager</option>
              <option value="Supplier">Supplier</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--color-primary)] hover:underline"
          >
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;

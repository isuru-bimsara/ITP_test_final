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
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    try {
      await register(username, email, password, role);
    } catch (err) {
      setError("Failed to register. The email might already be in use.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title="Create an Account">
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
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
            </select>
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
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

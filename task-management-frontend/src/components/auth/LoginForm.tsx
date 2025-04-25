"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onShowRegister: () => void;
}

export default function LoginForm({ onShowRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth(); // Ensure this uses Axios in the AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password); // Axios-based login function
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-purple-400">Welcome Back</h2>
        <p className="text-gray-300 mt-2">Please sign in to your account</p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-gray-100 bg-gray-700 placeholder-gray-400"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-300 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-gray-100 bg-gray-700 placeholder-gray-400"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md border border-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
      >
        Sign in
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-300">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onShowRegister}
            className="text-purple-400 hover:text-purple-300 font-semibold focus:outline-none transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
}

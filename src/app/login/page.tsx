// src/app/login/page.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        username,
        password,
      });
      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light dark:bg-dark">
      <div className="bg-white dark:bg-customGrey p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
          Login
        </h2>
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2 text-black dark:text-white"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-white text-black dark:text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2 text-black dark:text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-white text-black dark:text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-buttonBackground text-buttonText p-2 rounded hover:bg-buttonHover transition"
          >
            Login
          </button>
        </form>
        <Link
          href="/register"
          className="text-buttonBackground dark:text-buttonHover hover:underline block mt-4"
        >
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;

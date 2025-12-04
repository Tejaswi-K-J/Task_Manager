import { useState } from "react";
import axiosInstance from "../api/axiosInstance"; // ✅ Updated import
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      alert("Registration successful!");
      window.location.href = "/";
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Register Button */}
          <button className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded">
            Register
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link className="text-blue-400" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

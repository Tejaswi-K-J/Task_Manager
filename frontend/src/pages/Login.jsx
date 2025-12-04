import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance"; // ✅ Updated import

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Store user + token inside context/localStorage
      login(res.data);

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
            Login
          </button>
        </form>

        <p className="text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link className="text-blue-400" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

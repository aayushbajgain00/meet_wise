import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      Swal.fire({
        title: "Please fill all the fields",
        icon: "warning",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        title: "Password must be at least 8 characters",
        icon: "warning",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    try {
      await Axios.post("http://localhost:5000/api/user/register", {
        name,
        email,
        password,
      });

      Swal.fire({
        title: "Account created successfully!",
        icon: "success",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });

      setLoading(false);
      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: "Error Occurred",
        text: error.response?.data?.message || error.message,
        icon: "error",
        toast: true,
        position: "top-right",
        timer: 4000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Meetwise Logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold text-blue-700">Meetwise</h1>
          <p className="text-sm text-blue-500">
            Never miss a word, Always stay wise
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={submitHandler}>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fas fa-user" />
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fas fa-envelope" />
              </span>
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fas fa-lock" />
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 py-2 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already a member?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
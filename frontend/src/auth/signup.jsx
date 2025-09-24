import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "./authLayout";
import Button from "../component/button";

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
        title: "Account created successfully! Please log in.",
        icon: "success",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });

      setLoading(false);

      // After signup → go to login page
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
    <AuthLayout>
      <form className="space-y-5" onSubmit={submitHandler}>
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your password"
          />
          <p className="mt-2 text-xs text-gray-500">
            Must be at least 8 characters
          </p>
        </div>

        <Button loading={loading} name="Sign Up" loadingName="Signing up" />
      </form>

      <p className="mt-6 mb-4 text-center text-sm text-gray-600">
        Already a member?{" "}
        <Link to="/login" className="underline hover:text-blue-500">
          Sign in to your account
        </Link>
      </p>
    </AuthLayout>
  );
}

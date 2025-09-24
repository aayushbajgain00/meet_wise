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
    <AuthLayout>
        <form className="space-y-5" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your password"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Must be at least 8 characters
            </p>
          </div>

          <Button loading={loading} name={"Sign Up"} loadingName={"Signing up"}/>
        </form>

        <p className="mt-6 mb-4 flex w-full items-center justify-between text-center text-sm text-gray-600">
          Already a member?{" "}
          <Link to="/login" >
            <span className="font-small underline hover:text-blue-500 transition-colors">
              Sign in to your account
            </span>
          </Link>
        </p>
    </AuthLayout>
  );
}
import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "./authLayout";
import Button from "../component/button";
import useGoogleAuth from "../lib/useGoogleAuth";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { startGoogleAuth, googleLoading } = useGoogleAuth({
    onSuccess: ({ user, token }) => {
      Swal.fire({
        title: "Signed up with Google",
        icon: "success",
        toast: true,
        position: "top-right",
        timer: 3000,
        showConfirmButton: false,
      });
      const session = { ...user, token };
      localStorage.setItem("userInfo", JSON.stringify(session));
      navigate("/homepage");
    },
    onError: (message) => {
      Swal.fire({
        title: "Google Signup Failed",
        text: message,
        icon: "error",
        toast: true,
        position: "top-right",
        timer: 4000,
        showConfirmButton: false,
      });
    },
  });

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
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
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
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
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
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
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

        <Button loading={loading} name={"Sign Up"} loadingName={"Signing up"} />
      </form>

      <p className="mt-6 mb-4 flex w-full items-center justify-between text-center text-sm text-gray-600">
        Already a member?{" "}
        <Link to="/login">
          <span className="font-small underline hover:text-blue-500 transition-colors">
            Sign in to your account
          </span>
        </Link>
      </p>
      <div className="flex flex-col gap-4 items-center justify-center text-sm text-gray-500">
        <div className="relative flex items-center w-full max-w-xs">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">
            Or sign up with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          type="button"
          onClick={startGoogleAuth}
          disabled={googleLoading}
          className="flex items-center justify-center border border-blue-300 p-3 hover:bg-gray-100 hover:text-black hover:border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {googleLoading ? (
            "Signing up..."
          ) : (
            <>
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </>
          )}
        </button>
      </div>

    </AuthLayout>
  );
}

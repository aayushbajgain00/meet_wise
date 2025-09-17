import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AuthLayout from "./authLayout";
import Button from "../component/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      Swal.fire({
        title: "Please fill all fields",
        icon: "warning",
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data.isVerified) {
        Swal.fire({
          title: "User is not verified",
          icon: "info",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "User successfully logged in",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/homepage");
      }
    } catch (error) {
      Swal.fire({
        title: "Error Occurred",
        text: error.response?.data?.message || error.message,
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
        <form className="space-y-5" onSubmit={submitHandler}>
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
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button loading={loading} name={"Login"} loadingName={"Logging in"}/>
        </form>

        <div className="mt-6 mb-4 flex flex-col items-start gap-4 text-center text-sm text-gray-600">
          <p className="flex items-center justify-between w-full ">
            Forgot Password?{" "}
            <Link to="/reset-password" >
              <span className="font-small underline hover:text-blue-500 transition-colors">
                Reset it Here
              </span>
            </Link>
          </p>
          <div>
            <Link to="/signup" >
              <span className="underline hover:text-blue-500 transition-colors">
                Create a New Account
              </span>
            </Link>

          </div>
        </div>
    </AuthLayout>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AuthLayout from "./authLayout";
import Button from "../component/button";
import { useMsal } from "@azure/msal-react";
import useGoogleAuth from "../lib/useGoogleAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();
  const { startGoogleAuth, googleLoading } = useGoogleAuth({
    onSuccess: ({ user, token }) => {
      Swal.fire({
        title: "Signed in with Google",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        showConfirmButton: false,
      });

      const session = { ...user, token };
      localStorage.setItem("userInfo", JSON.stringify(session));
      navigate("/homepage");
    },
    onError: (message) => {
      Swal.fire({
        title: "Google Login Failed",
        text: message,
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        showConfirmButton: false,
      });
    },
  });

  const handleMicrosoftLogin = async () => {
    setMicrosoftLoading(true);
    try {
      const loginRequest = {
        scopes: ["User.Read", "openid", "profile", "email"],
        prompt: "select_account",
      };

      const response = await instance.loginPopup(loginRequest);

      // Sending Microsoft token for verification
      const { data } = await axios.post(
        "http://localhost:5000/api/user/microsoft-login",
        { accessToken: response.accessToken },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        Swal.fire({
          title: "User successfully logged in with Microsoft",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Microsoft login error:", error);
      Swal.fire({
        title: "Microsoft Login Failed",
        text: error.response?.data?.message || error.message,
        icon: "error",
        toast: true,
        timer: 4000,
        position: "top-right",
        showConfirmButton: false,
      });
    } finally {
      setMicrosoftLoading(false);
    }
  };
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
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
        </div>

        <Button loading={loading} name={"Login"} loadingName={"Logging in"} />
      </form>

      <div className="mt-6 mb-4 flex flex-col items-start gap-4 text-center text-sm text-gray-600">
        <p className="flex items-center justify-between w-full ">
          Forgot Password?{" "}
          <Link to="/reset-password">
            <span className="font-small underline hover:text-blue-500 transition-colors">
              Reset it Here
            </span>
          </Link>
        </p>
        <div>
          <Link to="/signup">
            <span className="underline hover:text-blue-500 transition-colors">
              Create a New Account
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center justify-center text-sm text-gray-500">
        <div className="relative flex items-center w-full max-w-xs">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">
            Or Sign in with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={startGoogleAuth}
            disabled={googleLoading}
            className="flex items-center justify-center border border-blue-300 p-3 hover:bg-gray-100 hover:text-black hover:border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {googleLoading ? (
              "Logging in..."
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

          <button
            onClick={handleMicrosoftLogin}
            disabled={microsoftLoading}
            className="flex items-center justify-center border border-blue-300 p-3 hover:bg-gray-100 hover:text-black hover:border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {microsoftLoading ? (
              "Logging in..."
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2 "
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.5 11.5H23V0H11.5V11.5Z" fill="#F1511B" />
                  <path d="M11.5 23H23V11.5H11.5V23Z" fill="#80CC28" />
                  <path d="M0 11.5H11.5V0H0V11.5Z" fill="#00ADEF" />
                  <path d="M0 23H11.5V11.5H0V23Z" fill="#FBBC09" />
                </svg>
                Microsoft
              </>
            )}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

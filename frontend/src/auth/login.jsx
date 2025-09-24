import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AuthLayout from "./authLayout";
import Button from "../component/button";
import { useMsal } from "@azure/msal-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [microsoftLoading, setMicrosoftLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { instance } = useMsal();

  /* ---------------- Microsoft Login ---------------- */
  const handleMicrosoftLogin = async () => {
    setMicrosoftLoading(true);
    try {
      const loginRequest = {
        scopes: ["User.Read", "openid", "profile", "email"],
        prompt: "select_account",
      };

      const response = await instance.loginPopup(loginRequest);

      const { data } = await axios.post(
        "http://localhost:5000/api/user/microsoft-login",
        { accessToken: response.accessToken },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        const name =
          data.user?.name ||
          response.account?.name ||
          response.account?.username ||
          "User";

        localStorage.setItem("mw_user_name", name);
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        Swal.fire({
          title: "Logged in with Microsoft",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });

        navigate("/homepage");
      }
    } catch (error) {
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

  /* ---------------- Email + Password Login ---------------- */
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
        const name = data.name || data.user?.name || email.split("@")[0] || "User";

        localStorage.setItem("mw_user_name", name);
        localStorage.setItem("userInfo", JSON.stringify(data));

        Swal.fire({
          title: "Logged in successfully",
          icon: "success",
          toast: true,
          timer: 3000,
          position: "top-right",
          showConfirmButton: false,
        });

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
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 py-3 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Enter your password"
          />
        </div>

        <Button loading={loading} name="Login" loadingName="Logging in" />
      </form>

      {/* Links */}
      <div className="mt-6 mb-4 text-sm text-gray-600">
        <p>
          Forgot Password?{" "}
          <Link to="/reset-password" className="underline hover:text-blue-500">
            Reset it here
          </Link>
        </p>
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="underline hover:text-blue-500">
            Create one
          </Link>
        </p>
      </div>

      {/* Social logins */}
      <div className="flex flex-col gap-4 items-center text-sm text-gray-500">
        <div className="relative flex items-center w-full max-w-xs">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4">Or sign in with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Google Button */}
          <button
            disabled={googleLoading}
            className="flex items-center justify-center gap-3 w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            {googleLoading ? "Signing in..." : "Sign in with Google"}
          </button>

          {/* Microsoft Button */}
          <button
            onClick={handleMicrosoftLogin}
            disabled={microsoftLoading}
            className="flex items-center justify-center gap-3 w-full rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft"
              className="w-5 h-5"
            />
            {microsoftLoading ? "Signing in..." : "Sign in with Microsoft"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

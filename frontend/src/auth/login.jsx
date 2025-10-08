import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AuthLayout from "./authLayout";
import Button from "../component/button";
import { useMsal } from "@azure/msal-react";
import { EmailIcon, GoogleLogo, MicrosoftLogo, PasswordIcon } from "../component/svgs";
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
      navigate("/app");
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
        scopes: ["User.Read", "openid", "profile", "email", "Calendars.Read", "Calendars.ReadWrite"],
        prompt: "select_account",
      };

      const response = await instance.loginPopup(loginRequest);

      // Sending Microsoft token for verification
      const { data } = await axios.post(
        "http://localhost:8000/api/user/microsoft-login",
        { accessToken: response.accessToken },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {3363
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

        navigate("/app");
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

        navigate("/app");
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
                <EmailIcon/>
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
                <PasswordIcon/>

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
                <GoogleLogo/>
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
                <MicrosoftLogo/>
                Microsoft
              </>
            )}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./login.css"; // <-- add this import

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
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo + Title */}
        <div className="auth-header">
          <img src="/logo.png" alt="Meetwise Logo" className="auth-logo" />
          <h1 className="auth-title">Meetwise</h1>
          <p className="auth-subtitle">Welcome back! Sign in to continue</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={submitHandler}>
          {/* Email */}
          <div className="form-row">
            <label htmlFor="email" className="auth-label">
              Email address
            </label>
            <div className="auth-input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Enter your email"
                autoComplete="email"
              />
              <span className="auth-input-icon">
                <i className="fas fa-envelope" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="form-row">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <div className="auth-input-group">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <span className="auth-input-icon">
                <i className="fas fa-lock" aria-hidden="true" />
              </span>
            </div>

            <div className="auth-right">
              <Link to="/forgot-password" className="auth-link-small">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

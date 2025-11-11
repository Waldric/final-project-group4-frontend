import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mieLogo from "/mie-logo.png";
import mieLeft from "/login-leftside.jpg";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const USE_FAKE_LOGIN = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
  if (USE_FAKE_LOGIN) {
    // ---- TEMP FAKE LOGIN (for testing) ----
    const user = {
      id: "dev-123",
      account_id: "ACC-0001",
      firstname: "John",
      lastname: "Doe",
      email: email || "dev@example.com",
      user_type: "admin", // or "admin" / "teacher" as needed
      department: "CS",
      photo: null,
      status: "Active",
    };

    // persist user (same as real flow)
    try {
      sessionStorage.setItem("mie_user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      /* ignore storage errors */
    }

    // navigate as if logged in
    navigate("/dashboard", { state: { user } });
    // ----------------------------------------
  } else {
    // ---- REAL LOGIN (original code) ----
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    const user = res.data.user;

    // persist user
    try {
      sessionStorage.setItem("mie_user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      /* ignore storage errors */
    }

    navigate("/dashboard", { state: { user } });
    // -------------------------------------
  }
} catch (err) {
  console.error("login error:", err);
  if (err.response && err.response.status === 404)
    setError(err.response.data.message || "Not found");
  else if (err.response && err.response.status === 400)
    setError(err.response.data.message || "Bad request");
  else setError("Server error. Check backend.");
}
  };

  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      {/* Left side image */}
      <div className="hidden md:flex w-1/2">
        <img
          src={mieLeft}
          alt="MIE Background"
          className="object-cover w-full h-full rounded-l-2xl"
        />
      </div>

      {/* Right side login form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-base-100 rounded-r-2xl p-10 relative">
        <div className="max-w-sm w-full text-center">
          <img
            src={mieLogo}
            alt="Medina Institute of Excellence Logo"
            className="mx-auto mb-2 w-40 -mt-4" // 👈 made it bigger and moved up
          />
          <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
          <p className="mb-6 text-gray-500 text-sm">
            Enter your email and password to access your account.
          </p>

          <form onSubmit={handleSubmit} method="post" className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Email:</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field with Show/Hide Button */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Password:</span>
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-12" // 👈 space for icon
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="text-lg">{showPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Login Button */}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Log In
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="link link-primary"
            >
              Sign Up
            </button>
          </p>

          <p className="text-xs text-gray-400 mt-6">
            Group 4 Final Project © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import mieLogo from "/mie-logo.png";
import mieLeft from "/login-leftside.jpg";

const Login = () => {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      {/* Left Image Section */}
      <div className="hidden md:flex w-1/2">
        <img
          src={mieLeft}
          alt="MIE Background"
          className="object-cover w-full h-full rounded-l-2xl"
        />
      </div>

      {/* Right Login Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-base-100 rounded-r-2xl p-10">
        <div className="max-w-sm w-full text-center">
          <img
            src={mieLogo}
            alt="Medina Institute of Excellence Logo"
            className="mx-auto mb-4 w-32"
          />
          <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
          <p className="mb-6 text-gray-500 text-sm">
            Enter your email and password to access your account.
          </p>

          <form className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Email:</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Password:</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
              />
            </div>

            <button className="btn btn-primary w-full mt-4">Log In</button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="#" className="link link-primary">
              Sign Up
            </a>
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

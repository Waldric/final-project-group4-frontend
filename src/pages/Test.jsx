import React from "react";
import { useLocation, Link } from "react-router-dom";

const Test = () => {
  const { state } = useLocation();
  let user = state?.user;

  // fallback to sessionStorage (in case of page reload or lost state)
  if (!user) {
    try {
      const stored = sessionStorage.getItem("mie_user");
      if (stored) user = JSON.parse(stored);
    } catch (err) {
      console.warn("Failed to parse sessionStorage user", err);
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">404 - Not Found</h2>
          <p className="mt-2">No user data available. Please <Link to="/" className="text-blue-600">login</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#F5F7FB]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Login Successful!</h1>
        <img src={user.photo || "/mie-logo.png"} alt="avatar" className="w-20 h-20 rounded-full mx-auto mb-4" />
        <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Account ID:</strong> {user.account_id}</p>
        <p><strong>Department:</strong> {user.department}</p>
        <p><strong>User Type:</strong> {user.user_type}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn btn-outline"
            onClick={() => {
              sessionStorage.removeItem("mie_user");
            }}
          >
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Test;

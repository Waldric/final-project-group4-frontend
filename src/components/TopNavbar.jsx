// src/components/TopNavbar.jsx
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ user, setUser }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored user and redirect to login
    try {
      sessionStorage.removeItem("mie_user");
    } catch (err) {
      // ignore
    }
    setUser && setUser(null);
    navigate("/", { replace: true });
  };

  const displayName =
    user && (user.firstname || user.lastname)
      ? `${user.firstname || ""}${user.firstname && user.lastname ? ", " : ""}${user.lastname || ""}`.replace(/^, |, $/, "")
      : "No Profile";

  // If backend uses `user_type` show that. Fallback to 'Student' or '—'
  const displayRole = (user && (user.user_type || user.role)) || "Student";

  const avatarSrc = (user && (user.photo || user.avatar)) || "/mie-logo.png";

  return (
    <header className="fixed top-0 right-0 left-54 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-end gap-4 px-6 py-3">
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((s) => !s)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
            aria-haspopup="true"
            aria-expanded={showDropdown}
          >
            <img
              src={avatarSrc}
              alt="User Avatar"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/mie-logo.png";
              }}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="font-medium text-sm text-gray-800">
                {displayName}
              </div>
              <div className="text-xs text-gray-500">{displayRole}</div>
            </div>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowDropdown(false);
                  // navigate to profile page if you have one
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/settings");
                }}
              >
                Settings
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

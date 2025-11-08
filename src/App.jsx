// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Test from "./pages/Test";

// dashboard components
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import MainContent from "./components/MainContent";

function DashboardPage() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem("mie_user");
      return s ? JSON.parse(s) : location.state?.user || null;
    } catch {
      return location.state?.user || null;
    }
  });

  // if Login passed user via location.state, persist it to sessionStorage and sync state
  useEffect(() => {
    if (!user && location.state?.user) {
      try {
        sessionStorage.setItem("mie_user", JSON.stringify(location.state.user));
      } catch {
        // ignore
      }
      setUser(location.state.user);
    }
  }, [location.state, user]);

  // protect dashboard: if no user, redirect to login
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* pass user and setUser so TopNavbar can show profile & logout */}
      <TopNavbar user={user} setUser={setUser} />

      <MainContent activeItem={activeItem} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/test" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

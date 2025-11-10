// dashboard components
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import MainContent from "../components/MainContent";
import { Navigate, Outlet, useLocation } from "react-router";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import DashboardIndex from "./DashboardIndex";
import { useAuth } from "../contexts/AuthContext";

function DashboardLayout() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, setUser } = useAuth();

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
        user={user}
      />

      {/* pass user and setUser so TopNavbar can show profile & logout */}
      <TopNavbar user={user} setUser={setUser} />

      <main className="md:ml-54 mt-19 bg-[#F5F7FB] min-h-screen flex flex-col">
        <Outlet />
        <Footer />
      </main>

    </div>
  );
}

export default DashboardLayout;

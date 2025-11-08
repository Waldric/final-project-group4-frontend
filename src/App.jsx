import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopNavbar from "./components/TopNavbar";
import MainContent from "./components/Maincontent";

export default function App() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/*No login page yet*/}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <TopNavbar />
      <MainContent activeItem={activeItem} />
    </div>
  );
}

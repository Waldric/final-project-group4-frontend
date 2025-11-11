// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import StudentProfileView from "./pages/student/StudentProfileView";
import AdminEnrollment from "./pages/admin/AdminEnrollment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default dashboard route */}
          <Route index element={<DashboardIndex />} />

          {/* Modified: Student Page */}
          <Route path="student/profile" element={<StudentProfileView />} />

          {/* Modified: Admin Page */}
          <Route path="admin/student-records" element={<AdminEnrollment />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

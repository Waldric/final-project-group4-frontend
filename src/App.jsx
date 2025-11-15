// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import StudentProfileView from "./pages/student/StudentProfileView";
import TeacherPageSample from "./pages/teacher/TeacherPageSample";
import ManageSubjects from "./pages/admin/ManageSubjects";
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

          {/* Student pages */}
          <Route path="student/profile" element={<StudentProfileView />} />

          {/* Teacher pages */}
          <Route path="teacher/classes" element={<TeacherPageSample />} />

          {/* Admin pages */}
          <Route path="admin/student-records" element={<AdminEnrollment />} />
          <Route path="admin/subjects" element={<ManageSubjects />} />

        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

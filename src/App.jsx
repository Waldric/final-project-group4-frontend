// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import StudentProfileView from "./pages/student/StudentProfileView";
import TeacherPageSample from "./pages/teacher/TeacherPageSample";
import ManageSubjects from "./pages/admin/ManageSubjects";
import TeacherProfileView from "./pages/teacher/TeacherProfileView";
import AdminProfileView from "./pages/admin/AdminProfileView";
import StudentRecords from "./pages/admin/StudentRecords";
import StudentSchedulePage from "./pages/admin/StudentSchedulePage";

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
          <Route path="teacher/profile" element={<TeacherProfileView />} />

          {/* Admin pages */}
          <Route path="admin/profile" element={<AdminProfileView />} />
          <Route path="admin/student-records" element={<StudentRecords />} />
          <Route path="admin/subjects" element={<ManageSubjects />} />
          <Route path="admin/student-schedule/:studentId" element={<StudentSchedulePage />} />  

        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

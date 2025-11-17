// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import MyGrades from "./pages/student/MyGrades";
import MyDisciplinaryRecords from "./pages/student/MyDisciplinaryRecords";
import TeacherPageSample from "./pages/teacher/TeacherPageSample";
import ManageGrades from "./pages/teacher/ManageGrades";
import ManageDisciplinary from "./pages/teacher/ManageDisciplinary";
import ManageAccounts from "./pages/admin/ManageAccounts";
import ManageSubjects from "./pages/admin/ManageSubjects";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProfileView from "./pages/student/StudentProfileView";
import AdminEnrollment from "./pages/admin/AdminEnrollment";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import GradeClassStudents from "./pages/teacher/GradeClassStudents";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* General dashboard accessible to all authenticated users */}
          <Route index element={<DashboardIndex />} />

          {/* Student routes */}
          <Route element={<ProtectedRoute requiredRole="Student" />}>
            <Route path="student/grades" element={<MyGrades />} />
            <Route path="student/profile" element={<StudentProfileView />} />
            <Route path="student/records" element={<MyDisciplinaryRecords />} />
          </Route>

          {/* Teacher routes */}
          <Route element={<ProtectedRoute requiredRole="Teacher" />}>
            <Route path="teacher/classes" element={<TeacherClasses />} />
            <Route path="teacher/grades" element={<ManageGrades />} />
            <Route path="/dashboard/teacher/grades/class/:teacherId/:subjectId" element={<GradeClassStudents />}/>
            <Route path="teacher/disciplinary-records" element={<ManageDisciplinary />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="admin/student-records" element={<AdminEnrollment />} />

            <Route path="admin/manage-accounts" element={<ManageAccounts />} />
            <Route path="admin/subjects" element={<ManageSubjects />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

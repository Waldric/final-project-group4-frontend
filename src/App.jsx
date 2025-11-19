// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import MyDisciplinaryRecords from "./pages/student/MyDisciplinaryRecords";
import ManageGrades from "./pages/teacher/ManageGrades";
import ManageDisciplinary from "./pages/teacher/ManageDisciplinary";
import ManageAccounts from "./pages/admin/ManageAccounts";
import StudentProfileView from "./pages/student/StudentProfileView";
import TeacherPageSample from "./pages/teacher/TeacherPageSample";
import ManageSubjects from "./pages/admin/ManageSubjects";
import MyGrades from "./pages/student/MyGrades";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherRecords from "./pages/admin/TeacherRecords";
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
          <Route 
            path="student/profile" 
            element={<StudentProfileView />} />
          <Route 
            path="student/grades" 
            element={<MyGrades />} />
          <Route
            path="student/records"
            element={<MyDisciplinaryRecords />}
          />

          {/* Teacher pages */}
          <Route 
            path="teacher/profile" 
            element={<TeacherProfileView />} />
          <Route
            path="teacher/classes"
            element={<TeacherClasses />}
          />
          <Route 
            path="teacher/grades" 
            element={<ManageGrades />} />
          <Route
            path="teacher/disciplinary-records"
            element={<ManageDisciplinary />}
          />

          {/* Admin pages */}
          <Route 
            path="admin/profile" 
            element={<AdminProfileView />} />
          <Route 
            path="admin/student-records" 
            element={<StudentRecords />} />
          <Route
            path="admin/student-schedule/:studentId"
            element={<StudentSchedulePage />}
          />
          <Route
            path="admin/manage-accounts"
            element={<ManageAccounts />}
          />
          <Route
            path="admin/teacher-records"
            element={<TeacherRecords />}
          />
           <Route
            path="admin/teacher-records/:teacherId"
            element={<StudentSchedulePage />}
          />
          <Route
            path="admin/subjects"
            element={<ManageSubjects />}
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

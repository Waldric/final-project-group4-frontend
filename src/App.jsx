// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Test from "./pages/Test";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardIndex from "./pages/DashboardIndex";
import StudentPageSample from "./pages/student/StudentPageSample";
import TeacherPageSample from "./pages/teacher/TeacherPageSample";
import ManageGrades from "./pages/teacher/ManageGrades";
import ManageDisciplinary from "./pages/teacher/ManageDisciplinary";
import AdminPageSample from "./pages/admin/AdminPageSample";
import ManageAccounts from "./pages/admin/ManageAccounts";
import ManageSubjects from "./pages/admin/ManageSubjects";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Dashboard layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardIndex />} /> {/* /dashboard */}
          {/* Student pages below here */}
          <Route
            path="/dashboard/student/grades"
            element={<StudentPageSample />}
          />
          {/* Teacher pages below here */}
          <Route
            path="/dashboard/teacher/classes"
            element={<TeacherPageSample />}
          />
          <Route
            path="/dashboard/teacher/grades"
            element={<ManageGrades />}
          />
          <Route
            path="/dashboard/teacher/disciplinary-records"
            element={<ManageDisciplinary />}
          />
          {/* Admin pages below here*/}
          <Route
            path="/dashboard/admin/manage-accounts"
            element={<ManageAccounts />}
          />
          <Route
            path="/dashboard/admin/subjects"
            element={<ManageSubjects />}
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";

const DashboardIndex = () => {
  const { user } = useAuth();

  const headerContentsByRole = {
    Student: {
      headerSubtext: `View your academic performance, subject grades, 
                        and overall GPA for the selected semester.`,
    },
    Teacher: {
      headerSubtext: `Monitor your classes, schedules, and important updates
                      from the administration.`,
    },
    Admin: {
      headerSubtext: `View real-time statistics, recent activities, and key 
                      updates across students, teachers, payments, and 
                      announcements — all in one place.`,
    },
  };

  const headerContents = headerContentsByRole[user.user_type] || [];

  // Admin Default Page
  if (user.user_type === "Admin") {
    return <AdminDashboard />
  }

  // Teacher Default Page
  if (user.user_type === "Teacher") {
    return <TeacherDashboard />;
  }

  // Student Default Page
  if (user.user_type === "Student") {
    return (
      <div className="flex-1 p-4 md:p-8">
        {/* Page Header */}
        <Header
          location={"Dashboard"}
          subheader={headerContents.headerSubtext}
        />

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
          <p className="text-gray-500 text-center py-12">
            Dashboard content for the{" "}
            <span className="font-semibold text-[#5603AD]">
              {user.user_type} Role
            </span>{" "}
            goes here...
          </p>
        </div>
      </div>
    );
  }

  // Default dashboard if user somehow logs in without Role
  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header
        location={"Error!"}
        subheader={"Error! User type not loaded successfully"}
      />

      {/* Dashboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <p className="text-gray-500 text-center py-12">
          Reach out to admins if you somehow reached this page.
        </p>
      </div>
    </div>
  );
};

export default DashboardIndex;

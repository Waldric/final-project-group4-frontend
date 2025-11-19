import { useEffect, useState } from "react";
import api from "../../api";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const StudentDashboard = () => {
  const headerLocation = "My Dashboard";
  const headerSubtext =
    "View your academic performance, financial summary, class schedule, and the latest announcements all in one place.";

  const navigate = useNavigate();
  const { user } = useAuth();

  const [studentData, setStudentData] = useState({
    loading: true,
    error: null,
    profile: null,
    disciplinary: null,
    academic: null,
    schedule: [],
  });

  useEffect(() => {
    if (!user?.id) return;
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setStudentData((prev) => ({ ...prev, loading: true, error: null }));

      // Get student info first to get student_number
      const studentRes = await api.get(`/students/byAccount/${user.id}`);

      const student = studentRes.data.data;

      if (!student) {
        throw new Error("Student not found");
      }

      const studentNumber = student.student_number;

      // Fetch all other data in parallel
      const [gradesRes, disciplinaryRes, scheduleRes] = await Promise.all([
        api.get(`/grades?studentNumber=${studentNumber}`),
        api.get(`/disciplinary?student=${studentNumber}`),
        api.get(`/schedules?student_number=${studentNumber}`),
      ]);

      const grades = gradesRes.data.data || [];
      const disciplinary = disciplinaryRes.data.data || [];
      const schedules = scheduleRes.data.data || [];

      // Calculate academic data
      const academicData = calculateAcademicData(grades, schedules);

      // Format data for display
      setStudentData({
        loading: false,
        error: null,
        profile: {
          name: `${user.firstname || ""} ${user.lastname || ""}`,
          id: student.student_number || "N/A",
          avatar:
            user.photo ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student_number}`,
          program: student.course || "N/A",
          semester: getSemesterText(student.semester),
          yearLevel: getYearLevelText(student.year_level),
          schoolYear: student.school_year || "2025-2026",
        },
        disciplinary: {
          hasRecord: disciplinary.length > 0,
          count: disciplinary.length,
        },
        academic: {
          currentGPA: academicData.gpa,
          totalUnits: academicData.totalUnits,
          subjectsEnrolled: academicData.subjectsCount,
          semester: `${student.school_year || "2025-2026"}, ${getSemesterText(
            student.semester
          )}`,
        },
        schedule: formatSchedules(schedules),
      });
    } catch (err) {
      console.error("Error fetching student data:", err);
      setStudentData((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Failed to load dashboard data",
      }));
    }
  };

  const calculateAcademicData = (grades, schedules) => {
    let totalGradePoints = 0;
    let totalUnits = 0;
    let gradedSubjects = 0;

    // Calculate GPA from grades
    grades.forEach((gradeRecord) => {
      gradeRecord.grades?.forEach((g) => {
        if (g.percent && g.percent > 0) {
          const gpa = convertPercentToGPA(g.percent);
          const units = 3; // Default units per subject
          totalGradePoints += gpa * units;
          totalUnits += units;
          gradedSubjects++;
        }
      });
    });

    // Count enrolled subjects from schedules
    const enrolledSubjects = new Set();
    schedules.forEach((schedule) => {
      schedule.schedules?.forEach((s) => {
        if (s.subject_ref?._id) {
          enrolledSubjects.add(s.subject_ref._id);
        }
      });
    });

    return {
      gpa: totalUnits > 0 ? (totalGradePoints / totalUnits).toFixed(2) : "0.00",
      totalUnits: totalUnits.toString(),
      subjectsCount: enrolledSubjects.size.toString(),
    };
  };

  const convertPercentToGPA = (percent) => {
    if (percent >= 97) return 4.0;
    if (percent >= 93) return 3.7;
    if (percent >= 90) return 3.3;
    if (percent >= 87) return 3.0;
    if (percent >= 83) return 2.7;
    if (percent >= 80) return 2.3;
    if (percent >= 77) return 2.0;
    if (percent >= 75) return 1.7;
    return 1.0;
  };

  const formatSchedules = (schedules) => {
    const formattedSchedules = [];

    schedules.forEach((schedule) => {
      schedule.schedules?.forEach((s) => {
        const subject = s.subject_ref;
        const teacher = s.teacher_ref;

        formattedSchedules.push({
          code: subject?.subject_id || "N/A",
          title: subject?.subject_name || "N/A",
          days: formatDays(s.day),
          schedule: formatTime(s.start_time, s.end_time),
          room: s.room || "TBA",
          section: s.section || "N/A",
          teacher: teacher?.accounts_ref
            ? `${teacher.accounts_ref.firstname} ${teacher.accounts_ref.lastname}`
            : "N/A",
          email: teacher?.email || "N/A",
          units: subject?.units || "3",
          status: "Enrolled",
        });
      });
    });

    return formattedSchedules;
  };

  const formatDays = (days) => {
    if (!days || !Array.isArray(days)) return "TBA";
    const dayMap = {
      Monday: "M",
      Tuesday: "T",
      Wednesday: "W",
      Thursday: "Th",
      Friday: "F",
      Saturday: "S",
    };
    return days.map((d) => dayMap[d] || d).join("/");
  };

  const formatTime = (start, end) => {
    if (!start || !end) return "TBA";
    return `${start} - ${end}`;
  };

  const getSemesterText = (semester) => {
    const semesterMap = {
      1: "1st Semester",
      2: "2nd Semester",
      3: "Summer",
    };
    return semesterMap[semester] || "N/A";
  };

  const getYearLevelText = (year) => {
    const yearMap = {
      1: "1st Year",
      2: "2nd Year",
      3: "3rd Year",
      4: "4th Year",
      5: "5th Year",
    };
    return yearMap[year] || "N/A";
  };

  if (studentData.loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="h-screen flex justify-center items-center text-center">
          <span className="loading loading-dots loading-xl"></span>
        </div>
      </div>
    );
  }

  if (studentData.error) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="h-screen flex justify-center items-center text-center">
          <div className="max-w-md mx-auto p-6">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 mb-4">{studentData.error}</p>
            <button onClick={fetchStudentData} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="p-4 md:p-6">
        {/* FIRST ROW — Profile Left | Disciplinary + Academic Right */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* ---- PROFILE SUMMARY ---- */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Profile Summary
            </h2>

            <div className="flex flex-col items-center text-center">
              <div className="avatar mb-3">
                <div className="w-20 rounded-full ring-2 ring-gray-200">
                  <img src={studentData.profile.avatar} alt="Profile" />
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-1">
                {studentData.profile.name}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                ID: {studentData.profile.id}
              </p>
            </div>

            {/* FIXED ALIGNED INFO ROWS */}
            <div className="mt-6 grid grid-cols-2 gap-y-3 px-40">
              <span className="text-gray-600 text-sm">Program</span>
              <span className="text-right font-medium text-sm">
                {studentData.profile.program}
              </span>

              <span className="text-gray-600 text-sm">Semester</span>
              <span className="text-right font-medium text-sm">
                {studentData.profile.semester}
              </span>

              <span className="text-gray-600 text-sm">Year Level</span>
              <span className="text-right font-medium text-sm">
                {studentData.profile.yearLevel}
              </span>

              <span className="text-gray-600 text-sm">School Year</span>
              <span className="text-right font-medium text-sm">
                {studentData.profile.schoolYear}
              </span>
            </div>

            <button
              className="btn btn-outline mt-6 w-80 normal-case border-gray-500 text-gray-700 mx-auto block "
              onClick={() => navigate("/dashboard/student/profile")}
            >
              Edit Profile
            </button>
          </div>

          {/* ---- RIGHT COLUMN: DISCIPLINARY + ACADEMIC OVERVIEW ---- */}
          <div className="flex-1 flex flex-col gap-6">
            {/* ---- DISCIPLINARY STATUS ---- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:h-50">
              <h2 className="text-lg font-semibold mb-4">
                Disciplinary Status
              </h2>

              {studentData.disciplinary.hasRecord ? (
                <div className="w-full bg-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 mb-3">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span className="text-sm">
                    You have {studentData.disciplinary.count} disciplinary
                    record
                    {studentData.disciplinary.count > 1 ? "s" : ""}
                  </span>
                </div>
              ) : (
                <div className="w-full bg-green-100 text-green-600 px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="w-5 h-5 stroke-current"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">No disciplinary records</span>
                </div>
              )}

              <button
                className="text-blue-600 text-sm underline hover:text-blue-800"
                onClick={() => navigate("/dashboard/student/records")}
              >
                View Disciplinary Records →
              </button>
            </div>

            {/* ---- ACADEMIC OVERVIEW ---- */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:h-60">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-semibold">Academic Overview</h2>
                <span className="text-sm text-gray-400">
                  {studentData.academic.semester}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Current GPA</p>
                  <p className="text-4xl font-bold mt-2">
                    {studentData.academic.currentGPA}
                  </p>
                </div>

                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Total Units Earned</p>
                  <p className="text-4xl font-bold mt-2">
                    {studentData.academic.totalUnits}
                  </p>
                </div>

                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Subjects Enrolled</p>
                  <p className="text-4xl font-bold mt-2">
                    {studentData.academic.subjectsEnrolled}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- WEEKLY SCHEDULE ---- */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Your Schedule</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead className="text-gray-600">
                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Course Title</th>
                  <th>Days</th>
                  <th>Schedule</th>
                  <th>Room</th>
                  <th>Section</th>
                  <th>Teacher</th>
                  <th>Email</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {studentData.schedule.length === 0
                  ? [...Array(9)].map((_, index) => (
                      <tr key={index}>
                        <td className="text-gray-400">{index + 1}</td>
                        <td colSpan={10}></td>
                      </tr>
                    ))
                  : studentData.schedule.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.code}</td>
                        <td>{item.title}</td>
                        <td>{item.days}</td>
                        <td>{item.schedule}</td>
                        <td>{item.room}</td>
                        <td>{item.section}</td>
                        <td>{item.teacher}</td>
                        <td className="text-blue-600">{item.email}</td>
                        <td>{item.units}</td>
                        <td>
                          <span className="badge badge-success badge-sm">
                            Enrolled
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <button className="text-blue-600 text-sm underline mt-4 hover:text-blue-800">
            View your weekly class schedule →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

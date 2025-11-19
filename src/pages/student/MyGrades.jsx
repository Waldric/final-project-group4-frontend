// src/pages/student/MyGrades.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import Header from "../../components/Header";
import {
  XMarkIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";

const MyGrades = () => {
  const { user } = useAuth();

  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [selectedSort, setSelectedSort] = useState("Code A-Z");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ---------------- FETCH STUDENT GRADES ---------------- */
  useEffect(() => {
    const fetchGrades = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        let studentNumber = user.student_number;

        // Resolve student number if missing
        if (!studentNumber && user.id) {
          const studentRes = await api.get(`/students/byAccount/${user.id}`);
          studentNumber = studentRes.data?.data?.student_number || "";
        }

        if (!studentNumber) {
          setLoading(false);
          return;
        }

        // Fetch grades
        const response = await api.get(`/grades?student=${studentNumber}`);

        const formatted = [];

        response.data.data.forEach((record) => {
          record.grades.forEach((g) => {
            formatted.push({
              _id: `${record._id}-${g.subject_ref._id}`,
              semester: `${record.acad_year} ${getSemesterText(
                record.semester
              )}`,

              subject: {
                code: g.subject_ref?.subject_id || g.course_code || "",
                courseTitle: g.subject_ref?.subject_name || "",
                units: g.subject_ref?.units || 3,
                section: g.section || "", // default blank instead of N/A
              },

              instructor: g.teacher_ref?.account_ref
                ? `${g.teacher_ref.account_ref.firstname} ${g.teacher_ref.account_ref.lastname}`
                : g.teacher_ref?.teacher_uid || "TBA",

              grade: convertToGradeScale(g.percent),
              percent: g.percent,
              graded_date: g.graded_date,
            });
          });
        });

        setGrades(formatted);
        setFilteredGrades(formatted);
      } catch (err) {
        setError("Failed to load your grades. Please try again later.");
        console.error("Grade fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user?.id, user?.student_number]);

  /* ---------------- GRADE SCALE ---------------- */
  const convertToGradeScale = (percent) => {
    if (percent === null || percent === undefined) return "INC";
    if (percent >= 97) return "1.00";
    if (percent >= 94) return "1.25";
    if (percent >= 91) return "1.50";
    if (percent >= 88) return "1.75";
    if (percent >= 85) return "2.00";
    if (percent >= 82) return "2.25";
    if (percent >= 79) return "2.50";
    if (percent >= 76) return "2.75";
    if (percent >= 75) return "3.00";
    if (percent >= 70) return "4.00";
    return "5.00";
  };

  const getSemesterText = (sem) =>
    sem === 1 ? "1st Semester" : "2nd Semester";

  /* ---------------- SEARCH + FILTER ---------------- */
  useEffect(() => {
    let filtered = [...grades];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.subject.code.toLowerCase().includes(term) ||
          g.subject.courseTitle.toLowerCase().includes(term) ||
          g.instructor.toLowerCase().includes(term)
      );
    }

    // Semester filter
    if (selectedSemester !== "All Semesters") {
      filtered = filtered.filter((g) => g.semester === selectedSemester);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "Code A-Z":
          return a.subject.code.localeCompare(b.subject.code);
        case "Code Z-A":
          return b.subject.code.localeCompare(a.subject.code);
        case "Grade High-Low":
          return (b.percent || 0) - (a.percent || 0);
        default:
          return 0;
      }
    });

    setFilteredGrades(filtered);
  }, [searchTerm, selectedSemester, selectedSort, grades]);

  /* ---------------- GPA CALC ---------------- */
  const totalUnits = filteredGrades.reduce(
    (acc, g) => acc + g.subject.units,
    0
  );
  const totalGradePoints = filteredGrades.reduce((acc, g) => {
    const numeric = parseFloat(g.grade) || 5;
    return acc + numeric * g.subject.units;
  }, 0);
  const gpa =
    totalUnits > 0 ? (totalGradePoints / totalUnits).toFixed(2) : "0.00";

  /* ---------------- LOADING UI ---------------- */
  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
      <Header
        location="My Grades"
        subheader="View your academic performance, subject grades, and GPA"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px] flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search course code, title, or instructor..."
              className="input input-bordered w-full rounded-full pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Semester dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-outline rounded-full"
              >
                {selectedSemester}
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-64 z-10"
              >
                <li>
                  <a onClick={() => setSelectedSemester("All Semesters")}>
                    All Semesters
                  </a>
                </li>
                {[...new Set(grades.map((g) => g.semester))].map((sem) => (
                  <li key={sem}>
                    <a onClick={() => setSelectedSemester(sem)}>{sem}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sorting dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-outline rounded-full"
              >
                {selectedSort}
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-48 z-10"
              >
                <li>
                  <a onClick={() => setSelectedSort("Code A-Z")}>Code A-Z</a>
                </li>
                <li>
                  <a onClick={() => setSelectedSort("Code Z-A")}>Code Z-A</a>
                </li>
                <li>
                  <a onClick={() => setSelectedSort("Grade High-Low")}>
                    Grade High to Low
                  </a>
                </li>
              </ul>
            </div>

            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="btn btn-square btn-outline rounded-full"
              title="Refresh"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Grades Table */}
        <div className="grow overflow-x-auto">
          {filteredGrades.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-700">
                No grades found
              </p>
              <p className="text-gray-500 mt-2">
                {searchTerm || selectedSemester !== "All Semesters"
                  ? "Try adjusting your filters"
                  : "Your grades will appear once posted by your instructors"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-center">#</th>
                    <th>Course Title</th>
                    <th className="text-center">Units</th>
                    <th>Instructor</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredGrades.map((item, index) => (
                    <tr key={item._id} className="hover">
                      <td className="text-center font-medium text-gray-600">
                        {index + 1}
                      </td>

                      <td className="font-medium">
                        {item.subject.courseTitle}
                      </td>

                      <td className="text-center">{item.subject.units}</td>

                      <td className="text-sm text-gray-700">
                        {item.instructor}
                      </td>

                      <td className="text-center">
                        <span
                          className={`text-2xl font-semibold ${
                            item.percent >= 75
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* GPA Footer */}
        {filteredGrades.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-end items-center gap-8">
              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Total Units
                </p>
                <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  GPA
                </p>
                <p className="text-3xl font-bold text-purple-700">{gpa}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrades;

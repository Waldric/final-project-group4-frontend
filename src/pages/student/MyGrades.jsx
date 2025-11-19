// src/pages/student/MyGrades.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import Header from "../../components/Header";
import {
  XMarkIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  FunnelIcon, 
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

  // FETCH STUDENT'S GRADES FROM BACKEND
  useEffect(() => {
    const fetchGrades = async () => {
      if (!user?.student_number) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // This endpoint uses your existing getGrades + query filtering
        const response = await api.get(`/grades?student=${user.student_number}`);

        // Flatten nested grades array into simple list
        const allGrades = [];
        response.data.data.forEach(record => {
          record.grades.forEach(g => {
            allGrades.push({
              _id: `${record._id}-${g.subject_ref._id}`,
              semester: `${record.acad_year} ${getSemesterText(record.semester)}`,
              subject: {
                code: g.subject_ref?.subject_id || "N/A",
                courseTitle: g.subject_ref?.subject_name || "Unknown Subject",
                units: 3, // You can store units in Subject model later
                section: "N/A", // Add section to Schedule later if needed
              },
              instructor: `${g.teacher_ref?.teacher_uid || "Prof"} ${g.teacher_ref?.departments?.[0] || ""}`.trim(),
              grade: convertToGradeScale(g.percent),
              percent: g.percent,
              graded_date: g.graded_date,
            });
          });
        });

        setGrades(allGrades);
        setFilteredGrades(allGrades);
      } catch (err) {
        setError("Failed to load your grades. Please try again later.");
        console.error("Grade fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user?.student_number]);

  // Helper: Convert percent (0–100) → Philippine Grade (1.00–5.00)
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
    return "5.00"; // Below 70
  };

  const getSemesterText = (sem) => (sem === 1 ? "First Semester" : "Second Semester");

  // SEARCH + FILTER
  useEffect(() => {
    let filtered = [...grades];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        g =>
          g.subject.code.toLowerCase().includes(term) ||
          g.subject.courseTitle.toLowerCase().includes(term) ||
          g.instructor.toLowerCase().includes(term)
      );
    }

    // Semester Filter
    if (selectedSemester && selectedSemester !== "All Semesters") {
      filtered = filtered.filter(g => g.semester === selectedSemester);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case "Code A-Z":
          return a.subject.code.localeCompare(b.subject.code);
        case "Code Z-A":
          return b.subject.code.localeCompare(a.subject.code);
        case "Grade High-Low":
          return (a.percent || 0) - (b.percent || 0);
        default:
          return 0;
      }
    });

    setFilteredGrades(filtered);
  }, [searchTerm, selectedSemester, selectedSort, grades]);

  // GPA Calculation
  const totalUnits = filteredGrades.reduce((acc, g) => acc + g.subject.units, 0);
  const totalGradePoints = filteredGrades.reduce((acc, g) => {
    const numericGrade = parseFloat(convertToGradeScale(g.percent)) || 5;
    return acc + numericGrade * g.subject.units;
  }, 0);
  const gpa = totalUnits > 0 ? (totalGradePoints / totalUnits).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
      <Header
        location="My Grades"
        subheader="View your academic performance, subject grades, and GPA"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px] flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Search course code, title, or instructor..."
              className="input input-bordered w-full rounded-full pl-10 pr-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-10 top-1/2 -translate-y-1/2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-outline">
                {selectedSemester}
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 z-10">
                <li><a onClick={() => setSelectedSemester("All Semesters")}>All Semesters</a></li>
                {[...new Set(grades.map(g => g.semester))].map(sem => (
                  <li key={sem}><a onClick={() => setSelectedSemester(sem)}>{sem}</a></li>
                ))}
              </ul>
            </div>

            <button onClick={() => window.location.reload()} className="btn btn-square btn-outline">
              <ArrowPathIcon className="w-5 h-5" />
            </button>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline">
                {selectedSort}
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-10">
                <li><a onClick={() => setSelectedSort("Code A-Z")}>Code A-Z</a></li>
                <li><a onClick={() => setSelectedSort("Code Z-A")}>Code Z-A</a></li>
                <li><a onClick={() => setSelectedSort("Grade High-Low")}>Grade High to Low</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {/* Grades Table */}
        <div className="grow overflow-x-auto">
          {filteredGrades.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No grades found</p>
              <p className="mt-2">
                {searchTerm || selectedSemester !== "All Semesters"
                  ? "Try adjusting your filters"
                  : "Your grades will appear here once posted by your instructors"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredGrades.map((item, index) => (
                <div
                  key={item._id}
                  className={`grid grid-cols-12 gap-4 items-center px-6 py-5 rounded-xl ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } border border-gray-200 hover:shadow-md transition`}
                >
                  <div className="col-span-1 text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div className="col-span-1 font-bold text-purple-700">{item.subject.code}</div>
                  <div className="col-span-4 font-medium">{item.subject.courseTitle}</div>
                  <div className="col-span-1 text-center">{item.subject.units}</div>
                  <div className="col-span-1 text-center text-gray-600">{item.subject.section}</div>
                  <div className="col-span-3 text-sm text-gray-700">{item.instructor}</div>
                  <div className="col-span-1 text-right">
                    <span className={`text-2xl font-bold ${
                      item.percent >= 75 ? "text-green-600" : "text-red-600"
                    }`}>
                      {item.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t-2 border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-right">
            <div className="col-start-4 col-span-5">
              <span className="text-lg font-medium text-gray-700">Total Units</span>
            </div>
            <div className="col-span-1">
              <p className="text-2xl font-bold text-gray-900">{totalUnits}</p>
            </div>
            <div className="col-span-2">
              <span className="text-lg font-medium text-gray-700">GPA</span>
            </div>
            <div className="col-span-1">
              <p className="text-3xl font-bold text-purple-700">{gpa}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGrades;
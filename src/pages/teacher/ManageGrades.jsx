// src/pages/teacher/ManageGrades.jsx
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import ClassCard from "../../components/ClassCard";

const ManageGrades = () => {
  const headerLocation = "Student Grades";
  const headerSubtext =
    "View and manage your assigned classes, student lists, and academic records for the selected semester.";

  const { user } = useAuth();
  const navigate = useNavigate();

  // ⬇️ IMPORTANT: fetch TEACHER by account_ref, not /accounts/:account_id
  // Backend: GET /api/teachers/account/:accountId  (adjust base path if needed)
  const {
    data: teacherData,
    loading,
    error,
  } = useFetch(`/teachers/account/${user._id}`);

  // Teacher's departments and class list
  const departments = teacherData?.departments ?? [];
  const classes = teacherData?.subjects ?? [];

  // UI state
  const [activeDept, setActiveDept] = useState<string | "All">("All");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("code-asc"); // "code-asc" | "code-desc" | "name-asc" | "name-desc"

  // ------------------- FILTER + SORT (only filtered results) -------------------
  const visibleClasses = useMemo(() => {
    if (!classes || classes.length === 0) return [];

    const term = search.trim().toLowerCase();

    let result = classes;

    // filter by department (subject.department)
    if (activeDept !== "All") {
      result = result.filter(
        (cls) =>
          cls.subject_id?.department &&
          cls.subject_id.department === activeDept
      );
    }

    // search by subject code or name
    if (term) {
      result = result.filter((cls) => {
        const code = cls.subject_id?.code?.toLowerCase() ?? "";
        const name = cls.subject_id?.subject_name?.toLowerCase() ?? "";
        return code.includes(term) || name.includes(term);
      });
    }

    // sort only AFTER filtering
    result = [...result].sort((a, b) => {
      const codeA = a.subject_id?.code ?? "";
      const codeB = b.subject_id?.code ?? "";
      const nameA = a.subject_id?.subject_name ?? "";
      const nameB = b.subject_id?.subject_name ?? "";

      switch (sortOption) {
        case "code-desc":
          return codeB.localeCompare(codeA);
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "code-asc":
        default:
          return codeA.localeCompare(codeB);
      }
    });

    return result;
  }, [classes, activeDept, search, sortOption]);

  // Navigate to detailed grade page for that class
  const handleClassClick = (classId) => {
    navigate(`/dashboard/teacher/grades/${classId}`);
  };

  // ------------------- LOADING / ERROR -------------------
  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="flex justify-center items-center py-48">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="text-center py-48">
          <p className="text-2xl font-semibold text-red-500">
            Error loading data
          </p>
          <p className="text-gray-500">
            {error.message || "Request failed. Check the teacher endpoint."}
          </p>
        </div>
      </div>
    );
  }

  // ------------------- MAIN UI -------------------
  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* White card container like Figma */}
      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
        {/* Top row: dept tabs + filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Dept Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveDept("All")}
              className={`px-4 py-1.5 text-sm rounded-full border transition ${
                activeDept === "All"
                  ? "bg-[#5603AD] text-white border-[#5603AD]"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-1.5 text-sm rounded-full border transition ${
                  activeDept === dept
                    ? "bg-[#5603AD] text-white border-[#5603AD]"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            {/* Search bar with icon */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subject..."
                className="input input-bordered w-full md:w-64 pl-8 rounded-full text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort dropdown (pretty) */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost border border-gray-200 rounded-full text-sm gap-2 px-4"
              >
                <FunnelIcon className="w-4 h-4" />
                Sort
                <ChevronDownIcon className="w-4 h-4" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu shadow bg-base-100 rounded-xl p-2 w-52 text-sm"
              >
                <li>
                  <a onClick={() => setSortOption("code-asc")}>
                    Code A → Z
                  </a>
                </li>
                <li>
                  <a onClick={() => setSortOption("code-desc")}>
                    Code Z → A
                  </a>
                </li>
                <li>
                  <a onClick={() => setSortOption("name-asc")}>
                    Name A → Z
                  </a>
                </li>
                <li>
                  <a onClick={() => setSortOption("name-desc")}>
                    Name Z → A
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Classes count */}
        <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
          <span>
            Classes ({visibleClasses.length}
            {activeDept !== "All" ? ` • ${activeDept}` : ""})
          </span>
        </div>

        {/* Class cards list */}
        <div className="space-y-3">
          {visibleClasses.length > 0 ? (
            visibleClasses.map((cls) => (
              <ClassCard
                key={cls.subject_id._id}
                classInfo={cls}
                onClick={() => handleClassClick(cls.subject_id._id)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-10">
              {classes.length === 0
                ? "You are not assigned to any classes."
                : "No classes match your filters."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageGrades;

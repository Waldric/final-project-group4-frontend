import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api";
import AddStudentModal from "../../components/ModalComponents/AddStudentModal";

// Departments from backend model structure
const DEPARTMENTS = ["IS", "CCS", "COE", "COS"];

export default function StudentRecords() {
  /* ---------------- Local State ---------------- */
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");

  // Department Filter
  const [filters, setFilters] = useState({
    dept: [],
  });

  const navigate = useNavigate();

  /* ---------------- Fetch Students From Backend ---------------- */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/students");
        setStudents(res.data.data || []);
        setLoading(false);
      } catch (err) {
        setErrMsg("Failed to load students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ---------------- Department Toggle ---------------- */
  const toggleDept = (dept) =>
    setFilters((prev) => ({
      ...prev,
      dept: prev.dept.includes(dept)
        ? prev.dept.filter((d) => d !== dept)
        : [...prev.dept, dept],
    }));

  const clearDepts = () =>
    setFilters((prev) => ({
      ...prev,
      dept: [],
    }));

  /* ---------------- Filtering Logic ---------------- */
  const filteredStudents = useMemo(() => {
    let data = [...students];

    // Department filter
    if (filters.dept.length > 0) {
      data = data.filter((s) => filters.dept.includes(s.department));
    }

    // Grade/Year filter (dynamic)
    if (yearFilter !== "All") {
      data = data.filter((s) => {
        const levelLabel =
          s.department === "IS"
            ? `Grade ${s.year_level}`
            : `Year ${s.year_level}`;
        return levelLabel === yearFilter;
      });
    }

    // Search filter
    if (search.trim()) {
      const t = search.toLowerCase();
      data = data.filter(
        (s) =>
          s.student_number.toLowerCase().includes(t) ||
          `${s.accounts_ref?.firstname} ${s.accounts_ref?.lastname}`
            .toLowerCase()
            .includes(t)
      );
    }

    return data;
  }, [students, filters.dept, yearFilter, search]);

  /* ---------------- UI Rendering ---------------- */
  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Header */}
      <Header
        location={"Student Records"}
        subheader="Manage student information, enrollment details, and academic records."
      />

      {/* Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
        {/* Backend Error */}
        {errMsg && (
          <div className="alert alert-error mb-4">
            <span>{errMsg}</span>
          </div>
        )}

        {/* ---------------- Department Toggle ---------------- */}
        <div className="flex items-center mb-5 m-5">
          <div className="flex gap-3 items-center bg-gray-50 px-4 py-2 rounded-full">
            {DEPARTMENTS.map((dept) => {
              const active = filters.dept.includes(dept);
              return (
                <button
                  key={dept}
                  className={`px-5 py-1.5 rounded-full text-sm transition-all 
                    ${
                      active
                        ? "bg-[#5603AD] text-white shadow"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  onClick={() => toggleDept(dept)}
                >
                  {dept}
                </button>
              );
            })}

            <button
              className="px-5 py-1.5 rounded-full border border-gray-400 text-gray-600 text-sm hover:bg-gray-100"
              onClick={clearDepts}
            >
              clear filter
            </button>
          </div>
        </div>

        {/* ---------------- Search + Filters ---------------- */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6 m-5">
          {/* Search */}
          <input
            type="text"
            placeholder="Search name or student number..."
            className="input input-bordered w-full md:max-w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3">
            {/* Grade/Year-level filter */}
            <select
              className="select select-bordered"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="All">All Levels</option>

              {/* IS → Grades */}
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>

              {/* Others → Years */}
              <option value="Year 1">Year 1</option>
              <option value="Year 2">Year 2</option>
              <option value="Year 3">Year 3</option>
              <option value="Year 4">Year 4</option>
            </select>

            {/* Add Student */}
            <button
              className="btn btn-primary bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b]"
              onClick={() => setAddOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        {/* ---------------- Table ---------------- */}
        <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : (
            <table className="table table-zebra w-full">
              <thead className="bg-gray-100 text-gray-600">
                <tr className="text-center">
                  <th className="text-center">Student Number</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Year/Grade Level</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const levelLabel =
                      s.department === "IS"
                        ? `Grade ${s.year_level}`
                        : `Year ${s.year_level}`;

                    return (
                      <tr key={s._id} className="text-center">
                        <td className="text-center">{s.student_number}</td>

                        <td className="font-medium text-center">
                          {s.accounts_ref?.firstname} {s.accounts_ref?.lastname}
                        </td>

                        <td className="text-center">{levelLabel}</td>
                        <td className="text-center">{s.department}</td>

                        <td className="text-center">
                          <span className="badge badge-outline border-green-500 text-green-500">
                            Active
                          </span>
                        </td>

                        <td className="text-center">
                          <button className="btn btn-sm mr-2">
                            Record Grades
                          </button>

                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              navigate(
                                `/dashboard/admin/student-schedule/${s._id}`
                              )
                            }
                          >
                            View Schedule
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        <AddStudentModal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onAdded={() => {
            setAddOpen(false);
            fetchStudents(); 
          }}
        />
      </div>
    </div>
  );
}

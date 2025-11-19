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
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students");
      setStudents(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setErrMsg("Failed to load students");
      setLoading(false);
    }
  };

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
            <div className="text-center py-10 text-gray-500">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-4">Loading students...</p>
            </div>
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
                      <tr key={s._id} className="text-center hover:bg-gray-50">
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
                          <div className="flex gap-2 justify-center">
                            <button
                              className="btn btn-sm bg-[#5603AD] text-white border-[#5603AD] hover:bg-[#3e047b]"
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/record-grades/${s._id}`
                                )
                              }
                              title="Record student grades"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                              Record Grades
                            </button>

                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/student-schedule/${s._id}`
                                )
                              }
                              title="View student schedule"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                />
                              </svg>
                              View Schedule
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Student Modal */}
        <AddStudentModal
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onAdded={() => {
            setAddOpen(false);
            fetchStudents(); // refresh list
          }}
        />
      </div>
    </div>
  );
}
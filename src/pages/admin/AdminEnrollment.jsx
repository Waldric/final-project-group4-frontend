import { useEffect, useMemo, useState, useRef } from "react";
import Header from "../../components/Header";
import api from "../../api";
import { useModal } from "../../contexts/ModalContext";

const SORT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "code", label: "Code" },
  { value: "subject_name", label: "Subject" },
  { value: "department", label: "Department" },
  { value: "year_level", label: "Year Level" },
];

const DEPARTMENTS = ["IS", "CCS", "COE", "COS"];
const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M3 4h10v2H3V4zm0 4h7v2H3V8zm0 4h4v2H3v-2z" />
    <path d="M14 14l3-3 3 3h-2v4h-2v-4h-2z" />
  </svg>
);

export default function AdminEnrollment() {
  const { subMod, setSubMod, deleteSubj, setDeleteSubj } = useModal();

  const [subjects, setSubjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [filters, setFilters] = useState({
    dept: [], 
    sem: "all",
    search: "",
  });

  const [sort, setSort] = useState({ field: "all", order: "asc" });
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);


  useEffect(() => {
    api
      .get("/subjects")
      .then((res) => setSubjects(res.data.data || []))
      .catch(() => alert("Failed to load subjects"));
  }, [subMod.status, deleteSubj.status]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* FILTER + SORT */
  const filtered = useMemo(() => {
    let data = [...subjects];

    if (filters.dept.length) {
      data = data.filter((s) => filters.dept.includes(s.department));
    }

    if (filters.sem !== "all") {
      data = data.filter((s) => String(s.semester) === filters.sem);
    }

    if (filters.search.trim()) {
      const t = filters.search.toLowerCase();
      data = data.filter(
        (s) =>
          s.subject_name.toLowerCase().includes(t) ||
          s.code.toLowerCase().includes(t)
      );
    }

    if (sort.field !== "all") {
      data.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];

        return typeof aVal === "string"
          ? sort.order === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
          : sort.order === "asc"
          ? aVal - bVal
          : bVal - aVal;
      });
    }

    return data;
  }, [subjects, filters, sort]);

  /* Selection helpers */
  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = (checked) =>
    setSelectedIds(checked ? filtered.map((s) => s._id) : []);

  /* Modal openers */
  const openAddModal = () => {
    setSubMod({
      status: true,
      method: "Add",
      data: {
        _id: "",
        code: "",
        subject_name: "",
        units: 0,
        department: "",
        year_level: 0,
        semester: 0,
      },
    });
    document.getElementById("my_modal_1")?.showModal();
  };

  const openEditModal = () => {
    if (selectedIds.length !== 1) return;
    const s = subjects.find((item) => item._id === selectedIds[0]);

    setSubMod({ status: true, method: "Edit", data: { ...s } });
    document.getElementById("my_modal_1")?.showModal();
  };

  const openDeleteModal = () => {
    if (!selectedIds.length) return;

    setDeleteSubj({ status: true, subjList: selectedIds });
    document.getElementById("my_modal_1")?.showModal();
  };

  /*  Department toggle */
  const toggleDept = (dept) =>
    setFilters((p) => ({
      ...p,
      dept: p.dept.includes(dept)
        ? p.dept.filter((d) => d !== dept)
        : [...p.dept, dept],
    }));

  const clearDepts = () =>
    setFilters((p) => ({
      ...p,
      dept: [],
    }));

  return (
    <div className="flex-1 p-6">
      <Header
        location="Student Records"
        subheader="Manage student enrollments, course assignments, and academic details."
      />

      <div className="bg-white shadow-md rounded-2xl p-6 mt-4">

        {/* ---------------- Department Toggle Row ---------------- */}
        <div className="flex items-center justify-between mb-4">
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

        {/* ---------------- Search + Sort + Add ---------------- */}
        <div className="flex items-center justify-between mb-3">

          {/* Semester filter */}
          <select
            value={filters.sem}
            onChange={(e) =>
              setFilters({ ...filters, sem: e.target.value })
            }
            className="select select-sm select-bordered"
          >
            <option value="all">All Semesters</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
          </select>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Search */}
            <input
              type="text"
              className="input input-sm input-bordered"
              placeholder="Search code or name"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                className="btn btn-sm btn-outline flex items-center gap-1 w-50"
                onClick={() => setSortOpen((prev) => !prev)}
              >
                <SortIcon />
                {sort.field === "all"
                  ? "Sort: All"
                  : `Sort: ${
                      SORT_OPTIONS.find((o) => o.value === sort.field)?.label
                    } (${sort.order === "asc" ? "A–Z" : "Z–A"})`}
              </button>

              {sortOpen && (
                <ul className="absolute right-0 mt-2 z-50 menu p-2 shadow bg-white rounded-xl w-52">
                  {SORT_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        className="flex justify-between"
                        onClick={() => {
                          setSort((prev) => ({
                            field: opt.value,
                            order:
                              prev.field === opt.value && prev.order === "asc"
                                ? "desc"
                                : "asc",
                          }));
                          setSortOpen(false);
                        }}
                      >
                        {opt.label}
                        {sort.field === opt.value && (
                          <span>{sort.order === "asc" ? "A–Z" : "Z–A"}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Add Subject */}
            <button
              className="btn btn-warning btn-sm text-white"
              onClick={openAddModal}
            >
              + Add Subject
            </button>
          </div>
        </div>

        {/* ---------------- Tracking Bar ---------------- */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-300 px-4 py-2 rounded-xl mb-3 text-sm">
            <span className="text-blue-700">
              ℹ️ {selectedIds.length} subject(s) selected
            </span>

            <div className="flex gap-2">
              <button
                className="btn btn-sm btn-outline"
                disabled={selectedIds.length !== 1}
                onClick={openEditModal}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-error text-white"
                onClick={openDeleteModal}
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* ---------------- Table ---------------- */}
        <div className="overflow-x-auto">
          <table className="table table-zebra text-sm">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={
                      selectedIds.length === filtered.length &&
                      filtered.length > 0
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </th>
                <th>Code</th>
                <th>Subject</th>
                <th>Department</th>
                <th>Year</th>
                <th>Units</th>
                <th>Sem</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No subjects found
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedIds.includes(s._id)}
                        onChange={() => toggleSelect(s._id)}
                      />
                    </td>
                    <td>{s.code}</td>
                    <td>{s.subject_name}</td>
                    <td>{s.department}</td>
                    <td>{s.year_level}</td>
                    <td>{s.units}</td>
                    <td>{s.semester}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

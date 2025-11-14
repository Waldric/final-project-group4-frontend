import Header from "../../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";

const AdminEnrollment = () => {
  const headerLocation = "Student Records";
  const headerSubtext =
    "Manage student enrollments, course assignments, and academic details.";

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admins/subjects/all");
        setSubjects(res.data.data || []); // Adjust based on actual response structure
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load data. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-8 relative">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <Header location={headerLocation} subheader={headerSubtext} />

        <div className="dropdown dropdown-end mt-2">
          <label tabIndex={0} className="btn btn-outline btn-sm">
            Enrollment Details ▼
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a>Enrolled Students</a></li>
            <li><a>Course Capacity</a></li>
            <li><a>Instructor Assignments</a></li>
          </ul>
        </div>
      </div>

      {/* ===== Enrollment Management Card ===== */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mt-4">
        {/* Departments with clear filter */}
        <div className="flex gap-2 mb-6">
          <button className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6">
            COS
          </button>
          <button className="btn btn-sm bg-gray-200 text-gray-600 rounded-full px-6">
            CCS
          </button>
          <button className="btn btn-sm bg-gray-200 text-gray-600 rounded-full px-6">
            COE
          </button>
          <button className="btn btn-sm bg-gray-200 text-gray-600 rounded-full px-6">
            IS
          </button>
          <button className="btn btn-sm btn-outline text-gray-700 border-gray-400 rounded-full px-6">
            clear filter
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-4">
          {/* Left side filters */}
          <div className="flex gap-3">
            <select className="select select-bordered w-48 text-sm">
              <option>All Programs</option>
              <option>BS Computer Science</option>
              <option>BS Information Systems</option>
            </select>

            <select className="select select-bordered w-56 text-sm">
              <option>2025–2026 1st Semester</option>
              <option>2025–2026 2nd Semester</option>
            </select>
          </div>

          {/* Right side search + filter + add new entry */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg px-2">
              <input
                type="text"
                placeholder="Value"
                className="input input-sm border-none focus:outline-none w-28"
              />
              <button className="btn btn-ghost btn-sm text-gray-500 px-1">✕</button>
            </div>

            {/* Filter Button */}
            <button className="btn btn-sm bg-gray-200 hover:bg-gray-400 text-black flex items-center gap-1">
              <i className="fa fa-filter"></i> Filter
            </button>

            {/* Add new entry button */}
            <button className="btn btn-warning btn-sm font-semibold text-white ml-2">
              + Add New Entry
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        <div className="flex items-center justify-between border border-blue-300 rounded-xl bg-blue-50 px-4 py-2 mb-4 text-sm">
          {/* Left Section: selected courses message */}
          <div className="flex items-center gap-2 text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm1 4a1 1 0 10-2 0v3a1 1 0 102 0v-3z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              You have selected{" "}
              <span className="font-medium text-blue-700">{subjects.length}</span> courses.
            </span>
          </div>

          {/* Right Section: Action Buttons (edit & delete) */}
          <div className="flex gap-2">
            <button className="btn btn-sm btn-outline text-gray-700 hover:bg-gray-100 px-4">
              Edit
            </button>
            <button className="btn btn-sm bg-red-500 hover:bg-red-600 text-white px-4">
              Delete
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </th>
                <th>Course / Subject</th>
                <th>Program</th>
                <th>Section</th>
                <th>Year Level</th>
                <th>Capacity</th>
                <th>Instructor</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Loading courses...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : subjects.length > 0 ? (
                subjects.map((row, i) => (
                  <tr key={row._id || i}>
                    <td>
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </td>
                    <td>{row.subjectName || "N/A"}</td>
                    <td>{row.program || "N/A"}</td>
                    <td>{row.section || "N/A"}</td>
                    <td>{row.yearLevel || "N/A"}</td>
                    <td>{row.capacity || "N/A"}</td>
                    <td>{row.instructor || "N/A"}</td>
                    <td className="flex justify-center gap-2">
                      <button className="btn btn-outline btn-xs">
                        Record Grades
                      </button>
                      <button className="btn btn-outline btn-xs">
                        View Course
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnrollment;

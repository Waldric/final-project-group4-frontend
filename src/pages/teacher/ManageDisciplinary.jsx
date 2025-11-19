import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import api from "../../api";

import AddDisciplinaryModal from "../../components/AddDisciplinaryModal";
import EditDisciplinaryModal from "../../components/EditDisciplinaryModal";
import DeleteDisciplinaryModal from "../../components/DeleteDisciplinaryModal";

const ManageDisciplinary = () => {
  const headerLocation = "Disciplinary Records";
  const headerSubtext =
    "View recorded disciplinary incidents, actions taken, and current status.";

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Edit/Delete States
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecordId, setDeletingRecordId] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get("/disciplinary");
      setRecords(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // FILTER → THEN SORT THE FILTERED
  const processedRecords = useMemo(() => {
    const term = search.toLowerCase();

    let filtered = records.filter((r) => {
      return (
        r.violation?.toLowerCase().includes(term) ||
        r.remarks?.toLowerCase().includes(term) ||
        r.student_number?.toLowerCase().includes(term) ||
        r.teachers_id?.firstname?.toLowerCase().includes(term) ||
        r.teachers_id?.lastname?.toLowerCase().includes(term)
      );
    });

    filtered.sort((a, b) => {
      const da = new Date(a.date || 0);
      const db = new Date(b.date || 0);
      return sortOrder === "newest" ? db - da : da - db;
    });

    return filtered;
  }, [records, search, sortOrder]);

  // SEVERITY BADGE COLOR
  const getSeverityBadge = (severity) => {
    if (!severity) return "badge-ghost";
    if (severity <= 2) return "badge-success";
    if (severity <= 3) return "badge-warning";
    return "badge-error";
  };

  if (loading) {
    return (
      <div className="flex-1 p-10 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="alert alert-error shadow-lg">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px] flex flex-col">
        {/* Top Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* SEARCH */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search records..."
              className="input input-bordered rounded-full w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex items-center gap-3">
            {/* SORT DROPDOWN */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-outline rounded-full flex items-center gap-2"
              >
                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-white rounded-xl shadow-lg p-2 w-52 z-10"
              >
                <li>
                  <button
                    className={`hover:bg-gray-100 ${
                      sortOrder === "newest" ? "font-bold bg-gray-50" : ""
                    }`}
                    onClick={() => setSortOrder("newest")}
                  >
                    Newest First
                  </button>
                </li>
                <li>
                  <button
                    className={`hover:bg-gray-100 ${
                      sortOrder === "oldest" ? "font-bold bg-gray-50" : ""
                    }`}
                    onClick={() => setSortOrder("oldest")}
                  >
                    Oldest First
                  </button>
                </li>
              </ul>
            </div>

            {/* ADD */}
            <button
              className="btn bg-[#F7B801] hover:bg-[#d99a00] text-white rounded-full gap-2 border-none"
              onClick={() => document.getElementById("add_record_modal").showModal()}
            >
              <PlusIcon className="w-5 h-5" />
              Add Record
            </button>
          </div>
        </div>

        {/* Records */}
        <div className="grow overflow-x-auto">
          {processedRecords.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FunnelIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-700">No records found</p>
              <p className="text-gray-500 mt-2">
                {search ? "Try adjusting your search" : "No disciplinary records yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedRecords.map((r) => (
                <div
                  key={r._id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Date & Severity */}
                    <div className="lg:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(r.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="mt-2">
                        <span className={`badge badge-sm ${getSeverityBadge(r.severity)}`}>
                          Level {r.severity || "?"}
                        </span>
                      </div>
                    </div>

                    {/* Student Number */}
                    <div className="lg:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Student</p>
                      <p className="font-bold text-purple-700">{r.student_number}</p>
                    </div>

                    {/* Violation */}
                    <div className="lg:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Violation</p>
                      <p className="font-bold text-red-700">{r.violation}</p>
                    </div>

                    {/* Reported By */}
                    <div className="lg:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Reported By</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="avatar">
                          <div className="w-10 rounded-full ring ring-purple-600 ring-offset-2">
                            <img
                              src={r.teachers_id?.avatar || "/default-avatar.png"}
                              alt={`${r.teachers_id?.firstname || ""} ${r.teachers_id?.lastname || ""}`}
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {r.teachers_id?.firstname && r.teachers_id?.lastname
                              ? `${r.teachers_id.firstname} ${r.teachers_id.lastname}`
                              : "Unknown Teacher"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sanction */}
                    <div className="lg:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Sanction</p>
                      <p className="font-bold text-orange-700">{r.sanction}</p>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-2 flex justify-end items-start gap-2">
                      <button
                        className="btn btn-square btn-sm btn-ghost"
                        onClick={() => setEditingRecord(r)}
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-5 h-5 text-blue-600" />
                      </button>

                      <button
                        className="btn btn-square btn-sm btn-ghost"
                        onClick={() => setDeletingRecordId(r._id)}
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Remarks (Full Width) */}
                  {r.remarks && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Remarks
                      </p>
                      <p className="text-sm text-gray-700">{r.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddDisciplinaryModal onSuccess={fetchRecords} />
      <EditDisciplinaryModal
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onSuccess={fetchRecords}
      />
      <DeleteDisciplinaryModal
        id={deletingRecordId}
        onClose={() => setDeletingRecordId(null)}
        onSuccess={fetchRecords}
      />
    </div>
  );
};

export default ManageDisciplinary;
import { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
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

  /** ---------------------------------------------------------------
   *                 FILTER → THEN SORT THE FILTERED
   ----------------------------------------------------------------*/
  const processedRecords = useMemo(() => {
    const term = search.toLowerCase();

    let filtered = records.filter((r) => {
      return (
        r.violation?.toLowerCase().includes(term) ||
        r.remarks?.toLowerCase().includes(term) ||
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

  /** ---------------------------------------------------------------
   *                           UI STATES
   ----------------------------------------------------------------*/
  if (loading) {
    return (
      <div className="flex-1 p-10 flex justify-center items-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-10">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  /** ---------------------------------------------------------------
   *                       MAIN UI
   ----------------------------------------------------------------*/
  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-xl shadow-md border p-6">
        <h2 className="text-2xl font-semibold mb-5">Reported Records</h2>

        {/* ----------------------- Top Toolbar ----------------------- */}
        <div className="flex justify-between items-center mb-6">

          {/* SEARCH */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search records..."
              className="input input-bordered rounded-full w-full pl-10 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* SORT DROPDOWN */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-outline rounded-lg flex items-center gap-2 shadow-sm"
            >
              Sort by Date
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-xl shadow-lg p-2 w-52">
              <li>
                <button
                  className={`hover:bg-gray-100 ${sortOrder === "newest" ? "font-bold" : ""}`}
                  onClick={() => setSortOrder("newest")}
                >
                  Newest First
                </button>
              </li>
              <li>
                <button
                  className={`hover:bg-gray-100 ${sortOrder === "oldest" ? "font-bold" : ""}`}
                  onClick={() => setSortOrder("oldest")}
                >
                  Oldest First
                </button>
              </li>
            </ul>
          </div>

          {/* ADD */}
          <button
            className="btn bg-[#F7B801] hover:bg-[#d99a00] text-white rounded-lg gap-2 shadow-md"
            onClick={() => document.getElementById("add_record_modal").showModal()}
          >
            <PlusIcon className="w-5 h-5" />
            Add Record
          </button>
        </div>

        {/* ----------------------- Table Header ----------------------- */}
        <div className="grid grid-cols-12 py-3 border-b font-semibold text-gray-600 text-sm">
          <span className="col-span-2">Date</span>
          <span className="col-span-2">Violation</span>
          <span className="col-span-2">Reported By</span>
          <span className="col-span-2">Sanction</span>
          <span className="col-span-2">Remarks</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {/* ------------------------- ROWS ------------------------- */}
        <div className="divide-y">
          {processedRecords.length > 0 ? (
            processedRecords.map((r) => (
              <div
                key={r._id}
                className="grid grid-cols-12 py-4 items-center hover:bg-gray-50 transition duration-150"
              >
                <span className="col-span-2">
                  {new Date(r.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <span className="col-span-2">{r.violation}</span>

                {/* Teacher */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-7 h-7 rounded-full">
                      <img
                        src={r.teachers_id?.photo || "/default-avatar.png"}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {r.teachers_id?.firstname
                    ? `${r.teachers_id.firstname} ${r.teachers_id.lastname}`
                    : "Unknown Teacher"}
                </div>

                <span className="col-span-2">{r.sanction}</span>
                <span className="col-span-2">{r.remarks}</span>

                {/* ACTIONS */}
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setEditingRecord(r)}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>

                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setDeletingRecordId(r._id)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-gray-500">No matching records found.</div>
          )}
        </div>
      </div>

      {/* ------------------------- Modals ------------------------- */}
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

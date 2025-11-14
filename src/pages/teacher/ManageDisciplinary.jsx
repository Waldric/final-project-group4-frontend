import Header from "../../components/Header";
import AddDisciplinaryModal from "../../components/AddDisciplinaryModal";
import { useFetch } from "../../hooks/useFetch";
import api from "../../api";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

const ManageDisciplinary = () => {
  const headerLocation = "Disciplinary Records";
  const headerSubtext =
    "View and manage disciplinary incidents and sanctions.";

  const { data: records, loading } = useFetch("/disciplinary");

  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;

    try {
      await api.delete(`/disciplinary`, {
        data: { ids: [id] },
      });
      window.location.reload();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const filteredRecords = records
    ? records.filter((r) =>
        r.violation.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="flex justify-center py-24">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px]">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Reported Records
        </h2>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search violation..."
              className="input input-bordered w-full pl-10"
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline gap-2">
                <FunnelIcon className="w-4 h-4" />
                Sort by Date
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li><a>Newest First</a></li>
                <li><a>Oldest First</a></li>
              </ul>
            </div>

            <button
              className="btn bg-[#F7B801] text-white border-none gap-2"
              onClick={() => document.getElementById("add_record_modal").showModal()}
            >
              <PlusIcon className="w-5 h-5" />
              Add Record
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th>Date</th>
                <th>Violation</th>
                <th>Teacher</th>
                <th>Remarks</th>
                <th>Severity</th>
                <th>Sanction</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.violation}</td>

                    <td>
                      {record.teachers_id?.firstname
                        ? `${record.teachers_id.firstname} ${record.teachers_id.lastname}`
                        : "Unknown"}
                    </td>

                    <td>{record.remarks}</td>

                    <td>
                      <span
                        className={`badge ${
                          record.severity >= 3
                            ? "badge-error text-white"
                            : "badge-warning"
                        }`}
                      >
                        {record.severity}
                      </span>
                    </td>

                    <td>{record.sanction}</td>

                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-square btn-ghost btn-xs">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        <button
                          className="btn btn-square btn-ghost btn-xs text-red-500"
                          onClick={() => handleDelete(record._id)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No disciplinary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddDisciplinaryModal onSuccess={() => window.location.reload()} />
      </div>
    </div>
  );
};

export default ManageDisciplinary;

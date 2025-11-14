import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, FunnelIcon, ChevronDownIcon,} from "@heroicons/react/24/solid";
import api from "../../api";
import AddDisciplinaryModal from "../../components/AddDisciplinaryModal";

const ManageDisciplinary = () => {
  const headerLocation = "Disciplinary Records";
  const headerSubtext =
    "View your recorded disciplinary incidents, corresponding actions, and their current status.";

  // STATE MANAGEMENT
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRecords = async () => {
    try {
      const res = await api.get("/disciplinary");
      setRecords(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch disciplinary records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // DELETE RECORD
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await api.delete("/disciplinary", {
        data: { ids: [id] },
      });
      fetchRecords();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the record.");
    }
  };

  // FILTERING
  const filteredRecords = records.filter((record) => {
    const term = search.toLowerCase();
    return (
      record.violation?.toLowerCase().includes(term) ||
      record.remarks?.toLowerCase().includes(term) ||
      record.teachers_id?.firstname
        ?.toLowerCase()
        .includes(term)
    );
  });

  
  // RENDER
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
      {/* Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px] flex flex-col">
        
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reported Records</h2>

        {/* Toolbar */}
        <div className="flex justify-between items-center mb-4">

          {/* Search */}
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="Search record..."
              className="input input-bordered rounded-full w-full pl-10"
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* Sort + Add */}
          <div className="flex items-center gap-2">

            <button className="btn btn-ghost btn-circle">
              <FunnelIcon className="w-5 h-5 text-gray-700" />
            </button>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-outline border-gray-300 rounded-lg flex items-center gap-2 w-48">
                <span className="font-normal text-gray-600">Sort by Date</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48">
                <li><a>Newest First</a></li>
                <li><a>Oldest First</a></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-2 border-gray-200">
          <span className="col-span-2 text-sm text-gray-600">Date</span>
          <span className="col-span-2 text-sm text-gray-600">Violation</span>
          <span className="col-span-2 text-sm text-gray-600">Reported By</span>
          <span className="col-span-2 text-sm text-gray-600">Sanction</span>
          <span className="col-span-2 text-sm text-gray-600">Remarks</span>
          <span className="col-span-1 text-sm text-gray-600 text-right pr-2">Actions</span>
        </div>

        {/* Records List */}
        <div className="space-y-2">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div
                key={record._id}
                className="grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-gray-200 hover:bg-gray-50"
              >
                {/* Date */}
                <div className="col-span-2 text-sm text-gray-600">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>

                {/* Violation */}
                <div className="col-span-2 text-sm text-gray-600">
                  {record.violation}
                </div>

                {/* Reported By */}
                <div className="col-span-2 text-sm text-gray-600 flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-6 rounded-full">
                      <img
                        src={
                          record.teachers_id?.avatar ||
                          "/default-avatar.png"
                        }
                        alt="pfp"
                      />
                    </div>
                  </div>
                  <span>
                    {record.teachers_id
                      ? `${record.teachers_id.firstname} ${record.teachers_id.lastname}`
                      : "Unknown Teacher"}
                  </span>
                </div>

                {/* Sanction */}
                <div className="col-span-2 text-sm text-gray-600">
                  {record.sanction}
                </div>

                {/* Remarks */}
                <div className="col-span-2 text-sm text-gray-600">
                  {record.remarks}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end gap-1">
                  <button className="btn btn-ghost btn-xs">
                    <PencilSquareIcon className="w-5 h-5 text-gray-900" />
                  </button>

                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleDelete(record._id)}
                  >
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center col-span-12 py-12 text-gray-500">
              No disciplinary records found.
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="flex justify-end mt-6">
          <button
            className="btn bg-[#F7B801] hover:bg-[#e5aa00] text-white border-none gap-2 rounded-lg"
            onClick={() =>
              document.getElementById("add_record_modal").showModal()
            }
          >
            <PlusIcon className="w-5 h-5" />
            Add New Record
          </button>
        </div>

      </div>

      <AddDisciplinaryModal onSuccess={fetchRecords} />
    </div>
  );
};

export default ManageDisciplinary;

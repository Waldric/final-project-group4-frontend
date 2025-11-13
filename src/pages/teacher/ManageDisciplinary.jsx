import { useState } from "react";
import AddDisciplinaryModal from "../../components/AddDisciplinaryModal";
import Header from "../../components/Header";
import { useFetch } from "../../hooks/useFetch";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PencilSquareIcon, 
  TrashIcon 
} from "@heroicons/react/24/solid";
import api from "../../api";

const ManageDisciplinary = () => {
  const headerLocation = "Disciplinary Records";
  const headerSubtext = "View your recorded disciplinary incidents, corresponding actions, and their current status.";
  
  // This will return 404/500 until Waldric builds the route.
  const { data: records, loading, error } = useFetch("/disciplinary-records");

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/disciplinary-records/${id}`);
        // Ideally refresh data here, quick reload for now:
        window.location.reload();
      } catch (err) {
        alert("Failed to delete record");
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="flex justify-center py-24"><span className="loading loading-dots loading-lg"></span></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px]">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Reported Records</h2>

        {/* Toolbar: Search, Sort, Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          
          {/* Search Bar */}
          <div className="relative w-full md:max-w-md">
            <input 
              type="text" 
              placeholder="Search records..." 
              className="input input-bordered w-full pl-10" 
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline gap-2">
                <FunnelIcon className="w-4 h-4" />
                Sort by Date
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Newest First</a></li>
                <li><a>Oldest First</a></li>
              </ul>
            </div>

            {/* Add Button */}
            <button 
              className="btn bg-[#F7B801] hover:bg-[#e5aa00] text-white border-none gap-2"
              onClick={() => document.getElementById('add_record_modal').showModal()}
            >
              <PlusIcon className="w-5 h-5" />
              Add New Record
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Head */}
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th>Date</th>
                <th>Violation/Incident</th>
                <th>Reported By</th>
                <th>Description</th>
                <th>Sanction</th>
                <th>Status</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records && records.length > 0 ? (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="font-medium">{record.violation || "N/A"}</td>
                    <td>
                        {/* Access nested data if populated, otherwise fallback */}
                        {record.teacherId?.firstname 
                          ? `${record.teacherId.firstname} ${record.teacherId.lastname}` 
                          : "Teacher"}
                    </td>
                    <td className="max-w-xs truncate" title={record.description}>
                      {record.description || "No description"}
                    </td>
                    <td>{record.sanction || "Pending"}</td>
                    <td>
                      <span className={`badge ${record.status === 'Resolved' ? 'badge-success text-white' : 'badge-warning'}`}>
                        {record.status || "Open"}
                      </span>
                    </td>
                    <td>{record.remarks}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-square btn-ghost btn-xs text-gray-500">
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
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    No disciplinary records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        <AddDisciplinaryModal onSuccess={() => window.location.reload()} />
    </div>
  );
};

export default ManageDisciplinary;
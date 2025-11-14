import { useState } from "react";
import Header from "../../components/Header";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  TrashIcon,
  FunnelIcon, // This is the filter icon from your screenshot
  ChevronDownIcon 
} from "@heroicons/react/24/solid";
import api from "../../api";
import AddDisciplinaryModal from "../../components/AddDisciplinaryModal";

// --- MOCK DATA ---
const mockData = [
  {
    _id: "1",
    date: "2025-10-30T00:00:00.000Z",
    violation: "Attempt Murder",
    reportedBy: {
      name: "Jed Medina",
      avatar: "/waguri.jpg" // Sample avatar from public folder
    },
    description: "Trying to stab a student with a knife",
    sanction: "Death Penalty",
    status: "Resolved",
    remarks: "Tortured to death"
  }
];
// --- END MOCK DATA ---


const ManageDisciplinary = () => {
  const headerLocation = "Disciplinary Records";
  const headerSubtext = "View your recorded disciplinary incidents, corresponding actions, and their current status.";
  
  // Using mockData for now.
  const records = mockData;
  const loading = false;
  // When backend is ready, swap these lines:
  // const { data: records, loading, error } = useFetch("/disciplinary-records");
  
  const handleDelete = (id) => {
    alert(`Mock delete for ID: ${id}.`);
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px] flex flex-col">
        
        {/* Card Header */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Reported Records</h2>
        
        {/* --- Toolbar: Corrected Position & Styling --- */}
        <div className="flex justify-end items-center gap-2 mb-4">
          {/* Search Input */}
          <div className="relative w-2/5">
            <input 
              type="text" 
              placeholder="Search by Name" 
              className="input input-bordered rounded-full w-full pl-5 pr-10" 
            />
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle">
              <FunnelIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline border-gray-300 rounded-lg flex items-center gap-2 w-48">
                <span className="font-normal text-gray-600">Sort by Date</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
                <li><a>Newest First</a></li>
                <li><a>Oldest First</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Data List: Refactored to 12-Column Grid for Alignment --- */}
        <div className="flex-grow">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-2 border-gray-200">
            <span className="col-span-1 text-sm font-medium text-gray-600">Date</span>
            <span className="col-span-2 text-sm font-medium text-gray-600">Violation/Incident</span>
            <span className="col-span-2 text-sm font-medium text-gray-600">Reported By</span>
            <span className="col-span-2 text-sm font-medium text-gray-600">Description</span>
            <span className="col-span-1 text-sm font-medium text-gray-600">Sanction</span>
            <span className="col-span-1 text-sm font-medium text-gray-600">Status</span>
            <span className="col-span-2 text-sm font-medium text-gray-600">Remarks</span>
            <span className="col-span-1 text-sm font-medium text-gray-600 text-right pr-2">Actions</span>
          </div>

          {/* List Body */}
          <div className="space-y-2">
            {records && records.length > 0 ? (
              records.map((record) => (
                <div key={record._id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-gray-200 hover:bg-gray-50">
                  {/* Date */}
                  <div className="col-span-1 text-sm text-gray-600">
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
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
                        <img src={record.reportedBy.avatar} alt="avatar" />
                      </div>
                    </div>
                    <span>{record.reportedBy.name}</span>
                  </div>
                  {/* Description */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {record.description}
                  </div>
                  {/* Sanction */}
                  <div className="col-span-1 text-sm text-gray-600">
                    {record.sanction}
                  </div>
                  {/* Status */}
                  <div className="col-span-1 text-sm">
                    <span className="font-medium text-green-600">
                      {record.status}
                    </span>
                  </div>
                  {/* Remarks */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {record.remarks}
                  </div>
                  {/* Actions */}
                  <div className="col-span-1 text-right flex justify-end gap-2">
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
        </div>
        
        {/* Add New Record Button */}
        <div className="flex justify-end mt-6">
          <button 
            className="btn bg-[#F7B801] hover:bg-[#e5aa00] text-white border-none gap-2 rounded-lg"
            onClick={() => document.getElementById('add_record_modal').showModal()}
          >
            <PlusIcon className="w-5 h-5" />
            Add New Record
          </button>
        </div>
        
      </div> {/* End of bg-white container */}

      <AddDisciplinaryModal onSuccess={() => alert("Mock success!")} />
    </div>
  );
};

export default ManageDisciplinary;
// src/pages/student/MyDisciplinaryRecords.jsx
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ChevronDownIcon 
} from "@heroicons/react/24/solid";

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
    sanction: "Death Penalty",
    remarks: "Tortured to death"
  },
  {
    _id: "2",
    date: "2025-10-25T00:00:00.000Z",
    violation: "Academic Dishonesty",
    reportedBy: {
      name: "John Doe",
      avatar: "/mie-logo.png"
    },
    sanction: "Suspension",
    remarks: "Caught cheating on exam."
  }
];
// --- END MOCK DATA ---


const MyDisciplinaryRecords = () => {
  const headerLocation = "My Records";
  const headerSubtext = "View your recorded disciplinary incidents and their current status.";
  
  // --- INTERACTIVE STATE ---
  const [records, setRecords] = useState(mockData);
  const [filteredRecords, setFilteredRecords] = useState(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("Sort by Date");

  // Logic for the search bar
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = records.filter(record => 
      record.violation.toLowerCase().includes(lowerSearch) ||
      record.sanction.toLowerCase().includes(lowerSearch) ||
      record.remarks.toLowerCase().includes(lowerSearch)
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  // Logic for the sort dropdown
  const handleSortChange = (sortType) => {
    setSelectedSort(sortType);
    // You can add real sorting logic here later
    alert(`Sorting by ${sortType}`);
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px] flex flex-col">
        
        {/* Card Header */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Disciplinary Records</h2>
        
        {/* Toolbar (Interactive) */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <div className="relative w-2/5">
            <input 
              type="text" 
              placeholder="Search by keyword..." 
              className="input input-bordered rounded-full w-full pl-5 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-circle">
              <FunnelIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline border-gray-300 rounded-lg flex items-center gap-2 w-48">
                <span className="font-normal text-gray-600">{selectedSort}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-48">
                <li><a onClick={() => handleSortChange("Newest First")}>Newest First</a></li>
                <li><a onClick={() => handleSortChange("Oldest First")}>Oldest First</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Data List: --- */}
        <div className="grow">
          {/* List Header: 5 columns, balanced on a 12-col grid */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-2 border-gray-200">
            <span className="col-span-2 text-sm font-medium text-gray-900">Date</span>
            <span className="col-span-3 text-sm font-medium text-gray-900">Violation/Incident</span>
            <span className="col-span-2 text-sm font-medium text-gray-900">Reported By</span>
            <span className="col-span-2 text-sm font-medium text-gray-900">Sanction</span>
            <span className="col-span-3 text-sm font-medium text-gray-900">Remarks</span>
          </div>

          {/* List Body */}
          <div className="space-y-2">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <div key={record._id} className="grid grid-cols-12 gap-4 items-center px-4 py-4 border-b border-gray-200 hover:bg-gray-50">
                  <div className="col-span-2 text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="col-span-3 text-sm font-semibold text-gray-900">
                    {record.violation}
                  </div>
                  <div className="col-span-2 text-sm text-gray-900 flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-6 rounded-full">
                        <img src={record.reportedBy.avatar} alt="avatar" />
                      </div>
                    </div>
                    <span>{record.reportedBy.name}</span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-900">
                    {record.sanction}
                  </div>
                  <div className="col-span-3 text-sm text-gray-900">
                    {record.remarks}
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
      </div>
    </div>
  );
};

export default MyDisciplinaryRecords;
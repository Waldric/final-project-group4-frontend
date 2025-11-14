import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { 
  XMarkIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  FunnelIcon 
} from "@heroicons/react/24/solid";

// --- MOCK DATA ---
const mockGradeData = [
  {
    _id: "1",
    subject: { code: "IT401", courseTitle: "Web Development", units: 3, section: "C3A" },
    instructor: "John Doe",
    grade: "1.00",
  },
  {
    _id: "2",
    subject: { code: "CS101", courseTitle: "Artificial Intelligence", units: 3, section: "C3A" },
    instructor: "Jane Smith",
    grade: "1.25",
  },
  {
    _id: "3",
    subject: { code: "CS300", courseTitle: "Data Structures", units: 3, section: "C3A" },
    instructor: "Robert Brown",
    grade: "1.50",
  }
];
// --- END MOCK DATA ---

const MyGrades = () => {
  const headerLocation = "My Grades";
  const headerSubtext = "View your academic performance, subject grades, and overall GPA for the selected semester.";

  // --- STATE FOR INTERACTIVITY ---
  // Store the data
  const [grades, setGrades] = useState(mockGradeData);
  // Store the *filtered* data to be shown
  const [filteredGrades, setFilteredGrades] = useState(mockGradeData);
  
  // Store the state of the interactive controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("2025-2026 First Semester");
  const [selectedSort, setSelectedSort] = useState("Code A-Z");

  // --- LOGIC FOR INTERACTIVITY ---

  // runs whenever the user types in the search bar
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    
    const filtered = grades.filter(item => 
      item.subject.courseTitle.toLowerCase().includes(lowerSearch) ||
      item.subject.code.toLowerCase().includes(lowerSearch) ||
      item.instructor.toLowerCase().includes(lowerSearch)
    );
    setFilteredGrades(filtered);
  }, [searchTerm, grades]);

  // This function will be used by the dropdown
  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    console.log(`Semester changed to: ${semester}`);
    setSearchTerm(""); 
  };
  
  // This function will be used by the dropdown
  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    console.log(`Sort changed to: ${sort}`);
  };

  // This function runs when refresh is clicked
  const handleRefresh = () => {
    alert("Refreshing data! (This will fetch from the API when connected)");
    // This is where you would call the "refetch" function from useFetch
    // For now, we just reset the mock data.
    setGrades(mockGradeData);
    setSearchTerm("");
  };

  // --- DYNAMIC CALCULATIONS ---
  // Calculate footer values based on the *filtered* data
  const totalUnits = filteredGrades.reduce((acc, item) => acc + item.subject.units, 0);
  const totalGradePoints = filteredGrades.reduce((acc, item) => 
    acc + (parseFloat(item.grade) * item.subject.units), 0);
  
  // Prevent dividing by zero if list is empty
  const averageGpa = totalUnits > 0 ? (totalGradePoints / totalUnits).toFixed(2) : "0.00";

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* --- Main White Card --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[600px] flex flex-col">
        
        {/* --- Toolbar --- */}
        <div className="flex justify-between items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          
          {/* Left Side: Search */}
          <div className="flex-1">
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="Enter Course Name" 
                className="input input-bordered rounded-full w-full pl-5 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              {/* Show clear button only if there is text */}
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Center: Semester Filter & Refresh */}
          <div className="flex-none flex items-center justify-center gap-2">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-outline border-gray-300 rounded-lg flex items-center gap-2 w-64">
                {/* Text is now from state */}
                <span className="font-normal text-gray-700">{selectedSemester}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-64">
                <li><a onClick={() => handleSemesterChange("2025-2026 First Semester")}>2025-2026 First Semester</a></li>
                <li><a onClick={() => handleSemesterChange("2024-2025 Second Semester")}>2024-2025 Second Semester</a></li>
              </ul>
            </div>
            <button 
              className="btn btn-outline border-gray-300 btn-square"
              onClick={handleRefresh}
            >
              <ArrowPathIcon className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          {/* Right side controls */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <button 
              className="btn btn-outline border-gray-300 btn-square"
              onClick={() => alert("Filter button clicked!")}
            >
              <FunnelIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline border-gray-300 rounded-lg flex justify-between items-center w-48">
                {/* Text is now from state */}
                <span className="font-normal text-gray-600">{selectedSort}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-48">
                <li><a onClick={() => handleSortChange("Code A-Z")}>Code A-Z</a></li>
                <li><a onClick={() => handleSortChange("Code Z-A")}>Code Z-A</a></li>
                <li><a onClick={() => handleSortChange("Grade High-Low")}>Grade High-Low</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- Data List --- */}
        <div className="grow">
          {/* List Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-2 border-gray-200">
            <span className="col-span-1 text-sm font-medium text-gray-500">#</span>
            <span className="col-span-1 text-sm font-medium text-gray-500">Code</span>
            <span className="col-span-4 text-sm font-medium text-gray-500">Course Title</span>
            <span className="col-span-1 text-sm font-medium text-gray-500">Units</span>
            <span className="col-span-1 text-sm font-medium text-gray-500">Section</span>
            <span className="col-span-3 text-sm font-medium text-gray-500">Instructor</span>
            <span className="col-span-1 text-sm font-medium text-gray-500">Grade</span>
          </div>

          {/* List Body: Now maps over 'filteredGrades' */}
          <div className="divide-y divide-gray-100">
            {filteredGrades.length > 0 ? (
              filteredGrades.map((item, index) => (
                <div key={item._id} className={`grid grid-cols-12 gap-4 items-center px-4 py-4 ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <div className="col-span-1 text-sm text-gray-900">{index + 1}</div>
                  <div className="col-span-1 text-sm font-semibold text-gray-900">{item.subject.code}</div>
                  <div className="col-span-4 text-sm text-gray-900">{item.subject.courseTitle}</div>
                  <div className="col-span-1 text-sm text-gray-900">{item.subject.units}</div>
                  <div className="col-span-1 text-sm text-gray-900">{item.subject.section}</div>
                  <div className="col-span-3 text-sm text-gray-900">{item.instructor}</div>
                  <div className="col-span-1 text-sm font-semibold text-gray-900">{item.grade}</div>
                </div>
              ))
            ) : (
              // This message shows if the search finds no results
              <div className="text-center col-span-12 py-12 text-gray-500">
                No grades found{searchTerm && ` for "${searchTerm}"`}.
              </div>
            )}
          </div>
        </div>
        
        {/* --- Footer Summary: Now uses dynamic variables --- */}
        <div className="grid grid-cols-12 gap-4 px-4 pt-4 border-t-2 border-gray-200">
          
          <div className="col-start-3 col-span-4 text-right">
            <span className="text-sm text-gray-700">Total Units</span>
          </div>
          <div className="col-span-1">
            <p className="text-lg text-gray-900">{totalUnits}</p>
          </div>
          <div className="col-start-9 col-span-3 text-right">
            <span className="text-sm text-gray-700">Average (GPA)</span>
          </div>
          <div className="col-span-1">
            <p className="text-lg text-gray-900">{averageGpa}</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MyGrades;
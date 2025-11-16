import { useState } from "react";
import Header from "../Header";

const AssignedSubjectsView = ({ teacher, onViewStudents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const headerLocation = "My Classes";
  const headerSubtext = `View and manage your assigned classes, student 
                        lists, and academic records for the selected semester..`;

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort classes
  const getFilteredAndSortedClasses = () => {
    let filtered = teacher.subjects.filter((subject) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        subject.subject_id.code.toLowerCase().includes(searchLower) ||
        subject.subject_id.subject_name.toLowerCase().includes(searchLower) ||
        subject.day.toLowerCase().includes(searchLower) ||
        subject.room.toLowerCase().includes(searchLower)
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key.startsWith("subject_id.")) {
          const subKey = sortConfig.key.split(".")[1];
          aValue = a.subject_id[subKey];
          bValue = b.subject_id[subKey];
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="ml-1 text-gray-400">⇅</span>;
    }
    return (
      <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <h1 className="text-2xl m-5 font-medium">Assigned classes for this Academic Year</h1>
        <div className="flex justify-between">
          <div className="mb-4 mx-5 flex-3">
            <input
              type="text"
              placeholder="Search classes by code, subject, day, or room..."
              className="input input-bordered w-full max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <h1 className="font-bold m-5">S.Y. 2025 - 2026</h1>
          </div>
        </div>

        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table text-center">
            <thead>
              <tr className="bg-[#5603AD] text-gray-200">
                <th></th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("subject_id.code")}
                >
                  Code <SortIcon columnKey="subject_id.code" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("subject_id.subject_name")}
                >
                  Subject <SortIcon columnKey="subject_id.subject_name" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("subject_id.units")}
                >
                  Units <SortIcon columnKey="subject_id.units" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("day")}
                >
                  Day <SortIcon columnKey="day" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/200"
                  onClick={() => handleSort("time")}
                >
                  Time <SortIcon columnKey="time" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("room")}
                >
                  Room <SortIcon columnKey="room" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getFilteredAndSortedClasses().map((subject, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{subject.subject_id.code}</td>
                  <td>{subject.subject_id.subject_name}</td>
                  <td>{subject.subject_id.units}</td>
                  <td>{subject.day}</td>
                  <td>{subject.time}</td>
                  <td>{subject.room}</td>
                  <td>
                    <button
                      className="btn bg-[#F7B801]"
                      onClick={() =>
                        onViewStudents(
                          subject.subject_id._id,
                          subject.subject_id.code,
                        )
                      }
                    >
                      View Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {getFilteredAndSortedClasses().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No classes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedSubjectsView;

import { useState } from "react";
import Header from "../../components/Header";

const StudentsListView = ({
  students,
  loading,
  error,
  onBack,
  subjectCode,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort students
  const getFilteredAndSortedStudents = () => {
    let filtered = (students ?? []).filter((student) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        student.firstname.toLowerCase().includes(searchLower) ||
        student.lastname.toLowerCase().includes(searchLower) ||
        student.student_number.toLowerCase().includes(searchLower) ||
        student.course.toLowerCase().includes(searchLower) ||
        (student.phone && student.phone.toLowerCase().includes(searchLower))
      );
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "firstname") {
          aValue = `${a.firstname} ${a.lastname}`.toLowerCase();
          bValue = `${b.firstname} ${b.lastname}`.toLowerCase();
        }

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue ? bValue.toLowerCase() : "";
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

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header
        location={`Students in your ${subjectCode} class`}
        subheader="Manage or review the students enrolled in this class."
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <div className="flex justify-between">
          <button className="btn mb-4 btn-success" onClick={onBack}>
            Back to Classes View
          </button>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search students..."
              className="input input-bordered w-full max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error ? (
          <div className="flex flex-col h-64 justify-center items-center text-center">
            <span className="text-4xl font-bold text-red-600">{error}</span>
          </div>
        ) : (
          <table className="table text-center table-zebra">
            <thead>
              <tr className="bg-[#5603AD] text-gray-200">
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("firstname")}
                >
                  Student Name <SortIcon columnKey="firstname" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("student_number")}
                >
                  Student Number <SortIcon columnKey="student_number" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("course")}
                >
                  Course <SortIcon columnKey="course" />
                </th>
                <th
                  className="cursor-pointer hover:bg-black/20"
                  onClick={() => handleSort("phone")}
                >
                  Phone Number <SortIcon columnKey="phone" />
                </th>
              </tr>
            </thead>
            <tbody>
              {getFilteredAndSortedStudents().map((student) => (
                <tr key={student._id}>
                  <td className="text-left flex justify-center items-center">
                    <div className="mask mask-squircle h-8 w-8">
                      <img
                        src={student.photo}
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                    <span className="px-3">{student.firstname} {student.lastname}</span>
                  </td>
                  <td>{student.student_number}</td>
                  <td>{student.course}</td>
                  <td>{student.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!error && getFilteredAndSortedStudents().length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsListView;

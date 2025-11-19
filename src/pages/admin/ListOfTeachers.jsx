import { useState } from "react";

const ListOfTeachers = ({ teachers, departmentsList, onViewTeacher }) => {
  const [filterParams, setFilterParams] = useState({
    name: "",
    departments: [],
  });

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Handle department filter toggle
  const handleDepartmentToggle = (department) => {
    setFilterParams((prev) => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter((d) => d !== department)
        : [...prev.departments, department],
    }));
  };

  // Handle name search
  const handleNameSearch = (e) => {
    setFilterParams((prev) => ({
      ...prev,
      name: e.target.value,
    }));
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter teachers based on search and department
  const filteredTeachers = teachers.filter((teacher) => {
    // Filter by name (search in firstname, lastname, and teacher_uid)
    const nameMatch =
      !filterParams.name ||
      `${teacher.account_ref?.firstname} ${teacher.account_ref?.lastname}`
        .toLowerCase()
        .includes(filterParams.name.toLowerCase()) ||
      teacher.teacher_uid
        .toLowerCase()
        .includes(filterParams.name.toLowerCase()) ||
      teacher.account_ref?.email
        .toLowerCase()
        .includes(filterParams.name.toLowerCase());

    // Filter by departments
    const departmentMatch =
      filterParams.departments.length === 0 ||
      teacher.departments.some((dept) =>
        filterParams.departments.includes(dept)
      );

    return nameMatch && departmentMatch;
  });

  // Sort filtered teachers
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue, bValue;

    switch (sortConfig.key) {
      case "teacher_uid":
        aValue = a.teacher_uid;
        bValue = b.teacher_uid;
        break;
      case "name":
        aValue = `${a.account_ref?.firstname} ${a.account_ref?.lastname}`;
        bValue = `${b.account_ref?.firstname} ${b.account_ref?.lastname}`;
        break;
      case "departments":
        aValue = a.departments.join(", ");
        bValue = b.departments.join(", ");
        break;
      case "email":
        aValue = a.account_ref?.email;
        bValue = b.account_ref?.email;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 inline ml-1 opacity-30"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      );
    }

    return sortConfig.direction === "asc" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 inline ml-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-4 h-4 inline ml-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterParams({
      name: "",
      departments: [],
    });
    setSortConfig({
      key: null,
      direction: "asc",
    });
  };

  const hasActiveFilters =
    filterParams.name || filterParams.departments.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
      {/* Filter, Sort, Search, and Edit Buttons*/}
      <div className="[&>div]:m-5">
        {/* Filter by College Department Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Department Filters */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-2">
              Filter by Department
            </label>

            <div className="flex flex-wrap gap-2 bg-[#F5F5F5] rounded-4xl w-fit">
              {departmentsList.map((department, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn btn-sm rounded-full border-0 ${
                    filterParams.departments.includes(department)
                      ? "bg-[#5603AD] text-white hover:bg-[#450887]"
                      : "bg-[#F5F5F5] hover:bg-gray-100"
                  }`}
                  onClick={() => handleDepartmentToggle(department)}
                >
                  {department}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Clear */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Search
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered w-64"
                placeholder="Search name, ID, or email..."
                value={filterParams.name}
                onChange={handleNameSearch}
              />

              {hasActiveFilters && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600 mt-2">
          Showing {sortedTeachers.length} of {teachers.length} teacher
          {teachers.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Teacher Table */}
      <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table table-zebra text-center">
          <thead className="bg-[#F5F5F5]">
            <tr className="bg-[#5603AD] text-gray-200">
              <th
                className="cursor-pointer hover:bg-[#450887]"
                onClick={() => handleSort("teacher_uid")}
              >
                Teacher ID {getSortIcon("teacher_uid")}
              </th>
              <th
                className="cursor-pointer hover:bg-[#450887]"
                onClick={() => handleSort("name")}
              >
                Name {getSortIcon("name")}
              </th>
              <th
                className="cursor-pointer hover:bg-[#450887]"
                onClick={() => handleSort("departments")}
              >
                Departments {getSortIcon("departments")}
              </th>
              <th
                className="cursor-pointer hover:bg-[#450887]"
                onClick={() => handleSort("email")}
              >
                Email {getSortIcon("email")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedTeachers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  No teachers found matching your filters.
                </td>
              </tr>
            ) : (
              sortedTeachers.map((teacher) => (
                <tr key={teacher._id} value={teacher._id}>
                  <td>{teacher.teacher_uid}</td>
                  <td>
                    <div className="flex items-center justify-center gap-3">
                      <div className="mask mask-squircle h-8 w-8">
                        <img
                          src={teacher.account_ref.photo}
                          alt={`${teacher.account_ref?.firstname} ${teacher.account_ref?.lastname}`}
                          onError={(e) =>
                            (e.currentTarget.src = "/mie-logo.png")
                          }
                        />
                      </div>
                      <span>
                        {teacher?.account_ref?.firstname}{" "}
                        {teacher?.account_ref?.lastname}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex justify-center gap-1 flex-wrap">
                      {teacher?.departments.map((dept, idx) => (
                        <span
                          key={idx}
                          className="badge badge-sm bg-[#5603AD] text-white border-0"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{teacher?.account_ref?.email}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-[#F7B801] hover:bg-[#d9a001] border-0 text-white"
                      onClick={() =>
                        onViewTeacher(teacher._id, teacher.teacher_uid)
                      }
                    >
                      View Schedules
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListOfTeachers;

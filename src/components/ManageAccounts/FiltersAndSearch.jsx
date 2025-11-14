import { BarsArrowDownIcon } from "@heroicons/react/24/solid";

const FiltersAndSearch = ({
  filterDept,
  setFilterDept,
  setSortOption,
  setSearchTerm,
}) => {
  const departments = ["IS", "CCS", "COS", "COE", "System"];

  return (
    <div className="flex flex-wrap justify-between gap-2 mb-4">
      <div className="flex gap-2">
        <select
          className="select select-bordered"
          onChange={(e) => setFilterDept(e.target.value)}
          value={filterDept}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button className="btn" onClick={() => setSortOption("Account ID")}>
          <BarsArrowDownIcon className="w-5 h-5" />
          Sort by ID
        </button>
        <button className="btn" onClick={() => setSortOption("Name")}>
          <BarsArrowDownIcon className="w-5 h-5" />
          Sort by Name
        </button>
      </div>

      <div>
        <input
          type="text"
          className="input input-bordered"
          placeholder="Search by Name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FiltersAndSearch;
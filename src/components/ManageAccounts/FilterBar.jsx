import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

const FilterBar = ({
  filterType = [],
  setFilterType,
  editMode,
  setEditMode,
  deleteMode,
  setDeleteMode,
  setShowForm,
}) => {
  const userTypes = ["Student", "Teacher", "Admin"];

  // Handle multi-select logic
  const updateFilter = (e) => {
    const value = e.target.value;

    setFilterType((prev) => {
      // add if checked
      if (e.target.checked) return [...prev, value];

      // remove if unchecked
      return prev.filter((type) => type !== value);
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
        {userTypes.map((type) => (
          <label
            key={type}
            className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              filterType.includes(type)
                ? "bg-[#5603AD] text-white shadow-md"
                : "bg-transparent text-gray-700 hover:bg-gray-200"
            }`}
          >
            <input
              type="checkbox"
              value={type}
              className="hidden"
              checked={filterType.includes(type)}
              onChange={updateFilter}
            />
            {type}
          </label>
        ))}
      </div>

      {/* Add / Edit / Delete Buttons */}
      <div className="flex gap-2">
        {!editMode && !deleteMode && (
          <>
            <button className="btn bg-[#F7B801]" onClick={() => setShowForm(true)}>
              <PlusIcon className="w-5 h-5" />
              <span>Add Account</span>
            </button>

            <button className="btn bg-success" onClick={() => setEditMode(true)}>
              <PencilIcon className="w-5 h-5" />
              <span>Edit Accounts</span>
            </button>

            <button className="btn bg-error" onClick={() => setDeleteMode(true)}>
              <TrashIcon className="w-5 h-5" />
              <span>Delete Accounts</span>
            </button>
          </>
        )}

        {editMode && (
          <button className="btn" onClick={() => setEditMode(false)}>
            <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
            <span>Exit Edit</span>
          </button>
        )}

        {deleteMode && (
          <button className="btn" onClick={() => setDeleteMode(false)}>
            <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
            <span>Cancel Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
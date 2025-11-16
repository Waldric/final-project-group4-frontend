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
    <div className="flex flex-wrap justify-between mb-4 items-center [&>div]:m-5">
      {/* Multi-select Filter Checkboxes (Fixed size with small gaps) */}
      <form className="flex bg-[#F5F5F5] rounded-4xl p-1">
        {userTypes.map((type) => (
          <input
            key={type}
            type="checkbox"
            value={type}
            aria-label={type}
            className="btn w-16 h-10 rounded-4xl border-0 checked:bg-[#5603AD] checked:text-white"
            checked={filterType.includes(type)}
            onChange={updateFilter}
          />
        ))}
      </form>

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
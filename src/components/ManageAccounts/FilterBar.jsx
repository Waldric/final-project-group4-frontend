import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

const FilterBar = ({
  filterType,
  setFilterType,
  editMode,
  setEditMode,
  deleteMode,
  setDeleteMode,
  setShowForm,
}) => {
  const userTypes = ["Student", "Teacher", "Admin"];

  return (
    <div className="flex flex-wrap justify-between mb-4 items-center">
      {/* User Type Buttons */}
      <div className="flex gap-2">
        {userTypes.map((type) => (
          <button
            key={type}
            className={`btn rounded-full ${
              filterType === type ? "bg-[#5603AD] text-white" : "bg-[#F5F5F5]"
            }`}
            onClick={() => setFilterType(filterType === type ? "" : type)}
          >
            {type}
          </button>
        ))}
        <button
          className="btn rounded-full bg-[#5603AD] text-gray-200"
          onClick={() => setFilterType("")}
        >
          ×
        </button>
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
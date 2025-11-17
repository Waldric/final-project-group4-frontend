// src/components/ScheduleComponents/ScheduleSidebar.jsx
import React from "react";

export default function ScheduleSidebar({
  schedule,
  onAdd,
  onEdit,
  onDelete,
  onCreateNewSchedule,
  selectedIds = [],
}) {
  const canEdit = selectedIds.length === 1;
  const canDelete = selectedIds.length > 0;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sticky top-24">
      <h3 className="text-lg font-semibold text-[#5603AD] mb-2">
        Schedule Tools
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Manage student schedule efficiently.<br />
        Use the actions below to modify schedule items.
      </p>

      {/* Buttons */}
      <div className="flex flex-col gap-2">

        {/* Create new schedule */}
        <button
          onClick={onCreateNewSchedule}
          className="btn btn-primary btn-sm w-full"
        >
          + Create New Schedule
        </button>

        {/* Add subject */}
        <button
          onClick={onAdd}
          disabled={!schedule}
          className="btn btn-success btn-sm w-full disabled:opacity-50"
        >
          + Add Subject
        </button>

        {/* Edit subject */}
        <button
          onClick={canEdit ? onEdit : null}
          disabled={!canEdit}
          className="btn btn-warning btn-sm w-full disabled:opacity-50"
        >
          Edit Subject
        </button>

        {/* Delete subjects */}
        <button
          onClick={canDelete ? onDelete : null}
          disabled={!canDelete}
          className="btn btn-error btn-sm w-full disabled:opacity-50 text-white"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}

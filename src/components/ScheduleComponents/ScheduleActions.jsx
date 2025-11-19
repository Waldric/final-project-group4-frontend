export default function ScheduleActions({
  studentId,
  canEdit,
  canDelete,
  selected,
  schedule,
  navigate,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        {/* Add Subject */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() =>
            navigate(
              `/dashboard/admin/student-schedule/${studentId}?modal=add`
            )
          }
        >
          + Add Subject
        </button>

        {/* Edit */}
        <button
          className="btn btn-warning btn-sm"
          disabled={!canEdit}
          onClick={() =>
            navigate(
              `/dashboard/admin/student-schedule/${studentId}?modal=edit&course=${selected[0]}`
            )
          }
        >
          Edit
        </button>

        {/* Delete */}
        <button
          className="btn btn-error btn-sm"
          disabled={!canDelete}
          onClick={() =>
            navigate(
              `/dashboard/admin/student-schedule/${studentId}?modal=delete&list=${selected.join(
                ","
              )}`
            )
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}

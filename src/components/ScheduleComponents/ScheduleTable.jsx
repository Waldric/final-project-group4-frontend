// src/components/ScheduleComponents/ScheduleTable.jsx

export default function ScheduleTable({ schedule, selectedIds, toggleSelect, toggleSelectAll, onAssign }) {

  if (!schedule || !schedule.schedules) {
    return (
      <div className="text-center py-10 text-gray-500">
        No schedule found or still loading...
      </div>
    );
  }

  const allSelected = selectedIds.length === schedule.schedules.length;

  return (
    <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
      <table className="table table-zebra w-full text-sm">
        <thead className="bg-[#5603AD] text-white">
          <tr>
            <th>
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={allSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th>Subject</th>
            <th>Teacher</th>
            <th>Course Code</th>
            <th>Room</th>
            <th>Day</th>
            <th>Time</th>
            <th className="text-center">Assign</th>
          </tr>
        </thead>

        <tbody>
          {schedule.schedules.map((subj) => (
            <tr key={subj.course_code}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedIds.includes(subj.course_code)}
                  onChange={() => toggleSelect(subj.course_code)}
                />
              </td>

              <td>{subj.subject_ref?.subject_name || "N/A"}</td>
              <td>
                {subj.teacher_ref?.accounts_ref
                  ? `${subj.teacher_ref.accounts_ref.firstname} ${subj.teacher_ref.accounts_ref.lastname}`
                  : "Unassigned"}
              </td>
              <td>{subj.course_code}</td>
              <td>{subj.room}</td>
              <td>{subj.day}</td>
              <td>{subj.time}</td>

              <td className="text-center">
                <button
                  className="btn btn-xs btn-outline"
                  onClick={() => onAssign(subj)}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

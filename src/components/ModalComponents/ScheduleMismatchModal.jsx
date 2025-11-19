export default function ScheduleMismatchModal({
  isOpen,
  teacherSchedule,
  proposed,
  onOverrideTeacher,
  onUseTeacherSchedule,
  onCancel,
}) {
  if (!isOpen) return null;

  const teacherDay = teacherSchedule?.day || "—";
  const teacherTime = teacherSchedule?.time || "—";
  const teacherRoom = teacherSchedule?.room || "—";

  const proposedDay = proposed?.day || "—";
  const proposedTime = proposed?.time || "—";
  const proposedRoom = proposed?.room || "—";

  return (
    <dialog
      id="schedule_mismatch_modal"
      className={`modal ${isOpen ? "modal-open" : ""}`}
    >
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg text-[#b45309] flex items-center gap-2 mb-3">
          ⚠ Schedule Mismatch Detected
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          The changes you made to this student&apos;s schedule do not match the
          teacher&apos;s official schedule for this subject.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-3">
            <p className="font-semibold text-[#5603AD] mb-1">
              Teacher&apos;s Official
            </p>
            <p>
              <span className="font-medium">Day:</span> {teacherDay}
            </p>
            <p>
              <span className="font-medium">Time:</span> {teacherTime}
            </p>
            <p>
              <span className="font-medium">Room:</span> {teacherRoom}
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="font-semibold text-orange-700 mb-1">
              Your Edited Values
            </p>
            <p>
              <span className="font-medium">Day:</span> {proposedDay}
            </p>
            <p>
              <span className="font-medium">Time:</span> {proposedTime}
            </p>
            <p>
              <span className="font-medium">Room:</span> {proposedRoom}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Choose how you want to resolve this. Updating the teacher schedule
          will affect all students assigned to this teacher for this subject.
        </p>

        <div className="modal-action flex flex-col md:flex-row md:justify-between gap-2">
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <div className="flex flex-col md:flex-row gap-2">
            <button
              className="btn btn-outline btn-sm"
              type="button"
              onClick={onUseTeacherSchedule}
            >
              Use Teacher&apos;s Schedule
            </button>

            <button
              className="btn btn-warning btn-sm text-white"
              type="button"
              onClick={onOverrideTeacher}
            >
              Override Teacher Schedule
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

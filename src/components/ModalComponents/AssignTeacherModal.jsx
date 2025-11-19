import { useEffect, useMemo, useState } from "react";
import api from "../../api";

export default function AssignTeacherModal({
  isOpen,
  onClose,
  scheduleId,
  entry,
  currentSchedule,
  onAssigned,
}) {
  /* ------------------ HOOKS (must always run) ------------------ */
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const [autoDay, setAutoDay] = useState("");
  const [autoTime, setAutoTime] = useState("");
  const [autoRoom, setAutoRoom] = useState("");

  const [slotInfo, setSlotInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ------------------ FETCH TEACHERS ------------------ */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/teachers");
        setTeachers(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to load teachers:", err);
      }
    };

    if (isOpen) {
      fetchTeachers();
      setSelectedTeacher(entry?.teacher_ref?._id || "");
      setAutoDay("");
      setAutoTime("");
      setAutoRoom("");
      setSlotInfo(null);
    }
  }, [isOpen, entry]);

  /* ------------------ MEMOIZED FILTERING ------------------ */
  const relevantTeachers = useMemo(() => {
    if (!entry?.subject_ref?._id) return [];
    const subjectId = String(entry.subject_ref._id);

    return teachers.filter((t) =>
      (t.subjects || []).some((s) => String(s.subject_id) === subjectId)
    );
  }, [teachers, entry]);

  const hasRelevantTeachers = relevantTeachers.length > 0;

  /* ------------------ CONFLICT CHECK ------------------ */
  const hasStudentConflict = useMemo(() => {
    if (!currentSchedule?.schedules || !autoDay || !autoTime) return false;

    return currentSchedule.schedules.some(
      (s) =>
        s.course_code !== entry?.course_code &&
        s.day === autoDay &&
        s.time === autoTime
    );
  }, [currentSchedule, autoDay, autoTime, entry]);

  /* ------------------ AUTO-FILL WHEN TEACHER SELECTED ------------------ */
  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
    setAutoDay("");
    setAutoTime("");
    setAutoRoom("");
    setSlotInfo(null);

    const teacher = relevantTeachers.find((t) => t._id === teacherId);
    if (!teacher) return;

    const subjectId = String(entry?.subject_ref?._id);
    const matched = (teacher.subjects || []).find(
      (s) => String(s.subject_id) === subjectId
    );

    if (matched) {
      setAutoDay(matched.day);
      setAutoTime(matched.time);
      setAutoRoom(matched.room);

      const remaining = matched.slots - matched.num_students;
      setSlotInfo({
        slots: matched.slots,
        num_students: matched.num_students,
        remaining,
      });
    }
  };

  const isClassFull =
    slotInfo && typeof slotInfo.remaining === "number" && slotInfo.remaining <= 0;

  /* ------------------ SUBMIT HANDLER ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeacher) {
      alert("Please select a teacher.");
      return;
    }

    if (isClassFull) {
      if (!window.confirm("Class is full. Proceed anyway?")) return;
    }

    if (hasStudentConflict) {
      if (
        !window.confirm(
          `This time conflicts with another schedule (${autoDay} ${autoTime}). Continue?`
        )
      )
        return;
    }

    setLoading(true);
    try {
      // Assign teacher
      await api.patch(`/schedules/${scheduleId}/assign`, {
        course_code: entry.course_code,
        teacher_ref: selectedTeacher,
      });

      // Update schedule entry with auto-filled room/time/day
      await api.patch(`/schedules/${scheduleId}/update`, {
        course_code: entry.course_code,
        updates: {
          ...entry,
          teacher_ref: selectedTeacher,
          day: autoDay || entry.day,
          time: autoTime || entry.time,
          room: autoRoom || entry.room,
        },
      });

      alert("Teacher assigned successfully!");
      onAssigned();
    } catch (err) {
      console.error("Error assigning teacher:", err);
      alert("Failed to assign teacher.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ SAFE CONDITIONAL RENDER ------------------ */
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg text-[#5603AD]">Assign Teacher</h3>

        {!entry ? (
          <p className="text-center py-4 text-gray-500">
            No subject selected.
          </p>
        ) : (
          <>
            {/* Subject Info */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm mt-3 mb-3 border border-gray-300">
              <p>
                <strong>Subject:</strong> {entry.subject_ref?.subject_name}
              </p>
              <p>
                <strong>Course Code:</strong> {entry.course_code}
              </p>
            </div>

            {!hasRelevantTeachers ? (
              <div className="alert alert-warning">
                No teachers found for this subject.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Teacher Dropdown */}
                <div>
                  <label className="label-text font-semibold text-sm">
                    Teacher
                  </label>
                  <select
                    className="select select-bordered select-sm w-full"
                    value={selectedTeacher}
                    onChange={(e) => handleTeacherSelect(e.target.value)}
                  >
                    <option value="">Select teacher</option>
                    {relevantTeachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.account_ref.firstname} {t.account_ref.lastname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Auto-filled details */}
                {(autoDay || autoTime || autoRoom) && (
                  <div className="bg-purple-50 p-3 rounded-lg border text-sm">
                    <p className="font-semibold text-purple-800 mb-2">
                      Auto-filled schedule:
                    </p>
                    <p>
                      <strong>Day:</strong> {autoDay}
                    </p>
                    <p>
                      <strong>Time:</strong> {autoTime}
                    </p>
                    <p>
                      <strong>Room:</strong> {autoRoom}
                    </p>

                    {slotInfo && (
                      <p className="mt-2">
                        <strong>Slots:</strong>{" "}
                        {slotInfo.num_students}/{slotInfo.slots}{" "}
                        {isClassFull && (
                          <span className="text-red-600 font-semibold">
                            (Full)
                          </span>
                        )}
                      </p>
                    )}

                    {hasStudentConflict && (
                      <p className="text-red-600 text-xs mt-1">
                        ⚠ Student schedule conflict detected.
                      </p>
                    )}
                  </div>
                )}

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b] btn-sm text-white"
                    disabled={loading || !selectedTeacher}
                  >
                    {loading ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}

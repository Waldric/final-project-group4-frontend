import React, { useEffect, useState } from "react";
import api from "../../api";

export default function AddScheduleEntryModal({
  isOpen,
  onClose,
  scheduleId,
  student,
  semester,
  onAdded,
}) {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);

  // Load subjects from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        const all = res.data.data || res.data || [];

        // Optional filtering: same department + year_level + semester
        const filtered = all.filter((s) => {
          if (!student) return true;
          const sameDept = s.department === student.department;
          const sameYear = s.year_level === student.year_level;
          const sameSem = s.semester === semester;
          return sameDept && sameYear && sameSem;
        });

        setSubjects(filtered);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        alert("Failed to load subjects.");
      }
    };

    if (isOpen) {
      fetchSubjects();
      setSubjectId("");
      setCourseCode("");
      setDay("");
      setTime("");
      setRoom("");
    }
  }, [isOpen, student, semester]);

  if (!isOpen || !scheduleId) return null;

  const handleSubjectChange = (e) => {
    const id = e.target.value;
    setSubjectId(id);
    const subj = subjects.find((s) => s._id === id);
    setCourseCode(subj?.code || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId || !courseCode || !day || !time || !room) {
      alert("Please fill in all fields.");
      return;
    }

    if (!window.confirm("Add this subject to the schedule?")) return;

    setLoading(true);
    try {
      await api.post(`/schedules/${scheduleId}/add`, {
        subject_ref: subjectId,
        course_code: courseCode,
        day,
        time,
        room,
      });

      alert("Subject added successfully!");
      onAdded();
    } catch (err) {
      console.error("Add schedule entry error:", err);
      alert("Failed to add subject.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg text-[#5603AD] mb-3">
          Add Subject to Schedule
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label py-0">
              <span className="label-text text-sm font-semibold">
                Subject
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={subjectId}
              onChange={handleSubjectChange}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.code} — {s.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="label py-0">
                <span className="label-text text-sm font-semibold">
                  Course Code
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                value={courseCode}
                readOnly
              />
            </div>
            <div>
              <label className="label py-0">
                <span className="label-text text-sm font-semibold">
                  Day
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder="e.g. MWF"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </div>
            <div>
              <label className="label py-0">
                <span className="label-text text-sm font-semibold">
                  Time
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder="e.g. 8:00–9:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label py-0">
              <span className="label-text text-sm font-semibold">
                Room
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              placeholder="e.g. Room 201"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <div className="modal-action mt-4">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

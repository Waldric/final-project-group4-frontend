import { useEffect, useState } from "react";
import api from "../../api";
import ScheduleMismatchModal from "./ScheduleMismatchModal";

export default function EditScheduleEntryModal({
  isOpen,
  onClose,
  scheduleId,
  entry,
  onUpdated,
}) {
  const [form, setForm] = useState({
    day: "",
    time: "",
    room: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mismatchData, setMismatchData] = useState(null);

  const DAY_OPTIONS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  /* Load entry data */
  useEffect(() => {
    if (entry && isOpen) {
      setForm({
        day: entry.day || "",
        time: entry.time || "",
        room: entry.room || "",
      });
      setErrorMsg("");
      setMismatchData(null);
    }
  }, [entry, isOpen]);

  if (!isOpen || !entry) return null;

  /* Handle change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* API handler */
  const callUpdateApi = async (mode) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.patch(`/schedules/${scheduleId}/update`, {
        course_code: entry.course_code,
        updates: {
          ...entry,
          ...form,
        },
        mode,
      });

      const { status, message } = res.data || {};

      if (status === "mismatch") {
        setMismatchData({
          teacherSchedule: res.data.teacherSchedule,
          proposed: res.data.proposed,
        });
        return;
      }

      if (status === "conflict") {
        setErrorMsg(message || "Schedule conflict detected.");
        return;
      }

      if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Edit schedule error:", err);
      setErrorMsg("Failed to update schedule entry.");
    } finally {
      setLoading(false);
    }
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await callUpdateApi(undefined);
  };

  const handleClose = () => {
    setMismatchData(null);
    setErrorMsg("");
    onClose();
  };

  return (
    <>
      <dialog
        id="edit_schedule_entry_modal"
        className={`modal ${isOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg text-[#5603AD] mb-2">
            Edit Schedule Entry
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Course Code:{" "}
            <span className="font-semibold">{entry.course_code}</span>
          </p>

          {errorMsg && (
            <div className="alert alert-error mb-3 py-2 text-sm">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* DROPDOWN for days */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm font-medium">Day</span>
              </label>
              <select
                name="day"
                className="select select-bordered select-sm w-full"
                value={form.day}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a day
                </option>
                {DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* TIME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm font-medium">Time</span>
              </label>
              <input
                type="text"
                name="time"
                className="input input-bordered input-sm w-full"
                placeholder="e.g., 09:00–10:30"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>

            {/* ROOM */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm font-medium">Room</span>
              </label>
              <input
                type="text"
                name="room"
                className="input input-bordered input-sm w-full"
                placeholder="e.g., JRM304"
                value={form.room}
                onChange={handleChange}
                required
              />
            </div>

            {/* ACTIONS */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`btn btn-primary btn-sm bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b] ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Mismatch Modal */}
      {mismatchData && (
        <ScheduleMismatchModal
          isOpen={!!mismatchData}
          teacherSchedule={mismatchData.teacherSchedule}
          proposed={mismatchData.proposed}
          onOverrideTeacher={async () => {
            await callUpdateApi("overrideTeacher");
            setMismatchData(null);
          }}
          onUseTeacherSchedule={async () => {
            await callUpdateApi("useTeacher");
            setMismatchData(null);
          }}
          onCancel={() => setMismatchData(null)}
        />
      )}
    </>
  );
}

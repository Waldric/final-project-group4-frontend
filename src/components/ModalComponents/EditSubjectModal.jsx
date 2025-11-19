import { useState, useEffect } from "react";
import api from "../../api";

export default function EditSubjectModal({ isOpen, onClose, subject, scheduleId, refresh }) {
  const [form, setForm] = useState({
    course_code: "",
    day: "",
    time: "",
    room: "",
  });

  useEffect(() => {
    if (subject && isOpen) {
      setForm({
        course_code: subject.course_code,
        day: subject.day,
        time: subject.time,
        room: subject.room,
      });
    }
  }, [subject, isOpen]);

  const handleSubmit = async () => {
    try {
      await api.patch(`/schedules/${scheduleId}/edit-subject`, {
        course_code: form.course_code,
        updates: form,
      });

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update subject");
    }
  };

  if (!subject) return null;

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-96">
        <h3 className="font-bold text-lg mb-3">Edit Subject</h3>

        <p className="mb-2 text-sm text-gray-600">
          <strong>{subject.subject_ref?.subject_name}</strong> ({subject.course_code})
        </p>

        <label className="form-control mb-3">
          <span className="label-text">Day</span>
          <input
            type="text"
            className="input input-bordered"
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
          />
        </label>

        <label className="form-control mb-3">
          <span className="label-text">Time</span>
          <input
            type="text"
            className="input input-bordered"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </label>

        <label className="form-control mb-4">
          <span className="label-text">Room</span>
          <input
            type="text"
            className="input input-bordered"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
          />
        </label>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-warning" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </dialog>
  );
}

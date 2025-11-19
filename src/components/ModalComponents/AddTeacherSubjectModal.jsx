import { useState, useEffect } from "react";
import api from "../../api";

export default function AddTeacherSubjectModal({
  isOpen,
  onClose,
  teacherId,
  teacherData,
  onAdded,
}) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    subject_id: "",
    day: "",
    room: "",
    time: "",
    slots: 0,
  });

  // Fetch available subjects when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchSubjects = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await api.get("/subjects");

        // Filter subjects by teacher's departments
        const filteredSubjects = (res.data.data || []).filter((subject) =>
          teacherData.departments.includes(subject.department)
        );

        setSubjects(filteredSubjects);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        setErrorMsg("Failed to load subjects.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "slots" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      // Create the new subject entry
      const newSubject = {
        subject_id: formData.subject_id,
        day: formData.day,
        room: formData.room,
        time: formData.time,
        slots: formData.slots,
        num_students: 0, // Default value for new subject
      };

      // Copy all existing teacher data and append new subject to subjects array
      const updatedTeacherData = {
        ...teacherData,
        subjects: [...(teacherData.subjects || []), newSubject],
      };

      // Update the teacher record with the new subjects array
      await api.put(`/teachers/${teacherId}`, updatedTeacherData);

      // Reset form
      setFormData({
        subject_id: "",
        day: "",
        room: "",
        time: "",
        slots: 0,
      });

      onAdded();
    } catch (err) {
      console.error("Failed to add subject assignment:", err);
      setErrorMsg(
        err.response?.data?.error || "Failed to add subject assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      subject_id: "",
      day: "",
      room: "",
      time: "",
      slots: 0,
    });
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4 text-[#5603AD]">
          Add New Subject Assignment
        </h3>

        {errorMsg && (
          <div className="alert alert-error mb-4">
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Subject Selection */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Subject</span>
              </label>
              <select
                name="subject_id"
                className="select select-bordered w-full"
                value={formData.subject_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a subject
                </option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.code} - {subject.subject_name} ({subject.units}{" "}
                    units)
                  </option>
                ))}
              </select>
            </div>

            {/* Day */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Day</span>
              </label>
              <select
                name="day"
                className="select select-bordered w-full"
                value={formData.day}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select day
                </option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            {/* Room */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Room</span>
              </label>
              <input
                type="text"
                name="room"
                className="input input-bordered w-full"
                placeholder="e.g., Room 101, Lab 2"
                value={formData.room}
                onChange={handleChange}
                required
              />
            </div>

            {/* Time */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Time</span>
              </label>
              <input
                type="text"
                name="time"
                className="input input-bordered w-full"
                placeholder="(24 Hour Format, e.g. 7:00-17:00)"
                value={formData.time}
                onChange={handleChange}
                required
                pattern="^([01]?\d|2[0-3]):[0-5]\d-([01]?\d|2[0-3]):[0-5]\d$"
              />
            </div>

            {/* Slots */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Available Slots
                </span>
              </label>
              <input
                type="number"
                name="slots"
                className="input input-bordered w-full"
                placeholder="e.g., 30"
                min="0"
                value={formData.slots}
                onChange={handleChange}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-[#5603AD] hover:bg-[#450887] text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Add Assignment"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

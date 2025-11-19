import React, { useState, useEffect } from "react";
import api from "../../api";

export default function CreateScheduleModal({
  isOpen,
  onClose,
  student,
  currentAcadYear,
  currentSemester,
  onCreated,
}) {
  const [acadYear, setAcadYear] = useState(currentAcadYear || 1);
  const [semester, setSemester] = useState(currentSemester || 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAcadYear(currentAcadYear || 1);
    setSemester(currentSemester || 1);
  }, [currentAcadYear, currentSemester, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!student?._id) return;

    if (!window.confirm("Create a new schedule for this AY and Semester?"))
      return;

    setLoading(true);
    try {
      await api.post("/schedules", {
        student_ref: student._id,
        student_number: student.student_number,
        acad_year: acadYear,
        semester,
      });

      alert("Schedule created successfully!");
      onCreated(acadYear, semester);
    } catch (err) {
      console.error("Create schedule error:", err);
      alert("Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg text-[#5603AD] mb-3">
          Create New Schedule
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          This will create an empty schedule for:
        </p>
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
          <p>
            <span className="font-semibold">Student:</span>{" "}
            {student.accounts_ref?.firstname} {student.accounts_ref?.lastname}
          </p>
          <p>
            <span className="font-semibold">Student Number:</span>{" "}
            {student.student_number}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="label py-0">
              <span className="label-text text-sm font-semibold">
                Academic Year
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={acadYear}
              onChange={(e) => setAcadYear(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map((ay) => (
                <option key={ay} value={ay}>
                  Academic Year {ay}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label py-0">
              <span className="label-text text-sm font-semibold">
                Semester
              </span>
            </label>
            <select
              className="select select-bordered select-sm w-full"
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              <option value={1}>1st Semester</option>
              <option value={2}>2nd Semester</option>
            </select>
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
              className="btn btn-primary btn-sm bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b]"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Schedule"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

import { useState } from "react";
import api from "../../api";

export default function DeleteTeacherSubjectModal({
  isOpen,
  onClose,
  teacherId,
  teacherData,
  selectedSubjectIds,
  onDeleted,
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Get the subjects that will be deleted
  const subjectsToDelete = teacherData?.subjects?.filter((subj) =>
    selectedSubjectIds.includes(subj._id || subj.subject_id._id)
  ) || [];

  const handleDelete = async () => {
    setSubmitting(true);
    setErrorMsg("");

    try {
      // Filter out the selected subjects from the teacher's subjects array
      const updatedSubjects = teacherData.subjects.filter(
        (subj) => !selectedSubjectIds.includes(subj._id || subj.subject_id._id)
      );

      // Update teacher record with filtered subjects array
      const updatedTeacherData = {
        ...teacherData,
        subjects: updatedSubjects,
      };

      await api.put(`/teachers/${teacherId}`, updatedTeacherData);

      onDeleted();
    } catch (err) {
      console.error("Failed to delete subject assignment(s):", err);
      setErrorMsg(
        err.response?.data?.message || "Failed to delete subject assignment(s)."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4 text-red-600">
          Confirm Delete Subject Assignment{subjectsToDelete.length > 1 ? "s" : ""}
        </h3>

        {errorMsg && (
          <div className="alert alert-error mb-4">
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete the following subject assignment
            {subjectsToDelete.length > 1 ? "s" : ""}? This action cannot be undone.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="font-semibold text-sm text-gray-600 mb-2">
              Subject{subjectsToDelete.length > 1 ? "s" : ""} to be deleted:
            </p>
            <ul className="space-y-2">
              {subjectsToDelete.map((subj, index) => (
                <li
                  key={index}
                  className="bg-white p-3 rounded border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {subj.subject_id?.code} - {subj.subject_id?.subject_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {subj.day} • {subj.time} • {subj.room}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {subj.subject_id?.units} units
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Warning message if students are enrolled */}
        {subjectsToDelete.some((subj) => subj.num_students > 0) && (
          <div className="alert alert-warning mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Warning: Some of these subjects have enrolled students. Deleting will
              affect their schedules.
            </span>
          </div>
        )}

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
            type="button"
            className="btn btn-error text-white"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete {subjectsToDelete.length > 1 ? "All" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

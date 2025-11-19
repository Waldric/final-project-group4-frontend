import React, { useState } from "react";
import api from "../../api";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  scheduleId,
  courseCodes,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !scheduleId || !courseCodes?.length) return null;

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${courseCodes.length} subject(s) from this schedule?`
      )
    )
      return;

    setLoading(true);
    try {
      await api.delete(`/schedules/${scheduleId}/delete`, {
        data: { courseCodes },
      });

      alert("Selected subjects deleted successfully.");
      onDeleted();
    } catch (err) {
      console.error("Delete subjects error:", err);
      alert("Failed to delete selected subjects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg text-red-600 mb-2">Confirm Delete</h3>
        <p className="text-md text-gray-800 mb-3 font-semibold">
          You are about to remove{" "}
          <span className="font-semibold">{courseCodes.length}</span> subject(s)
          from this student's schedule.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          ❗This action cannot be undone. The subjects will be removed only from
          this student's schedule, not from the subject list.
        </p>

        <div className="modal-action">
          <button
            className="btn btn-ghost btn-sm border border-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error btn-sm text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

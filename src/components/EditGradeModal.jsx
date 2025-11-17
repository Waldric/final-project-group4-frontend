// src/components/EditGradeModal.jsx
import React from "react";
import { useForm } from "react-hook-form";
import api from "../api";

const EditGradeModal = ({ student, onSuccess, onClose }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      percent: student.percent || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        student_number: student.student_number,
        teacher_ref: student.teacherId, // assuming you have this
        subject_ref: student.subjectId,
        percent: Number(data.percent),
        graded_date: data.percent ? new Date().toISOString() : null,
      };

      // You'll need a proper endpoint — we'll create it next
      await api.put(`/grades/student/${student.student_number}/subject/${student.subjectId}`, payload);

      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save grade");
    }
  };

  return (
    <dialog id={`edit-grade-${student._id}`} className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Grade</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img src={student.photo} alt={student.firstname} />
            </div>
          </div>
          <div>
            <p className="font-semibold">{student.firstname} {student.lastname}</p>
            <p className="text-sm text-gray-500">{student.student_number}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Grade (0–100)</span>
            </label>
            <input
              {...register("percent", {
                required: "Grade is required",
                min: { value: 0, message: "Minimum is 0" },
                max: { value: 100, message: "Maximum is 100" },
                pattern: { value: /^\d*$/, message: "Numbers only" },
              })}
              type="number"
              placeholder="e.g. 91"
              className="input input-bordered w-full"
              autoFocus
            />
            {errors.percent && (
              <span className="text-error text-sm mt-1">{errors.percent.message}</span>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#5603AD] text-white hover:bg-[#450189]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                "Save Grade"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default EditGradeModal;
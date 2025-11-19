import { useForm } from "react-hook-form";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { XMarkIcon } from "@heroicons/react/24/solid";

const AddDisciplinaryModal = ({ onSuccess }) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // CLEAN EVERYTHING
      const student_number = data.student_number?.trim();
      const violation = data.violation?.trim();
      const sanction = data.sanction?.trim();
      const remarks = data.remarks?.trim() || "";
      const severityRaw = data.severity;

      // CRITICAL: Fix severity NaN
      const severity = Number(severityRaw);
      if (isNaN(severity) || severity < 1 || severity > 5) {
        alert("Please enter a valid severity (1-5)");
        return;
      }

      // FINAL VALIDATION (frontend side)
      if (!student_number || !violation || !sanction) {
        alert("Please fill all required fields");
        return;
      }

      const payload = {
        // Try different possible shapes of your saved user
        teachers_id:
          user?.account_ref?.id || // if you stored the Account inside user.account_ref
          user?.teacher?.id || // if you stored a Teacher object
          user?.id, // fallback to user._id
        student_number,
        violation,
        sanction,
        severity,
        remarks,
        date: new Date().toISOString(),
      };

      console.log("CREATE /disciplinary PAYLOAD:", payload);

      const response = await api.post("/disciplinary", payload);
      console.log("SUCCESS:", response.data);

      reset();
      document.getElementById("add_record_modal").close();
      onSuccess();
    } catch (err) {
      console.error("FULL ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save.");
    }
  };

  const handleClose = () => {
    reset();
    document.getElementById("add_record_modal").close();
  };

  return (
    <dialog id="add_record_modal" className="modal">
      <div className="modal-box max-w-xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Add New Disciplinary Record</h3>
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Student Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Student Number <span className="text-error">*</span>
              </span>
            </label>
            <input
              {...register("student_number", {
                required: "Student number is required",
              })}
              type="text"
              placeholder="e.g. 20231234"
              className={`input input-bordered rounded-lg ${
                errors.student_number ? "input-error" : ""
              }`}
            />
            {errors.student_number && (
              <span className="text-error text-sm mt-1">
                {errors.student_number.message}
              </span>
            )}
          </div>

          {/* Violation */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Violation <span className="text-error">*</span>
              </span>
            </label>
            <input
              {...register("violation", {
                required: "Violation description is required",
              })}
              type="text"
              placeholder="e.g. Late submission of requirements"
              className={`input input-bordered rounded-lg ${
                errors.violation ? "input-error" : ""
              }`}
            />
            {errors.violation && (
              <span className="text-error text-sm mt-1">
                {errors.violation.message}
              </span>
            )}
          </div>

          {/* Sanction */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Sanction <span className="text-error">*</span>
              </span>
            </label>
            <input
              {...register("sanction", {
                required: "Sanction is required",
              })}
              type="text"
              placeholder="e.g. Written warning"
              className={`input input-bordered rounded-lg ${
                errors.sanction ? "input-error" : ""
              }`}
            />
            {errors.sanction && (
              <span className="text-error text-sm mt-1">
                {errors.sanction.message}
              </span>
            )}
          </div>

          {/* Severity */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Severity Level <span className="text-error">*</span>
              </span>
            </label>
            <select
              {...register("severity", {
                required: "Severity is required",
              })}
              className={`select select-bordered rounded-lg ${
                errors.severity ? "select-error" : ""
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                Select severity level
              </option>
              <option value="1">Level 1 - Minor</option>
              <option value="2">Level 2 - Light</option>
              <option value="3">Level 3 - Moderate</option>
              <option value="4">Level 4 - Serious</option>
              <option value="5">Level 5 - Critical</option>
            </select>
            {errors.severity && (
              <span className="text-error text-sm mt-1">
                {errors.severity.message}
              </span>
            )}
          </div>

          {/* Remarks */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Remarks (Optional)</span>
            </label>
            <textarea
              {...register("remarks")}
              className="textarea textarea-bordered rounded-lg"
              placeholder="Additional notes..."
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              className="btn btn-ghost rounded-lg"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-[#F7B801] hover:bg-[#d99a00] text-white border-none rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Saving...
                </>
              ) : (
                "Save Record"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AddDisciplinaryModal;
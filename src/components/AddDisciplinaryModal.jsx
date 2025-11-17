import { useForm } from "react-hook-form";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

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
      teachers_id: user._id,
      student_number,
      violation,
      sanction,
      severity,  // ← NOW GUARANTEED NUMBER 1-5
      remarks,
      date: new Date().toISOString(),
    };

    console.log("SENDING PAYLOAD:", payload);  // ← CHECK THIS IN CONSOLE

    const response = await api.post("/disciplinary", payload);
    console.log("SUCCESS:", response.data);  // ← CHECK THIS TOO

    reset();
    document.getElementById("add_record_modal").close();
    onSuccess();
  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err);
    alert(err.response?.data?.message || "Failed to save.");
  }
};

  return (
    <dialog id="add_record_modal" className="modal">
      <div className="modal-box max-w-xl rounded-xl">
        <h3 className="font-bold text-xl mb-6">Add New Disciplinary Record</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Student Number */}
          <div className="form-control">
            <label className="label font-medium">
              <span className="label-text">Student Number</span>
            </label>
            <input
              {...register("student_number", { 
                required: "Student number is required" 
              })}
              type="text"
              placeholder="e.g. 20231234"
              className="input input-bordered"
            />
            {errors.student_number && (
              <span className="text-error text-sm mt-1">{errors.student_number.message}</span>
            )}
          </div>

          {/* Violation */}
          <div className="form-control">
            <label className="label font-medium">
              <span className="label-text">Violation</span>
            </label>
            <input
              {...register("violation", { 
                required: "Violation description is required" 
              })}
              type="text"
              placeholder="e.g. Late submission of requirements"
              className="input input-bordered"
            />
            {errors.violation && (
              <span className="text-error text-sm mt-1">{errors.violation.message}</span>
            )}
          </div>

          {/* Sanction */}
          <div className="form-control">
            <label className="label font-medium">
              <span className="label-text">Sanction</span>
            </label>
            <input
              {...register("sanction", { 
                required: "Sanction is required" 
              })}
              type="text"
              placeholder="e.g. Written warning"
              className="input input-bordered"
            />
            {errors.sanction && (
              <span className="text-error text-sm mt-1">{errors.sanction.message}</span>
            )}
          </div>

          {/* Severity */}
          <div className="form-control">
            <label className="label font-medium">
              <span className="label-text">Severity Level (1–5)</span>
            </label>
            <input
              {...register("severity", { 
                required: "Severity is required",
                min: { value: 1, message: "Minimum severity is 1" },
                max: { value: 5, message: "Maximum severity is 5" },
                valueAsNumber: true
              })}
              type="number"
              min="1"
              max="5"
              placeholder="3"
              className="input input-bordered"
            />
            {errors.severity && (
              <span className="text-error text-sm mt-1">{errors.severity.message}</span>
            )}
          </div>

          {/* Remarks */}
          <div className="form-control">
            <label className="label font-medium">
              <span className="label-text">Remarks (Optional)</span>
            </label>
            <textarea
              {...register("remarks")}
              className="textarea textarea-bordered"
              placeholder="Additional notes..."
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById("add_record_modal").close()}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn bg-[#F7B801] hover:bg-[#e0a800] text-white border-none"
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
    </dialog>
  );
};

export default AddDisciplinaryModal;
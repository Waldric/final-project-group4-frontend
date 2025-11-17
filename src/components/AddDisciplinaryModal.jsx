import { useForm } from "react-hook-form";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const AddDisciplinaryModal = ({ onSuccess }) => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        teachers_id: user._id,
        student_number: data.student_number,
        violation: data.violation,
        sanction: data.sanction,
        severity: data.severity,
        remarks: data.remarks,
        date: new Date().toISOString(),
      };

      await api.post("/disciplinary", payload);

      reset();
      document.getElementById("add_record_modal").close();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save record.");
      console.error(err);
    }
  };

  return (
    <dialog id="add_record_modal" className="modal">
      <div className="modal-box max-w-xl rounded-xl">
        <h3 className="font-bold text-xl mb-3">Add New Disciplinary Record</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Student Number */}
          <div className="form-control">
            <label className="label">Student Number</label>
            <input
              {...register("student_number", { required: true })}
              type="text"
              className="input input-bordered"
            />
            {errors.student_number && (
              <span className="text-error text-xs">Required</span>
            )}
          </div>

          {/* Violation */}
          <div className="form-control">
            <label className="label">Violation</label>
            <input
              {...register("violation", { required: true })}
              className="input input-bordered"
            />
          </div>

          {/* Sanction */}
          <div className="form-control">
            <label className="label">Sanction</label>
            <input {...register("sanction", { required: true })} className="input input-bordered" />
          </div>

          {/* Severity */}
          <div className="form-control">
            <label className="label">Severity (1–5)</label>
            <input
              {...register("severity", { required: true, min: 1, max: 5 })}
              type="number"
              className="input input-bordered"
            />
          </div>

          {/* Remarks */}
          <div className="form-control">
            <label className="label">Remarks (optional)</label>
            <textarea
              {...register("remarks")}
              className="textarea textarea-bordered"
              rows="3"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={() => document.getElementById("add_record_modal").close()}
            >
              Cancel
            </button>
            <button className="btn bg-[#F7B801] text-white border-none">
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default AddDisciplinaryModal;

import { useForm } from "react-hook-form";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

const AddDisciplinaryModal = ({ onSuccess }) => {
  const { user } = useAuth(); // logged-in teacher
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        teachers_id: user._id,           // from auth context
        student_number: data.student_number,
        violation: data.violation,
        sanction: data.sanction,
        severity: data.severity,
        remarks: data.remarks,
        date: new Date().toISOString(),
      };

      await api.post("/disciplinary", payload);

      document.getElementById("add_record_modal").close();
      reset();
      if (onSuccess) onSuccess();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to save record.");
      console.error(error);
    }
  };

  return (
    <dialog id="add_record_modal" className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add New Disciplinary Record</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Student Number + Violation */}
          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label"><span>Student Number</span></label>
              <input
                {...register("student_number", { required: true })}
                type="number"
                placeholder="e.g. 2025492291"
                className="input input-bordered"
              />
              {errors.student_number && <p className="text-error text-xs">Required.</p>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span>Violation</span></label>
              <input
                {...register("violation", { required: true })}
                type="text"
                placeholder="e.g. Wrong uniform"
                className="input input-bordered"
              />
            </div>
          </div>

          {/* Sanction + Severity */}
          <div className="flex gap-4">
            <div className="form-control w-full">
              <label className="label"><span>Sanction</span></label>
              <input
                {...register("sanction", { required: true })}
                type="text"
                placeholder="e.g. Misconduct recorded"
                className="input input-bordered"
              />
            </div>

            <div className="form-control w-full">
              <label className="label"><span>Severity (1–5)</span></label>
              <input
                {...register("severity", { required: true, min: 1, max: 5 })}
                type="number"
                className="input input-bordered"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="form-control">
            <label className="label"><span>Remarks</span></label>
            <input
              {...register("remarks")}
              type="text"
              placeholder="Remarks..."
              className="input input-bordered"
            />
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button type="button" className="btn" onClick={() => document.getElementById("add_record_modal").close()}>
              Cancel
            </button>
            <button type="submit" className="btn bg-[#F7B801] text-white border-none">
              Save Record
            </button>
          </div>

        </form>
      </div>
    </dialog>
  );
};

export default AddDisciplinaryModal;

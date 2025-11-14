
import { useForm } from "react-hook-form";
import api from "../api";

const AddDisciplinaryModal = ({ onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/disciplinary-records", {
        ...data,
        date: new Date().toISOString(), // Auto-set date
      });

      document.getElementById('add_record_modal').close();
      reset();
      if(onSuccess) onSuccess(); 

    } catch (error) {
      console.error("Failed to save record:", error);
      alert("Failed to save record. Check console for details.");
    }
  };

  return (
    <dialog id="add_record_modal" className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Add New Disciplinary Record</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Student Number */}
          <div className="form-control">
            <label className="label">Student Number</label>
            <input
              {...register("student_number", { required: true })}
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. 202542291"
            />
            {errors.student_number && <span className="text-error">Required</span>}
          </div>

          {/* Violation */}
          <div className="form-control">
            <label className="label">Violation</label>
            <input
              {...register("violation", { required: true })}
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Wrong Uniform"
            />
          </div>

          {/* Remarks */}
          <div className="form-control">
            <label className="label">Remarks</label>
            <input
              {...register("remarks")}
              type="text"
              className="input input-bordered w-full"
              placeholder="Notes about incident..."
            />
          </div>

          {/* Severity */}
          <div className="form-control">
            <label className="label">Severity (1–5)</label>
            <input
              {...register("severity", { required: true })}
              type="number"
              min="1"
              max="5"
              className="input input-bordered w-full"
            />
          </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Remarks</span></label>
            <input
                {...register("remarks")}
              type="text"
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={() => document.getElementById('add_record_modal').close()}>
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
>>>>>>> f29eeb8e66fcd441bfb93474c8b7d5789ec5364a

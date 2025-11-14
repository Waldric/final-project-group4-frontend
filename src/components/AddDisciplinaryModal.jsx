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
          
          {/* Row 1: Student & Violation */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Student ID</span></label>
              <input 
                {...register("studentId", { required: true })}
                type="text" 
                placeholder="e.g. 20234208" 
                className="input input-bordered w-full" 
              />
              {errors.studentId && <span className="text-error text-xs">Required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Violation/Incident</span></label>
              <input 
                {...register("violation", { required: true })}
                type="text" 
                placeholder="e.g. Academic Dishonesty" 
                className="input input-bordered w-full" 
              />
            </div>
          </div>

          {/* Row 2: Sanction & Remarks */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Sanction</span></label>
              <input 
                {...register("sanction")}
                type="text" 
                placeholder="e.g. Suspension" 
                className="input input-bordered w-full" 
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Remarks</span></label>
              <input 
                {...register("remarks")}
                type="text" 
                placeholder="Additional notes..." 
                className="input input-bordered w-full" 
              />
            </div>
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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import api from "../api";

const EditDisciplinaryModal = ({ record, onClose, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (record) reset(record);
  }, [record]);

  if (!record) return null;

  const onSubmit = async (data) => {
    try {
      await api.put(`/disciplinary/${record._id}`, data);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update record.");
      console.error(err);
    }
  };

  return (
    <dialog id="edit_record_modal" className="modal" open>
      <div className="modal-box max-w-xl rounded-xl">
        <h3 className="font-bold text-xl mb-3">Edit Disciplinary Record</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          <div className="form-control">
            <label className="label">Violation</label>
            <input {...register("violation")} className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label">Sanction</label>
            <input {...register("sanction")} className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label">Severity</label>
            <input {...register("severity")} type="number" className="input input-bordered" />
          </div>

          <div className="form-control">
            <label className="label">Remarks</label>
            <textarea {...register("remarks")} className="textarea textarea-bordered"></textarea>
          </div>

          <div className="modal-action">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn bg-[#F7B801] text-white border-none">Update</button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default EditDisciplinaryModal;

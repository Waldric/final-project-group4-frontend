import api from "../api";

const DeleteDisciplinaryModal = ({ id, onClose, onSuccess }) => {
  if (!id) return null;

  const handleDelete = async () => {
    try {
      await api.delete("/disciplinary", { data: { ids: [id] } });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to delete record.");
      console.error(err);
    }
  };

  return (
    <dialog id="delete_record_modal" className="modal" open>
      <div className="modal-box max-w-sm rounded-xl">
        <h3 className="font-bold text-xl mb-4 text-red-600">Delete Record?</h3>

        <p className="mb-4">This action cannot be undone.</p>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteDisciplinaryModal;

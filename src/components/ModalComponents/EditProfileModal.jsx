import { useState, useEffect } from "react";
import api from "../../api";

const EditProfileModal = ({ open, onClose, fields, title, onSave }) => {
  const [form, setForm] = useState({});

  // Populate form each time modal opens
  useEffect(() => {
    if (open && fields) setForm(fields);
  }, [open, fields]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await onSave(form); // let parent handle the saving
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
        
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(form).map((key) => (
            <Field
              key={key}
              label={key.replace(/_/g, " ").toUpperCase()}
              name={key}
              value={form[key]}
              onChange={handleChange}
            />
          ))}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn bg-[#5603AD] text-white" onClick={handleSubmit}>
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

const Field = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="input input-bordered w-full rounded-lg mt-1"
    />
  </div>
);

export default EditProfileModal;

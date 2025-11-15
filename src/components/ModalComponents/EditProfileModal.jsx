import { useState } from "react";
import api from "../../api";

const EditProfileModal = ({ open, onClose, student, account, onUpdated }) => {
  const [form, setForm] = useState({
    firstname: account.firstname || "",
    lastname: account.lastname || "",
    email: account.email || "",
    phone: student.phone || "",
    address: student.address || "",
    mother: student.mother || "",
    father: student.father || "",
    guardian_phone: student.guardian_phone || "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 1) Update account info
      await api.put(`/accounts/${account.id}`, {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
      });

      // 2) Update student info
      await api.put(`/students/${student._id}`, {
        phone: form.phone,
        address: form.address,
        mother: form.mother,
        father: form.father,
        guardian_phone: form.guardian_phone,
      });

      onUpdated(form); // send updated data back
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="First Name"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
          />
          <Field
            label="Last Name"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
          />
          <Field
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Field
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <Field
            label="Mother"
            name="mother"
            value={form.mother}
            onChange={handleChange}
          />
          <Field
            label="Father"
            name="father"
            value={form.father}
            onChange={handleChange}
          />
          <Field
            label="Guardian Phone"
            name="guardian_phone"
            value={form.guardian_phone}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn bg-purple-600 text-white" onClick={handleSave}>
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

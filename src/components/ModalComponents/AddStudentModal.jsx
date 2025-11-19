import { useState } from "react";
import api from "../../api";

export default function AddStudentModal({ isOpen, onClose, onAdded }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    student_number: "",
    department: "",
    year_level: "",
    course: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!isOpen) return null;

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generatePassword = () => {
    const rand = Math.random().toString(36).slice(-8);
    setForm({ ...form, password: rand });
  };

  const submit = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await api.post("/students/add", form);

      if (res.status === 201) {
        onAdded();
        onClose();
      }
    } catch (err) {
      setErr(err.response?.data?.message || "Error adding student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
  <div className="modal-box w-11/12 max-w-lg">
    <h3 className="font-bold text-xl mb-4">Add Student</h3>

    {err && <div className="alert alert-error mb-4">{err}</div>}

    <div className="flex flex-col gap-4">

    {/* Personal Info */}
      <p className="text-sm font-semibold text-gray-500">Personal Information</p>
      <div className="border-b border-gray-200"></div>

      <div className="grid grid-cols-2 gap-3">
        <input
          name="firstname"
          value={form.firstname}
          onChange={update}
          className="input input-bordered"
          placeholder="First Name"
        />
        <input
          name="lastname"
          value={form.lastname}
          onChange={update}
          className="input input-bordered"
          placeholder="Last Name"
        />
      </div>

      {/* Email */}
      <input
        name="email"
        value={form.email}
        onChange={update}
        className="input input-bordered w-116"
        placeholder="Email"
      />

      {/* Account Detalye */}
      <p className="text-sm font-semibold text-gray-500 mt-2">Account Details</p>
      <div className="border-b border-gray-200"></div>

      <div className="flex gap-2 w-100">
        <input
          name="password"
          value={form.password}
          onChange={update}
          className="input input-bordered flex-1"
          placeholder="Password"
        />
        <button className="btn btn-neutral min-w-[70px]" onClick={generatePassword}>
          Auto
        </button>
      </div>

      <input
        name="student_number"
        value={form.student_number}
        onChange={update}
        className="input input-bordered"
        placeholder="Student Number"
      />

   {/* Academic Info */}
      <p className="text-sm font-semibold text-gray-500 mt-2">Academic Information</p>
      <div className="border-b border-gray-200"></div>

      <select
        name="department"
        value={form.department}
        onChange={update}
        className="select select-bordered"
      >
        <option value="">Select Department</option>
        <option value="IS">IS</option>
        <option value="CCS">CCS</option>
        <option value="COE">COE</option>
        <option value="COS">COS</option>
      </select>

      <input
        name="year_level"
        value={form.year_level}
        onChange={update}
        className="input input-bordered"
        placeholder="Year / Grade Level"
      />

      <input
        name="course"
        value={form.course}
        onChange={update}
        className="input input-bordered"
        placeholder="Course"
      />
    </div>

    <div className="modal-action">
      <button className="btn" onClick={onClose}>
        Cancel
      </button>
      <button className="btn btn-primary bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b]" onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
</div>

  );
}

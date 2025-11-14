import { useState } from "react";

const AccountForm = ({ showForm, setShowForm, editMode, form, handleChange, handleSubmit }) => {
  const departments = ["IS", "CCS", "COS", "COE", "System"];
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // Handle changes to form fields with validations
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Email validation for create mode
    if (name === "email" && !editMode) {
      // Allow empty or partial inputs during typing
      const localPart = value.split("@")[0]; // Get part before any @ symbol
      handleChange({ target: { name: "email", value: localPart ? `${localPart}@mie.edu.ph` : "" } });
      return;
    }

    // System department validation
    if (name === "user_type" && value !== "Admin" && form.department === "System") {
      alert("Only Admin users can be assigned to the System department.");
      handleChange({ target: { name: "department", value: "" } });
    }

    handleChange(e);
  };

  // Validate email local part on blur or submission
  const validateEmailLocalPart = (localPart) => {
    if (localPart && /[\s<>]/.test(localPart)) {
      alert("Please enter a valid email local part (e.g., john.doe).");
      handleChange({ target: { name: "email", value: "" } });
    }
  };

  // Filter departments based on user_type
  const availableDepartments = form.user_type === "Admin"
    ? departments
    : departments.filter((d) => d !== "System");

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Account" : "Add Account"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="account_id"
                className="input input-bordered w-full"
                placeholder="Account ID"
                required
                value={form.account_id}
                onChange={handleChange}
              />

              <div className="relative">
                <input
                  type="text"
                  name="email"
                  className="input input-bordered w-full pr-24" // Add padding for suffix
                  placeholder={editMode ? "Email" : "john.doe"}
                  required
                  value={editMode ? form.email : form.email.replace("@mie.edu.ph", "")}
                  onChange={handleFieldChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={(e) => {
                    setIsEmailFocused(false);
                    if (!editMode) validateEmailLocalPart(e.target.value);
                  }}
                />
                {!editMode && !isEmailFocused && form.email && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    @mie.edu.ph
                  </span>
                )}
              </div>

              {!editMode && (
                <input
                  type="password"
                  name="password"
                  className="input input-bordered w-full"
                  placeholder="Password (min 8 chars)"
                  required
                  onChange={handleChange}
                />
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  name="firstname"
                  className="input input-bordered w-full"
                  placeholder="First Name"
                  required
                  value={form.firstname}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="lastname"
                  className="input input-bordered w-full"
                  placeholder="Last Name"
                  required
                  value={form.lastname}
                  onChange={handleChange}
                />
              </div>

              <select
                name="user_type"
                className="select select-bordered w-full"
                value={form.user_type}
                onChange={handleFieldChange}
              >
                <option>Student</option>
                <option>Teacher</option>
                <option>Admin</option>
              </select>

              <select
                name="department"
                className="select select-bordered w-full"
                value={form.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? "Save Changes" : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountForm;
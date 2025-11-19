import { useState, useEffect } from "react";

const AccountForm = ({
  showForm,
  setShowForm,
  editMode,
  form,
  handleChange,
  handleSubmit,
  resetForm
}) => {
  const departments = ["IS", "CCS", "COS", "COE"];

  const [isEmailFocused, setIsEmailFocused] = useState(false);

  // ================================
  // STUDENT: Get available courses
  // ================================
  const getAvailableCourses = () => {
    if (form.user_type !== "Student") return [];

    switch (form.department) {
      case "IS":
        return ["Integrated School"];
      case "CCS":
        return ["BS in Computer Science"];
      case "COE":
        return [
          "BS Mechanical Engineering",
          "BS Computer Engineering",
          "BS Civil Engineering",
          "BS Electrical Engineering",
        ];
      case "COS":
        return ["BS Chemistry", "BS Physics", "BS Environmental Science"];
      default:
        return [];
    }
  };

  const availableCourses = getAvailableCourses();

  // ================================
  // STUDENT: Year Levels
  // ================================
  const getYearLevels = () => {
    if (form.user_type === "Student" && form.department === "IS") {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }
    return [1, 2, 3, 4];
  };

  const yearLevels = getYearLevels();
  const isIS = form.user_type === "Student" && form.department === "IS";

  // Reset course when department changes
  useEffect(() => {
    if (form.user_type === "Student" && form.department) {
      const courses = getAvailableCourses();
      if (form.course && !courses.includes(form.course)) {
        handleChange({ target: { name: "course", value: "" } });
      }
    }
  }, [form.department]);

  // ================================
  // General Field Handler
  // ================================
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Auto-complete email for create mode
    if (name === "email" && !editMode) {
      const localPart = value.split("@")[0];
      handleChange({
        target: {
          name: "email",
          value: localPart ? `${localPart}@mie.edu.ph` : "",
        },
      });
      return;
    }

    // If switching away from Teacher, reset its department
    if (name === "user_type" && value !== "Teacher") {
      handleChange({
        target: { name: "teacher_department", value: "" },
      });
    }

    // Reset student course/year_level when department changes
    if (name === "department" && form.user_type === "Student") {
      handleChange({ target: { name: "course", value: "" } });
      handleChange({ target: { name: "year_level", value: 1 } });
    }

    handleChange(e);
  };

  // Email validation
  const validateEmailLocalPart = (localPart) => {
    if (localPart && /[\s<>]/.test(localPart)) {
      alert("Please enter a valid email local part (e.g., john.doe).");
      handleChange({
        target: { name: "email", value: "" },
      });
    }
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  // ================================
  // Final Submit Logic
  // ================================
  const handleFormSubmit = (e) => {
    e.preventDefault();

    let roleData = {};

    // ---------- STUDENT ----------
    if (form.user_type === "Student") {
      if (!form.department) return alert("Please select a department.");
      if (!form.course) return alert("Please select a course.");
      if (!editMode && !form.student_number)
        return alert("Please enter a student number.");

      roleData = {
        student_number: form.student_number,
        year_level: form.year_level || 1,
        course: form.course,
        birthday: form.birthday || null,
        address: form.address || "",
        phone: form.phone || "",
        mother: form.mother || "",
        father: form.father || "",
        guardian_phone: form.guardian_phone || "",
      };
    }

    // ---------- TEACHER ----------
    else if (form.user_type === "Teacher") {
      if (!form.teacher_department)
        return alert("Please select a department for the teacher.");

      if (!editMode && !form.teacher_uid)
        return alert("Please enter a teacher UID.");

      roleData = {
        teacher_uid: form.teacher_uid,
        departments: [form.teacher_department], // <--- ONLY ONE
      };
    }

    // ---------- ADMIN ----------
    else if (form.user_type === "Admin") {
      if (!form.department) return alert("Please select a department.");
      if (!editMode && !form.admin_id)
        return alert("Please enter an admin ID.");

      roleData = {
        admin_id: form.admin_id,
        admin_level: "department_admin",
      };
    }

    const submitData = { ...form, ...roleData };
    handleSubmit(e, submitData);
  };

  // ================================
  // RENDERING BELOW
  // ================================
  return (
    <>
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Account" : "Add Account"}
            </h3>

            <div className="space-y-3">
              {/* Account ID */}
              <input
                type="text"
                name="account_id"
                className="input input-bordered w-full"
                placeholder="Account ID"
                required
                value={form.account_id}
                onChange={handleChange}
              />

              {/* Email */}
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  className="input input-bordered w-full pr-24"
                  placeholder={editMode ? "Email" : "john.doe"}
                  required
                  value={
                    editMode ? form.email : form.email.replace("@mie.edu.ph", "")
                  }
                  onChange={handleFieldChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={(e) => {
                    setIsEmailFocused(false);
                    if (!editMode) validateEmailLocalPart(e.target.value);
                  }}
                />
                {!editMode && !isEmailFocused && form.email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    @mie.edu.ph
                  </span>
                )}
              </div>

              {/* Password (only create mode) */}
              {!editMode && (
                <input
                  type="password"
                  name="password"
                  className="input input-bordered w-full"
                  placeholder="Password (min 8 chars)"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                />
              )}

              {/* Names */}
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

              {/* User Type */}
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

              {/* ===================================================== */}
              {/* STUDENT FORM FIELDS */}
              {/* ===================================================== */}
              {form.user_type === "Student" && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-sm mb-2">
                      Student Information
                    </h4>
                  </div>

                  {/* Student Number */}
                  {!editMode && (
                    <input
                      type="text"
                      name="student_number"
                      className="input input-bordered w-full"
                      placeholder="Student Number *"
                      required
                      value={form.student_number || ""}
                      onChange={handleChange}
                    />
                  )}

                  {/* Department */}
                  <select
                    name="department"
                    className="select select-bordered w-full"
                    value={form.department}
                    onChange={handleFieldChange}
                    required
                  >
                    <option value="">Select Department *</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  {/* Course */}
                  {form.department && (
                    <select
                      name="course"
                      className="select select-bordered w-full"
                      value={form.course || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Course *</option>
                      {availableCourses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Year / Grade Level */}
                  {form.department && (
                    <select
                      name="year_level"
                      className="select select-bordered w-full"
                      value={form.year_level || 1}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select {isIS ? "Grade" : "Year"} Level *
                      </option>
                      {yearLevels.map((y) => (
                        <option key={y} value={y}>
                          {isIS ? `Grade ${y}` : `Year ${y}`}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Additional student info */}
                  <input
                    type="date"
                    name="birthday"
                    className="input input-bordered w-full"
                    value={form.birthday || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="address"
                    className="input input-bordered w-full"
                    placeholder="Address"
                    value={form.address || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    className="input input-bordered w-full"
                    placeholder="Phone Number"
                    value={form.phone || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="mother"
                    className="input input-bordered w-full"
                    placeholder="Mother's Name"
                    value={form.mother || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="father"
                    className="input input-bordered w-full"
                    placeholder="Father's Name"
                    value={form.father || ""}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="guardian_phone"
                    className="input input-bordered w-full"
                    placeholder="Guardian Phone Number"
                    value={form.guardian_phone || ""}
                    onChange={handleChange}
                  />
                </>
              )}

              {/* ===================================================== */}
              {/* TEACHER FIELDS */}
              {/* ===================================================== */}
              {form.user_type === "Teacher" && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-sm mb-2">
                      Teacher Information
                    </h4>
                  </div>

                  {/* Teacher UID */}
                  {!editMode && (
                    <input
                      type="text"
                      name="teacher_uid"
                      className="input input-bordered w-full"
                      placeholder="Teacher UID *"
                      required
                      value={form.teacher_uid || ""}
                      onChange={handleChange}
                    />
                  )}

                  {/* Single Department Select */}
                  <div className="border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-2">
                      Department * (Teacher)
                    </label>
                    <select
                      name="teacher_department"
                      className="select select-bordered w-full"
                      value={form.teacher_department || ""}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "teacher_department",
                            value: e.target.value,
                          },
                        })
                      }
                      required
                    >
                      <option value="">Select Department *</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* ===================================================== */}
              {/* ADMIN FIELDS */}
              {/* ===================================================== */}
              {form.user_type === "Admin" && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-sm mb-2">
                      Admin Information
                    </h4>
                  </div>

                  {!editMode && (
                    <input
                      type="text"
                      name="admin_id"
                      className="input input-bordered w-full"
                      placeholder="Admin ID *"
                      required
                      value={form.admin_id || ""}
                      onChange={handleChange}
                    />
                  )}

                  <select
                    name="department"
                    className="select select-bordered w-full"
                    value={form.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department *</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-gray-500">
                    Department admins manage their assigned department
                  </p>
                </>
              )}

              {/* ===================================================== */}
              {/* ACTION BUTTONS */}
              {/* ===================================================== */}
              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <button type="button" className="btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleFormSubmit}
                >
                  {editMode ? "Save Changes" : "Save Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountForm;

import { useState, useEffect } from "react";

const AccountForm = ({ showForm, setShowForm, editMode, form, handleChange, handleSubmit, resetForm }) => {
  const departments = ["IS", "CCS", "COS", "COE", "System"];
  const adminLevels = ["sys_admin", "department_admin"];
  
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [selectedTeacherDepts, setSelectedTeacherDepts] = useState([]);

  // Get available courses based on department
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
          "BS Electrical Engineering"
        ];
      case "COS":
        return [
          "BS Chemistry",
          "BS Physics",
          "BS Environmental Science"
        ];
      default:
        return [];
    }
  };

  const availableCourses = getAvailableCourses();

  // Get available year levels based on department
  const getYearLevels = () => {
    if (form.user_type === "Student" && form.department === "IS") {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // IS: Grade 1-12
    }
    return [1, 2, 3, 4]; // Other departments: Year 1-4
  };

  const yearLevels = getYearLevels();
  const isIS = form.user_type === "Student" && form.department === "IS";

  // Reset course when department changes
  useEffect(() => {
    if (form.user_type === "Student" && form.department) {
      const courses = getAvailableCourses();
      // If current course is not in available courses, reset it
      if (form.course && !courses.includes(form.course)) {
        handleChange({ target: { name: "course", value: "" } });
      }
    }
  }, [form.department]);

  // Handle changes to form fields with validations
  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Email validation for create mode
    if (name === "email" && !editMode) {
      const localPart = value.split("@")[0];
      handleChange({ target: { name: "email", value: localPart ? `${localPart}@mie.edu.ph` : "" } });
      return;
    }

    // System department validation
    if (name === "user_type") {
      if (value !== "Admin" && form.department === "System") {
        alert("Only Admin users can be assigned to the System department.");
        handleChange({ target: { name: "department", value: "" } });
      }
      // Reset teacher departments when changing user type
      if (value !== "Teacher") {
        setSelectedTeacherDepts([]);
      }
    }

    // Reset course and year level when department changes
    if (name === "department" && form.user_type === "Student") {
      handleChange({ target: { name: "course", value: "" } });
      handleChange({ target: { name: "year_level", value: 1 } });
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

  // Handle teacher department checkbox changes
  const handleTeacherDeptChange = (dept) => {
    setSelectedTeacherDepts(prev => {
      if (prev.includes(dept)) {
        return prev.filter(d => d !== dept);
      } else {
        return [...prev, dept];
      }
    });
  };

  // Filter departments based on user_type
  const availableDepartments = form.user_type === "Admin"
    ? departments
    : departments.filter((d) => d !== "System");

  const availableTeacherDepts = departments.filter(d => d !== "System");

  // Handle cancel with error handling
  const handleCancel = () => {
    try {
      resetForm();
      setShowForm(false);
      setSelectedTeacherDepts([]);
    } catch (error) {
      console.error("Error in handleCancel:", error);
    }
  };

  // Enhanced submit with role-specific data
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Build role-specific data
    let roleData = {};
    
    if (form.user_type === "Student") {
      if (!form.department) {
        alert("Please select a department for the student.");
        return;
      }
      if (!form.course) {
        alert("Please select a course for the student.");
        return;
      }
      roleData = {
        year_level: form.year_level || 1,
        course: form.course,
        birthday: form.birthday || null,
        address: form.address || "",
        phone: form.phone || "",
        mother: form.mother || "",
        father: form.father || "",
        guardian_phone: form.guardian_phone || "",
      };
    } else if (form.user_type === "Teacher") {
      if (selectedTeacherDepts.length === 0) {
        alert("Please select at least one department for the teacher.");
        return;
      }
      roleData = {
        teacher_departments: selectedTeacherDepts,
      };
    } else if (form.user_type === "Admin") {
      if (!form.department) {
        alert("Please select a department for the admin.");
        return;
      }
      roleData = {
        admin_level: form.admin_level || (form.department === "System" ? "sys_admin" : "department_admin"),
      };
    }

    // Combine form data with role-specific data
    const submitData = { ...form, ...roleData };
    handleSubmit(e, submitData);
  };

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

              {/* Password (only for create mode) */}
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

              {/* First and Last Name */}
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

              {/* ========== STUDENT SPECIFIC FIELDS ========== */}
              {form.user_type === "Student" && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-sm mb-2">Student Information</h4>
                  </div>

                  {/* Department */}
                  <div>
                    <select
                      name="department"
                      className="select select-bordered w-full"
                      value={form.department}
                      onChange={handleFieldChange}
                      required
                    >
                      <option value="">Select Department *</option>
                      {availableDepartments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course - Only show if department is selected */}
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
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  )}

                  {/* Year/Grade Level - Only show if department is selected */}
                  {form.department && (
                    <select
                      name="year_level"
                      className="select select-bordered w-full"
                      value={form.year_level || 1}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select {isIS ? "Grade" : "Year"} Level *</option>
                      {yearLevels.map((y) => (
                        <option key={y} value={y}>
                          {isIS ? `Grade ${y}` : `Year ${y}`}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Birthday */}
                  <input
                    type="date"
                    name="birthday"
                    className="input input-bordered w-full"
                    placeholder="Birthday"
                    value={form.birthday || ""}
                    onChange={handleChange}
                  />

                  {/* Address */}
                  <input
                    type="text"
                    name="address"
                    className="input input-bordered w-full"
                    placeholder="Address"
                    value={form.address || ""}
                    onChange={handleChange}
                  />

                  {/* Phone */}
                  <input
                    type="text"
                    name="phone"
                    className="input input-bordered w-full"
                    placeholder="Phone Number"
                    value={form.phone || ""}
                    onChange={handleChange}
                  />

                  {/* Mother's Name */}
                  <input
                    type="text"
                    name="mother"
                    className="input input-bordered w-full"
                    placeholder="Mother's Name"
                    value={form.mother || ""}
                    onChange={handleChange}
                  />

                  {/* Father's Name */}
                  <input
                    type="text"
                    name="father"
                    className="input input-bordered w-full"
                    placeholder="Father's Name"
                    value={form.father || ""}
                    onChange={handleChange}
                  />

                  {/* Guardian Phone */}
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

              {/* ========== TEACHER SPECIFIC FIELDS ========== */}
              {form.user_type === "Teacher" && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-sm mb-2">Teacher Information</h4>
                  </div>

                  {/* Multiple Department Selection */}
                  <div className="border rounded-lg p-3">
                    <label className="block text-sm font-medium mb-2">
                      Departments * (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTeacherDepts.map((dept) => (
                        <label key={dept} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedTeacherDepts.includes(dept)}
                            onChange={() => handleTeacherDeptChange(dept)}
                          />
                          <span className="text-sm">{dept}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ========== ADMIN SPECIFIC FIELDS ========== */}
              {form.user_type === "Admin" && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-sm mb-2">Admin Information</h4>
                  </div>

                  {/* Department */}
                  <div>
                    <select
                      name="department"
                      className="select select-bordered w-full"
                      value={form.department}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Department *</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Admin Level */}
                  <select
                    name="admin_level"
                    className="select select-bordered w-full"
                    value={form.admin_level || (form.department === "System" ? "sys_admin" : "department_admin")}
                    onChange={handleChange}
                  >
                    <option value="">Select Admin Level *</option>
                    {adminLevels.map((level) => (
                      <option key={level} value={level}>
                        {level === "sys_admin" ? "System Admin" : "Department Admin"}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    System admins have full access, Department admins manage their department
                  </p>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                <button type="button" className="btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleFormSubmit}>
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
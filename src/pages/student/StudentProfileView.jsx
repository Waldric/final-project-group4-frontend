import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import EditProfileModal from "../../components/ModalComponents/EditProfileModal.jsx";

const StudentProfileView = () => {
  const { user, setUser } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ---------- NEW STATES ----------
  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  const avatarSrc = (user && (user.photo || user.avatar)) || "/mie-logo.png";

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMsg("No logged-in user found. Please sign in again.");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/byAccount/${user.id}`);
        const payload = res.data?.data || res.data;
        setStudent(payload);
      } catch (err) {
        console.error("Error loading student:", err);
        setErrorMsg("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [user]);

  const headerLocation = "My Profile";
  const headerSubtext =
    "View and update your personal, academic, and account details.";

  const formatBirthday = (date) =>
    date ? new Date(date).toLocaleDateString("en-US") : "N/A";

  // ---------- NEW: OPEN MODAL ----------
  const openEditModal = (fields, title) => {
    setModalFields(fields);
    setModalTitle(title);
    setShowModal(true);
  };

  // ---------- NEW: HANDLE SAVE ----------
  const handleSave = async (updatedFields) => {
    try {
      // Update account fields if needed
      if (updatedFields.firstname || updatedFields.email) {
        await api.put(`/accounts/${user.id}`, updatedFields);

        const updatedUser = { ...user, ...updatedFields };
        setUser(updatedUser);
        sessionStorage.setItem("mie_user", JSON.stringify(updatedUser));
      }

      // Update student fields
      await api.put(`/students/${student._id}`, updatedFields);

      setStudent({ ...student, ...updatedFields });
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  // -------------------- RENDER STATES --------------------

  if (loading) {
    return <p className="p-4 text-gray-600">Loading profile...</p>;
  }

  if (errorMsg && !student) {
    return <div className="p-4 text-red-500">{errorMsg}</div>;
  }

  if (!student) {
    return (
      <div className="p-4 text-red-500">
        No student profile found for this account.
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* LEFT COLUMN */}
        <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 text-center lg:h-80.5 flex flex-col justify-center items-center">
          <img
            src={avatarSrc}
            alt="Profile"
            onError={(e) => {
              e.currentTarget.onerror = null; 
              e.currentTarget.src = "/mie-logo.png"; 
            }}
            className="w-20 h-20 rounded-full mb-4 object-cover mx-auto border border-gray-500"
          />

          <h2 className="font-semibold text-lg">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-500 text-sm">Student</p>
          <p className="text-sm mt-1">
            <span className="font-medium">ID:</span> {student.student_number}
          </p>

          <div className="mt-4 text-sm space-y-3">
            <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
              <span className="font-medium text-gray-700">Program:</span>
              <span className="text-gray-600 wrap-break-words">
                {student.course}
              </span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
              <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-600 wrap-break-words">
                {student.department}
              </span>
            </div>
            <div className="grid grid-cols-[106px_1fr] gap-3 items-start">
              <span className="font-medium text-gray-700">Year Level:</span>
              <span className="text-gray-600 wrap-break-words">
                {" "}
                {student.department === "IS"
                  ? `Grade ${student.year_level}`
                  : {
                      1: "1st Year",
                      2: "2nd Year",
                      3: "3rd Year",
                      4: "4th Year",
                    }[student.year_level] || `Year ${student.year_level}`}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* PERSONAL DETAILS */}
          <Card
            title="Personal Details"
            onEdit={() =>
              openEditModal(
                {
                  firstname: user.firstname,
                  lastname: user.lastname,
                  phone: student.phone,
                  address: student.address,
                  mother: student.mother,
                  father: student.father,
                  guardian_phone: student.guardian_phone,
                },
                "Edit Personal Details"
              )
            }
          >
            <Grid>
              <Input
                label="Full Name"
                value={`${user.firstname} ${user.lastname}`}
              />
              <Input
                label="Birthdate"
                value={formatBirthday(student.birthday)}
              />
              <Input label="Phone Number" value={student.phone} />
              <Input label="Address" value={student.address} />
              <Input label="Mother" value={student.mother} />
              <Input label="Father" value={student.father} />
              <Input label="Guardian Contact" value={student.guardian_phone} />
            </Grid>
          </Card>

          {/* ACADEMIC INFO */}
          <Card title="Academic Information">
            <Grid>
              <Input label="Department" value={student.department} />
              <Input label="Course" value={student.course} />
              <Input
                label="Year Level"
                value={
                  student.department === "IS"
                    ? `Grade ${student.year_level}`
                    : {
                        1: "1st Year",
                        2: "2nd Year",
                        3: "3rd Year",
                        4: "4th Year",
                      }[student.year_level] || `Year ${student.year_level}`
                }
              />
              <Input label="Student Number" value={student.student_number} />
            </Grid>
          </Card>

          {/* ACCOUNT INFO */}
          <Card title="Account Information">
            <Grid>
              <Input label="Account ID" value={user.id} />
              <Input label="Email" value={user.email} />
              <Input label="Department" value={user.department || "N/A"} />
              <Input label="User Type" value={user.user_type || "Student"} />
              <Input
                label="Account Date Created"
                value={
                  student.accounts_ref?.date_created
                    ? new Date(
                        student.accounts_ref.date_created
                      ).toLocaleString()
                    : "N/A"
                }
              />
            </Grid>
          </Card>
        </div>
      </div>

      {/* -------------------- EDIT MODAL -------------------- */}
      <EditProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        fields={modalFields}
        title={modalTitle}
        onSave={handleSave}
      />
    </div>
  );
};

// -------------------- REUSABLE COMPONENTS --------------------

const Card = ({ title, children, onEdit }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      {onEdit && (
        <button
          className="btn btn-sm bg-[#5603AD] hover:bg-purple-700 text-white rounded-lg"
          onClick={onEdit}
        >
          Edit Details
        </button>
      )}
    </div>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {children}
  </div>
);

const Input = ({ label, value }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-gray-600 text-sm">{label}</span>
    </label>
    <input
      disabled
      value={value ?? "N/A"}
      className="input input-bordered w-full rounded-lg bg-gray-50"
    />
  </div>
);

export default StudentProfileView;

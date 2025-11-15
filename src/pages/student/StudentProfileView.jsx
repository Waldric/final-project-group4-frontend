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

  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!user || !user.id) {
      setErrorMsg("No logged-in user found. Please sign in again.");
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/byAccount/${user.id}`);
        console.log("Student API response:", res.data);

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
        <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 text-center lg:h-81">
          <img
            src="/waguri.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover mx-auto"
          />

          <h2 className="font-semibold text-lg">
            {user.firstname} {user.lastname}
          </h2>
          <p className="text-gray-500 text-sm">Student</p>

          <p className="text-sm mt-2">
            <span className="font-medium">ID:</span> {student.student_number}
          </p>

          <div className="mt-4 text-sm space-y-1">
            <p>
              <span className="font-medium">Program:</span> {student.course}
            </p>
            <p>
              <span className="font-medium">Department:</span>{" "}
              {student.department}
            </p>
            <p>
              <span className="font-medium">Year Level:</span>{" "}
              {student.year_level}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* PERSONAL DETAILS */}
          <Card title="Personal Details" onEdit={() => setShowEdit(true)}>
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
          <Card title="Academic Information" onEdit={() => setShowEdit(true)}>
            <Grid>
              <Input label="Department" value={student.department} />
              <Input label="Course" value={student.course} />
              <Input label="Year Level" value={student.year_level} />
              <Input label="Student Number" value={student.student_number} />
            </Grid>
          </Card>

          {/* ACCOUNT INFO */}
          <Card title="Account Information" onEdit={() => setShowEdit(true)}>
            <Grid>
              <Input label="Account ID" value={user.id} />
              <Input label="Email" value={user.email} />
              <Input label="Department" value={user.department || "N/A"} />
              <Input label="User Type" value={user.user_type || "Student"} />
            </Grid>
          </Card>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfileModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        student={student}
        account={user}
        onUpdated={(updated) => {
          setStudent({
            ...student,
            phone: updated.phone,
            address: updated.address,
            mother: updated.mother,
            father: updated.father,
            guardian_phone: updated.guardian_phone,
          });

          // update account state + session storage
          const updatedUser = {
            ...user,
            firstname: updated.firstname,
            lastname: updated.lastname,
            email: updated.email,
          };

          setUser(updatedUser);
          sessionStorage.setItem("mie_user", JSON.stringify(updatedUser));
        }}
      />
    </div>
  );
};

// -------------------- REUSABLE COMPONENTS --------------------

const Card = ({ title, children, onEdit }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <button
        className="btn btn-sm bg-[#5603AD] hover:bg-purple-700 text-white rounded-lg"
        onClick={onEdit}
      >
        Edit Profile
      </button>
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

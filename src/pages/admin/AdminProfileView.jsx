import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import EditProfileModal from "../../components/ModalComponents/EditProfileModal.jsx";

const AdminProfileView = () => {
  const { user, setUser } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  // ---- Fetch account record ----
  useEffect(() => {
    if (!user || !user.id) {
      setErrorMsg("No logged-in admin found.");
      setLoading(false);
      return;
    }

    const fetchAdmin = async () => {
      try {
        const res = await api.get(`/accounts/${user.id}`);
        setAdmin(res.data?.data || res.data);
      } catch (err) {
        console.error("Error loading admin:", err);
        setErrorMsg("Failed to load admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [user]);

  // ---- Open modal with dynamic fields ----
  const openEditModal = (fields, title) => {
    setModalFields(fields);
    setModalTitle(title);
    setShowModal(true);
  };

  // ---- Save profile updates ----
  const handleSave = async (updatedFields) => {
    try {
      await api.put(`/accounts/${user.id}`, updatedFields);

      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      sessionStorage.setItem("mie_user", JSON.stringify(updatedUser));

      setAdmin({ ...admin, ...updatedFields });
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile.");
    }
  };

  // -------- Loading & error states --------
  if (loading) return <p className="p-4 text-gray-600">Loading profile...</p>;
  if (errorMsg && !admin) return <p className="p-4 text-red-500">{errorMsg}</p>;
  if (!admin)
    return <p className="p-4 text-red-500">Admin profile not found.</p>;

  // -------- Display fields --------
  const fullName = `${admin.firstname || ""} ${admin.lastname || ""}`.trim();
  const avatarSrc = admin.photo || "/mie-logo.png";
  const department = admin.department || "N/A";

  const headerLocation = "Admin Profile";
  const headerSubtext = "View and update your administrator information.";

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 text-center lg:h-105 flex flex-col justify-center items-center">
          <img
            src={avatarSrc}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/mie-logo.png";
            }}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-gray-200"
          />

          <h2 className="font-semibold text-lg">{fullName}</h2>
          <p className="text-gray-500 text-sm">Administrator</p>

          <div className="mt-4 text-sm space-y-2 px-9">
            <div className="flex">
              <span className="font-medium w-28 text-left shrink-0">
                Account ID:
              </span>
              <span className="text-gray-600 whitespace-nowrap">
                {admin.account_id}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-28 text-left shrink-0">
                Department:
              </span>
              <span className="text-gray-600 whitespace-nowrap">
                {department}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS CARDS */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* -------- Admin Info -------- */}
          <Card
            title="Admin Information"
            onEdit={() =>
              openEditModal(
                {
                  firstname: admin.firstname,
                  lastname: admin.lastname,
                  email: admin.email,
                  department: admin.department,
                },
                "Edit Admin Information"
              )
            }
          >
            <Grid>
              <Input label="Full Name" value={fullName} />
              <Input label="Email" value={admin.email} />
              <Input label="Department" value={department} />
              <Input label="User Type" value={admin.user_type} />
            </Grid>
          </Card>

          {/* -------- System Details -------- */}
          <Card title="System Details" hideEdit={true}>
            <Grid>
              <Input
                label="Account Date Created"
                value={
                  admin.date_created
                    ? new Date(admin.date_created).toLocaleString()
                    : "N/A"
                }
              />
              <Input label="Status" value={admin.status} />
            </Grid>
          </Card>
        </div>
      </div>

      {/* -------- EDIT MODAL -------- */}
      <EditProfileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        fields={modalFields}
        title={modalTitle}
        onSave={handleSave}
        user={user}
      />
    </div>
  );
};

/* -------------------- REUSABLE COMPONENTS -------------------- */

const Card = ({ title, children, onEdit, hideEdit }) => (
  <div className="bg-white rounded-2xl shadow-md  p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>

      {!hideEdit && (
        <button
          className="btn btn-sm bg-[#5603AD] hover:bg-purple-950 text-white rounded-lg"
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

export default AdminProfileView;

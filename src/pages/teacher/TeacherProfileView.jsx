import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import Header from "../../components/Header";
import EditProfileModal from "../../components/ModalComponents/EditProfileModal.jsx";

const TeacherProfileView = () => {
  const { user, setUser } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ---- STATES FOR DYNAMIC MODAL ----
  const [showModal, setShowModal] = useState(false);
  const [modalFields, setModalFields] = useState({});
  const [modalTitle, setModalTitle] = useState("");

  // ---- Helpers ----
  const getDateCreated = (acc) =>
    acc?.date_created || acc?.["date-created"] || acc?.createdAt || null;

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("en-US") : "N/A";

  const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("en-US") : "N/A";

  // ---- Load account profile ----
  useEffect(() => {
    if (!user || !user.id) {
      setErrorMsg("No logged-in teacher found. Please sign in again.");
      setLoading(false);
      return;
    }

    const fetchAccount = async () => {
      try {
        const res = await api.get(`/accounts/${user.id}`);
        const payload = res.data?.data || res.data;
        setAccount(payload);
      } catch (err) {
        console.error("Error loading teacher account:", err);
        setErrorMsg("Failed to load teacher profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [user]);

  // ---- NEW: OPEN MODAL ----
  const openEditModal = (fields, title) => {
    setModalFields(fields);
    setModalTitle(title);
    setShowModal(true);
  };

  // ---- NEW: HANDLE SAVE ----
  const handleSave = async (updatedFields) => {
    try {
      await api.put(`/accounts/${user.id}`, updatedFields);

      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      sessionStorage.setItem("mie_user", JSON.stringify(updatedUser));

      setAccount({ ...account, ...updatedFields });
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update teacher profile.");
    }
  };

  // -------------------- RENDER STATES --------------------

  if (loading) {
    return <p className="p-4 text-gray-600">Loading profile...</p>;
  }

  if (errorMsg && !account) {
    return <div className="p-4 text-red-500">{errorMsg}</div>;
  }

  if (!account) {
    return (
      <div className="p-4 text-red-500">
        No teacher profile found for this account.
      </div>
    );
  }

  // ---- Fallbacks ----
  const fullName = `${account.firstname || ""} ${
    account.lastname || ""
  }`.trim();
  const role = account.user_type || "Teacher";
  const department = account.department || "—";
  const status = account.status || "—";
  const accountId = account.account_id || "—";
  const email = account.email || "—";
  const avatarSrc = account.photo || "/mie-logo.png";
  const dateCreated = formatDate(getDateCreated(account));
  const lastLogin = account.last_login
    ? formatDateTime(account.last_login)
    : "Never logged in";

  const headerLocation = "Teacher Profile";
  const headerSubtext =
    "View and manage your academic and account information.";

  // -------------------- MAIN VIEW --------------------

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* LEFT COLUMN */}
        <div className="bg-white shadow-md rounded-2xl p-4 border border-gray-200 text-center lg:h-85.5 flex flex-col justify-center items-center">
          <img
            src={avatarSrc}
            alt="Teacher"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/mie-logo.png";
            }}
            className="w-20 h-20 rounded-full mb-4 object-cover mx-auto mt-3"
          />

          <h2 className="font-semibold text-lg">{fullName}</h2>
          <p className="text-gray-500 text-sm">{role}</p>

          <div className="mt-4 text-sm space-y-2 px-15">
            <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
              <span className="font-medium w-28 text-left shrink-0">
                Account ID:
              </span>
              <span className="text-gray-600 whitespace-nowrap">
                {accountId}
              </span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-3 items-start">
              <span className="font-medium w-28 text-left shrink-0">
                Department:
              </span>
              <span className="text-gray-600 whitespace-nowrap">
                {department}
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
                  firstname: account.firstname,
                  lastname: account.lastname,
                  email: account.email,
                  department: account.department,
                },
                "Edit Personal Details"
              )
            }
          >
            <Grid>
              <Input label="Full Name" value={fullName} />
              <Input label="Email" value={email} />
              <Input label="Department" value={department} />
            </Grid>
          </Card>

          {/* ACCOUNT INFORMATION */}
          <Card title="Account Information" hideEdit={true}>
            <Grid>
              <Input label="Account ID" value={accountId} />
              <Input label="Status" value={status} />
              <Input
                label="Account Date Created"
                value={
                  account.date_created
                    ? new Date(account.date_created).toLocaleString()
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

/* -------------------- REUSABLE COMPONENTS -------------------- */

const Card = ({ title, children, onEdit, hideEdit }) => (
  <div className="bg-white rounded-2xl shadow-md  p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>

      {!hideEdit && (
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

export default TeacherProfileView;

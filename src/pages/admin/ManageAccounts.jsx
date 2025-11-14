import { useEffect, useState } from "react";
import Header from "../../components/Header";
import api from "../../api";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BarsArrowDownIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [sortOption, setSortOption] = useState("");

  const departments = ["IS", "CCS", "COS", "COE", "System"];
  const userTypes = ["Student", "Teacher", "Admin"];

  const [form, setForm] = useState({
    _id: "",
    account_id: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    user_type: "Student",
    department: "",
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data);
      setFilteredAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // FILTERING + SORTING + SEARCH
  useEffect(() => {
    let filtered = [...accounts];

    if (filterType) filtered = filtered.filter(a => a.user_type === filterType);
    if (filterDept) filtered = filtered.filter(a => a.department === filterDept);
    if (searchTerm)
      filtered = filtered.filter(a =>
        `${a.firstname} ${a.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOption === "Account ID")
      filtered.sort((a, b) => a.account_id.localeCompare(b.account_id));
    else if (sortOption === "Name")
      filtered.sort((a, b) => a.firstname.localeCompare(b.firstname));

    setFilteredAccounts(filtered);
  }, [filterType, filterDept, searchTerm, sortOption, accounts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/accounts/${form._id}`, form);
        alert("Account updated!");
      } else {
        await api.post("/accounts", form);
        alert("Account created!");
      }
      setShowForm(false);
      setEditMode(false);
      fetchAccounts();
    } catch (err) {
      console.error("Save error:", err);
      alert(err.response?.data?.message || "Error saving account");
    }
  };

  const handleEdit = (acc) => {
    setForm(acc);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (acc) => {
    if (window.confirm(`Delete account ${acc.firstname} ${acc.lastname}?`)) {
      try {
        await api.delete(`/accounts/${acc._id}`);
        alert("Account deleted!");
        fetchAccounts();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting account");
      }
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header
        location="Manage Accounts"
        subheader="Create, update, and manage user accounts across the system."
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-96">
        {/* FILTER BAR */}
        <div className="flex flex-wrap justify-between mb-4 items-center">
          {/* User Type Buttons */}
          <div className="flex gap-2">
            {userTypes.map((type) => (
              <button
                key={type}
                className={`btn rounded-full ${
                  filterType === type ? "bg-[#5603AD] text-white" : "bg-[#F5F5F5]"
                }`}
                onClick={() => setFilterType(filterType === type ? "" : type)}
              >
                {type}
              </button>
            ))}
            <button
              className="btn rounded-full bg-[#5603AD] text-gray-200"
              onClick={() => setFilterType("")}
            >
              ×
            </button>
          </div>

          {/* Add / Edit / Delete Buttons */}
          <div className="flex gap-2">
            {!editMode && !deleteMode && (
              <>
                <button className="btn bg-[#F7B801]" onClick={() => setShowForm(true)}>
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Account</span>
                </button>
                <button className="btn bg-success" onClick={() => setEditMode(true)}>
                  <PencilIcon className="w-5 h-5" />
                  <span>Edit Accounts</span>
                </button>
                <button className="btn bg-error" onClick={() => setDeleteMode(true)}>
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete Accounts</span>
                </button>
              </>
            )}
            {editMode && (
              <button className="btn" onClick={() => setEditMode(false)}>
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                <span>Exit Edit</span>
              </button>
            )}
            {deleteMode && (
              <button className="btn" onClick={() => setDeleteMode(false)}>
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                <span>Cancel Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* FILTERS: Department, Sort, Search */}
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <div className="flex gap-2">
            <select
              className="select select-bordered"
              onChange={(e) => setFilterDept(e.target.value)}
              value={filterDept}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <button className="btn" onClick={() => setSortOption("Account ID")}>
              <BarsArrowDownIcon className="w-5 h-5" />
              Sort by ID
            </button>
            <button className="btn" onClick={() => setSortOption("Name")}>
              <BarsArrowDownIcon className="w-5 h-5" />
              Sort by Name
            </button>
          </div>

          <div>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Search by Name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ACCOUNTS TABLE */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th>Account ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Department</th>
                  {editMode && <th>Edit</th>}
                  {deleteMode && <th>Delete</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc) => (
                  <tr key={acc._id}>
                    <td>{acc.account_id}</td>
                    <td>
                      {acc.firstname} {acc.lastname}
                    </td>
                    <td>{acc.email}</td>
                    <td>{acc.user_type}</td>
                    <td>{acc.department || "—"}</td>
                    {editMode && (
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleEdit(acc)}
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                    {deleteMode && (
                      <td>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(acc)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD/EDIT FORM */}
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

              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="Email"
                required
                value={form.email}
                onChange={handleChange}
              />

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
                onChange={handleChange}
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
                {departments.map((d) => (
                  <option key={d}>{d}</option>
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
    </div>
  );
};

export default ManageAccounts;
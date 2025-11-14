import { useEffect, useState } from "react";
import Header from "../../components/Header";
import api from "../../api";
import FilterBar from "../../components/ManageAccounts/FilterBar";
import FiltersAndSearch from "../../components/ManageAccounts/FiltersAndSearch";
import AccountsTable from "../../components/ManageAccounts/AccountsTable";
import AccountForm from "../../components/ManageAccounts/AccountForm";

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

    if (filterType) filtered = filtered.filter((a) => a.user_type === filterType);
    if (filterDept) filtered = filtered.filter((a) => a.department === filterDept);
    if (searchTerm)
      filtered = filtered.filter((a) =>
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
        <FilterBar
          filterType={filterType}
          setFilterType={setFilterType}
          editMode={editMode}
          setEditMode={setEditMode}
          deleteMode={deleteMode}
          setDeleteMode={setDeleteMode}
          setShowForm={setShowForm}
        />

        <FiltersAndSearch
          filterDept={filterDept}
          setFilterDept={setFilterDept}
          setSortOption={setSortOption}
          setSearchTerm={setSearchTerm}
        />

        <AccountsTable
          filteredAccounts={filteredAccounts}
          editMode={editMode}
          deleteMode={deleteMode}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
        />

        <AccountForm
          showForm={showForm}
          setShowForm={setShowForm}
          editMode={editMode}
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ManageAccounts;
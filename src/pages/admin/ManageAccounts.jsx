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
  const [filterType, setFilterType] = useState([]); // Array for multi-select
  const [filterDept, setFilterDept] = useState("");
  const [sortOption, setSortOption] = useState("");

  const initialFormState = {
    _id: "",
    account_id: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    user_type: "Student",
    department: "",
  };

  const [form, setForm] = useState(initialFormState);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/accounts");
      setAccounts(res.data);
      setFilteredAccounts(res.data); // Initialize with all accounts
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // FILTERING + SORTING + SEARCH (Updated with debugging)
  useEffect(() => {
    console.log("FilterType updated:", filterType); // Debug log
    let filtered = [...accounts];

    // Filter by user_type (multi-select)
    if (filterType.length > 0) {
      filtered = filtered.filter((a) => filterType.includes(a.user_type));
      console.log("Filtered by user_type:", filtered); // Debug log
    } else {
      console.log("No user_type filter, using all accounts"); // Debug log
    }

    // Filter by department
    if (filterDept) {
      filtered = filtered.filter((a) => a.department === filterDept);
      console.log("Filtered by department:", filtered); // Debug log
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((a) =>
        `${a.firstname} ${a.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("Filtered by search term:", filtered); // Debug log
    }

    // Sort by option
    if (sortOption === "Account ID") {
      filtered.sort((a, b) => a.account_id.localeCompare(b.account_id));
    } else if (sortOption === "Name") {
      filtered.sort((a, b) => a.firstname.localeCompare(b.firstname));
    }

    setFilteredAccounts(filtered);
    console.log("Final filteredAccounts:", filteredAccounts); // Debug log
  }, [filterType, filterDept, searchTerm, sortOption, accounts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditMode(false);
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
      resetForm();
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

  const handleShowAddForm = () => {
    resetForm();
    setShowForm(true);
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
          setShowForm={handleShowAddForm}
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
          resetForm={resetForm}
        />
      </div>
    </div>
  );
};

export default ManageAccounts;
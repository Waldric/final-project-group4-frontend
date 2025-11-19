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
  // Student fields
  student_number: "",
  year_level: 1,
  course: "",
  birthday: "",
  address: "",
  phone: "",
  mother: "",
  father: "",
  guardian_phone: "",
  // Teacher fields
  teacher_uid: "",
  teacher_departments: [],
  // Admin fields
  admin_id: "",
  admin_level: "",
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

  // FILTERING + SORTING + SEARCH
  useEffect(() => {
    let filtered = [...accounts];

    // Filter by user_type (multi-select)
    if (filterType.length > 0) {
      filtered = filtered.filter((a) => filterType.includes(a.user_type));
    }

    // Filter by department
    if (filterDept) {
      filtered = filtered.filter((a) => a.department === filterDept);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((a) =>
        `${a.firstname} ${a.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by option
    if (sortOption === "Account ID") {
      filtered.sort((a, b) => a.account_id.localeCompare(b.account_id));
    } else if (sortOption === "Name") {
      filtered.sort((a, b) => a.firstname.localeCompare(b.firstname));
    }

    setFilteredAccounts(filtered);
  }, [filterType, filterDept, searchTerm, sortOption, accounts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditMode(false);
  };

  const handleSubmit = async (e, submitData) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await api.put(`/accounts/${form._id}`, submitData || form);
        alert("Account updated successfully!");
      } else {
        // Create account - backend will handle Student/Teacher/Admin creation
        await api.post("/accounts", submitData || form);
        alert(`Account and ${form.user_type} profile created successfully!`);
      }
      setShowForm(false);
      resetForm();
      fetchAccounts();
    } catch (err) {
      console.error("Save error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error saving account";
      alert(errorMessage);
    }
  };

  const handleEdit = (acc) => {
  const fixed = {
    ...acc,
    teacher_department: acc.teacher_departments?.[0] || "",
  };

  setForm(fixed);
  setEditMode(true);
  setShowForm(true);
};

  const handleDelete = async (acc) => {
    if (window.confirm(`Delete account for ${acc.firstname} ${acc.lastname}? This will also delete their ${acc.user_type} profile.`)) {
      try {
        // Backend will handle cascading delete to Student/Teacher/Admin
        await api.delete(`/accounts/${acc._id}`);
        alert("Account and related profile deleted successfully!");
        fetchAccounts();
      } catch (err) {
        console.error("Delete error:", err);
        const errorMessage = err.response?.data?.message || "Error deleting account";
        alert(errorMessage);
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
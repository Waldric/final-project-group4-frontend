// src/pages/student/MyDisciplinaryRecords.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import Header from "../../components/Header";
import { FunnelIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const MyDisciplinaryRecords = () => {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("Newest First");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ONLY CURRENT STUDENT'S RECORDS
  useEffect(() => {
    const fetchMyRecords = async () => {
      if (!user?.student_number) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/disciplinary?student=${user.student_number}`);
        
        const data = response.data.data || [];
        setRecords(data);
        setFilteredRecords(data);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load your records";
        setError(msg);
        console.error("Fetch disciplinary records error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecords();
  }, [user?.student_number]);

  // SEARCH FILTER
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = records.filter(record =>
      record.violation?.toLowerCase().includes(term) ||
      record.sanction?.toLowerCase().includes(term) ||
      record.remarks?.toLowerCase().includes(term) ||
      record.teachers_id?.firstname?.toLowerCase().includes(term) ||
      record.teachers_id?.lastname?.toLowerCase().includes(term)
    );

    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  // SORT HANDLER
  const handleSortChange = (sortType) => {
    setSelectedSort(sortType);

    const sorted = [...filteredRecords].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortType === "Newest First" ? dateB - dateA : dateA - dateB;
    });

    setFilteredRecords(sorted);
  };

  // SEVERITY BADGE COLOR
  const getSeverityBadge = (severity) => {
    if (!severity) return "badge-ghost";
    if (severity <= 2) return "badge-success";
    if (severity <= 3) return "badge-warning";
    return "badge-error";
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
      <Header
        location="My Disciplinary Records"
        subheader="View all incidents recorded under your student account"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[600px] flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search violation, sanction, teacher, or remarks..."
                className="input input-bordered w-full pl-10 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline flex items-center gap-2">
              {selectedSort}
              <ChevronDownIcon className="w-4 h-4" />
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-10">
              <li><a onClick={() => handleSortChange("Newest First")}>Newest First</a></li>
              <li><a onClick={() => handleSortChange("Oldest First")}>Oldest First</a></li>
            </ul>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Records */}
        <div className="grow overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FunnelIcon className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-medium text-gray-700">No records found</p>
              <p className="text-gray-500 mt-2">
                {searchTerm ? "Try adjusting your search" : "Keep up the good behavior!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record._id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Date */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="mt-2">
                        <span className={`badge badge-sm ${getSeverityBadge(record.severity)}`}>
                          Level {record.severity || "?"}
                        </span>
                      </div>
                    </div>

                    {/* Violation */}
                    <div className="md:col-span-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Violation</p>
                      <p className="font-bold text-lg text-red-700">{record.violation}</p>
                    </div>

                    {/* Reported By */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Reported By</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="avatar">
                          <div className="w-10 rounded-full ring ring-purple-600 ring-offset-2">
                            <img
                              src={record.teachers_id?.avatar || "/default-avatar.png"}
                              alt={`${record.teachers_id?.firstname} ${record.teachers_id?.lastname}`}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {record.teachers_id?.firstname} {record.teachers_id?.lastname}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sanction */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Sanction</p>
                      <p className="font-bold text-orange-700">{record.sanction}</p>
                    </div>

                    {/* Remarks */}
                    <div className="md:col-span-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Remarks</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {record.remarks || "No additional remarks"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDisciplinaryRecords;
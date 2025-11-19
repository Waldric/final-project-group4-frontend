import { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import api from "../../api";
import AddTeacherSubjectModal from "../../components/ModalComponents/AddTeacherSubjectModal";
import EditTeacherSubjectModal from "../../components/ModalComponents/EditTeacherSubjectModal";
import DeleteTeacherSubjectModal from "../../components/ModalComponents/DeleteTeacherSubjectModal";

const TeacherScheduleView = ({ teacherId, teacherCode, onBack }) => {
  // Source of Data
  const [indivTeacherData, setIndivTeacherData] = useState({
    data: {},
    error: null,
    loading: false,
  });

  const {
    account_ref = {},
    departments = [],
    subjects = [],
    teacher_uid,
  } = indivTeacherData.data || {};

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Selection state for bulk operations
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Modal states
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [editSubjectOpen, setEditSubjectOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);

  // Move fetchTeacher outside useEffect so it can be called from anywhere
  const fetchTeacher = useCallback(async () => {
    if (!teacherId) return;

    setIndivTeacherData({
      data: {},
      error: null,
      loading: true,
    });

    try {
      const res = await api.get(`/teachers/${teacherId}/`);
      const data = res.data.data ?? {};
      console.log(data);

      setIndivTeacherData({
        data: data,
        error: null,
        loading: false,
      });

      // Clear selections after refresh
      setSelectedSubjects([]);
    } catch (err) {
      console.error(err);
      setIndivTeacherData({
        data: {},
        error: err.response?.data?.message || "Unexpected Error",
        loading: false,
      });
    }
  }, [teacherId]);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  // Selection handlers
  const toggleSelectSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleSelectAll = (checked) => {
    if (!subjects?.length) return;
    setSelectedSubjects(
      checked ? subjects.map((subj) => subj._id || subj.subject_id._id) : []
    );
  };

  // Action handlers
  const handleOpenEdit = () => {
    if (selectedSubjects.length !== 1) return;
    const subject = subjects.find(
      (s) => (s._id || s.subject_id._id) === selectedSubjects[0]
    );
    if (!subject) return;
    setActiveSubject(subject);
    setEditSubjectOpen(true);
  };

  const handleOpenDelete = () => {
    if (selectedSubjects.length === 0) return;
    setDeleteConfirmOpen(true);
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects?.filter((subj) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      subj.subject_id?.code?.toLowerCase().includes(term) ||
      subj.subject_id?.subject_name?.toLowerCase().includes(term) ||
      subj.subject_id?.department?.toLowerCase().includes(term) ||
      subj.day?.toLowerCase().includes(term) ||
      subj.room?.toLowerCase().includes(term) ||
      subj.time?.toLowerCase().includes(term)
    );
  });

  // Check button states
  const canEdit = selectedSubjects.length === 1;
  const canDelete = selectedSubjects.length > 0;

  if (
    indivTeacherData.loading ||
    !indivTeacherData.data ||
    Object.keys(indivTeacherData.data).length === 0
  ) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header
        location={`Schedule Records for ${teacherCode}`}
        subheader="View, create, and manage the teacher's subject assignments and schedules."
      />

      {/* Back link */}
      <button
        className="flex items-center gap-2 text-sm text-gray-800 mb-4 hover:text-black"
        onClick={onBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Teacher Records
      </button>

      {/* Teacher Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-4 flex flex-col md:flex-row items-center gap-6">
        <img
          src={account_ref.photo}
          onError={(e) => (e.currentTarget.src = "/mie-logo.png")}
          alt="Teacher Avatar"
          className="w-20 h-20 rounded-full object-cover border border-gray-300"
        />

        <div className="flex-1 flex flex-col gap-1">
          <p className="font-bold text-xl text-[#4c026e]">
            {account_ref.firstname} {account_ref.lastname}
          </p>

          <div className="flex flex-wrap gap-10 text-sm mt-1">
            <div>
              <p className="text-gray-400 font-semibold text-xs">Teacher ID</p>
              <p className="font-medium">{teacher_uid}</p>
            </div>

            <div>
              <p className="text-gray-400 font-semibold text-xs">Department</p>
              <p className="font-medium">
                {departments.map((dept) => dept).join(", ")}
              </p>
            </div>

            <div>
              <p className="text-gray-400 font-semibold text-xs">Email</p>
              <p className="font-medium">{account_ref.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-24">
        {/* Action Buttons and Search */}
        <div className="flex flex-1 justify-between items-center gap-4 mx-6 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search subject name, code..."
              className="input input-bordered input-sm w-56 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              className="btn btn-success text-white"
              onClick={() => setAddSubjectOpen(true)}
            >
              Add New Subject Assignment
            </button>
            <button
              className="btn btn-warning"
              disabled={!canEdit}
              onClick={handleOpenEdit}
            >
              Edit Assignment
            </button>
            <button
              className="btn btn-error text-white"
              disabled={!canDelete}
              onClick={handleOpenDelete}
            >
              Delete Assignment{selectedSubjects.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>

        {!subjects || subjects.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No subject assignments found. Click{" "}
            <span className="font-semibold text-[#5603AD]">
              "Add New Subject Assignment"
            </span>{" "}
            to begin.
          </div>
        ) : (
          <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table table-zebra w-full text-sm text-center">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={
                        subjects.length > 0 &&
                        selectedSubjects.length === subjects.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Units</th>
                  <th>Department</th>
                  <th>Day</th>
                  <th>Room</th>
                  <th>Time</th>
                  <th>Slots</th>
                </tr>
              </thead>

              <tbody>
                {filteredSubjects.map((subj, index) => {
                  const subjectId = subj._id || subj.subject_id._id;
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedSubjects.includes(subjectId)}
                          onChange={() => toggleSelectSubject(subjectId)}
                        />
                      </td>
                      <td>{subj.subject_id?.code || "N/A"}</td>
                      <td>{subj.subject_id?.subject_name || "N/A"}</td>
                      <td>{subj.subject_id?.units || "N/A"}</td>
                      <td>{subj.subject_id?.department || "N/A"}</td>
                      <td>{subj.day}</td>
                      <td>{subj.room}</td>
                      <td>{subj.time}</td>
                      <td>{subj.slots}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTeacherSubjectModal
        isOpen={addSubjectOpen}
        onClose={() => setAddSubjectOpen(false)}
        teacherId={teacherId}
        teacherData={indivTeacherData.data}
        onAdded={() => {
          setAddSubjectOpen(false);
          fetchTeacher(); // Now this works!
        }}
      />

      <EditTeacherSubjectModal
        isOpen={editSubjectOpen}
        onClose={() => setEditSubjectOpen(false)}
        teacherId={teacherId}
        teacherData={indivTeacherData.data}
        subjectToEdit={activeSubject}
        onUpdated={() => {
          setEditSubjectOpen(false);
          fetchTeacher();
        }}
      />

      <DeleteTeacherSubjectModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        teacherId={teacherId}
        teacherData={indivTeacherData.data}
        selectedSubjectIds={selectedSubjects}
        onDeleted={() => {
          setDeleteConfirmOpen(false);
          fetchTeacher();
        }}
      />
    </div>
  );
};

export default TeacherScheduleView;

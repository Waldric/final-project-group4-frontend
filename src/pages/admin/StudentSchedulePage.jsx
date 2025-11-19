// src/pages/admin/StudentSchedulePage.jsx
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api";

import CreateScheduleModal from "../../components/ModalComponents/CreateScheduleModal";
import AddScheduleEntryModal from "../../components/ModalComponents/AddScheduleEntryModal";
import EditScheduleEntryModal from "../../components/ModalComponents/EditScheduleEntryModal";
import AssignTeacherModal from "../../components/ModalComponents/AssignTeacherModal";
import ConfirmDeleteModal from "../../components/ModalComponents/ConfirmDeleteModal";

export default function StudentSchedulePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [student, setStudent] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showActions, setShowActions] = useState(false);

  // Persist AY & Semester using localStorage
  const [acadYear, setAcadYear] = useState(() => {
    const saved = localStorage.getItem(`sched_${studentId}_acadYear`);
    return saved ? Number(saved) : 1;
  });

  const [semester, setSemester] = useState(() => {
    const saved = localStorage.getItem(`sched_${studentId}_semester`);
    return saved ? Number(saved) : 1;
  });

  const [selectedCodes, setSelectedCodes] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canEdit = selectedCodes.length === 1;
  const canDelete = selectedCodes.length > 0;

  /* Fetch Student */
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${studentId}`);
        setStudent(res.data.data || null);
      } catch (err) {
        console.error("Failed to load student:", err);
        setErrorMsg("Failed to load student details.");
      }
    };

    if (studentId) fetchStudent();
  }, [studentId]);

  /* Fetch Schedule */
  const loadSchedule = useCallback(async () => {
    if (!studentId) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.get(`/schedules/student/${studentId}`, {
        params: { acad_year: acadYear, semester },
      });

      setSchedule(res.data.data || null);
      setSelectedCodes([]);
      setActiveEntry(null);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      setErrorMsg("Failed to load schedule.");
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, acadYear, semester]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  /* Selection Helpers */
  const toggleSelect = (courseCode) => {
    setSelectedCodes((prev) =>
      prev.includes(courseCode)
        ? prev.filter((c) => c !== courseCode)
        : [...prev, courseCode]
    );
  };

  const toggleSelectAll = (checked) => {
    if (!schedule?.schedules?.length) return;

    setSelectedCodes(
      checked ? schedule.schedules.map((e) => e.course_code) : []
    );
  };

  /* Actions */
  const handleOpenEdit = () => {
    if (!canEdit || !schedule) return;
    const target = schedule.schedules.find(
      (e) => e.course_code === selectedCodes[0]
    );
    if (!target) return;
    setActiveEntry(target);
    setEditOpen(true);
  };

  const handleOpenAssign = (entry) => {
    setActiveEntry(entry);
    setAssignOpen(true);
  };

  const handleOpenDelete = () => {
    if (!canDelete) return;
    setDeleteOpen(true);
  };

  // Real-time Search Filter

  const filteredSchedules = schedule?.schedules?.filter((entry) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    return (
      entry.subject_ref?.subject_name?.toLowerCase().includes(term) ||
      entry.course_code?.toLowerCase().includes(term) ||
      `${entry.teacher_ref?.account_ref?.firstname || ""} ${
        entry.teacher_ref?.account_ref?.lastname || ""
      }`
        .toLowerCase()
        .includes(term) ||
      entry.day?.toLowerCase().includes(term) ||
      entry.room?.toLowerCase().includes(term) ||
      entry.time?.toLowerCase().includes(term)
    );
  });

  /*------- UI -------- */
  return (
    <div className="flex-1 p-4 md:p-8">
      <Header
        location="Student Schedule"
        subheader="View, create, and manage the student's subjects and teachers per academic year and semester."
      />

      {/* Back link */}
      <button
        className="flex items-center gap-2 text-sm text-gray-800 mb-4 hover:text-black"
        onClick={() => navigate("/dashboard/admin/student-records")}
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
        Back to Student Records
      </button>

      {/* Student Info */}
      {student && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-4 flex flex-col md:flex-row items-center gap-6">
          <img
            src={student.accounts_ref?.photo || "/mie-logo.png"}
            onError={(e) => (e.currentTarget.src = "/mie-logo.png")}
            alt="Student Avatar"
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />

          <div className="flex-1 flex flex-col gap-1">
            <p className="font-bold text-xl text-[#4c026e]">
              {student.accounts_ref?.firstname} {student.accounts_ref?.lastname}
            </p>

            <div className="flex flex-wrap gap-10 text-sm mt-1">
              <div>
                <p className="text-gray-400 font-semibold text-xs">
                  Student ID
                </p>
                <p className="font-medium">#{student.student_number}</p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold text-xs">
                  Department
                </p>
                <p className="font-medium">{student.department || "N/A"}</p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold text-xs">
                  Year/Grade Level
                </p>
                <p className="font-medium">
                  {student.department === "IS"
                    ? `Grade ${student.year_level}`
                    : {
                        1: "1st Year",
                        2: "2nd Year",
                        3: "3rd Year",
                        4: "4th Year",
                      }[student.year_level] || `Year ${student.year_level}`}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold text-xs">Email</p>
                <p className="font-medium">{student.accounts_ref?.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">
              Academic Year
            </label>
            <select
              className="select select-bordered select-md w-45 "
              value={acadYear}
              onChange={(e) => {
                const value = Number(e.target.value);
                setAcadYear(value);
                localStorage.setItem(`sched_${studentId}_acadYear`, value);
              }}
            >
              {[1, 2, 3, 4].map((ay) => (
                <option key={ay} value={ay}>
                  Academic Year {ay}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">
              Semester
            </label>
            <select
              className="select select-bordered select-md w-40"
              value={semester}
              onChange={(e) => {
                const value = Number(e.target.value);
                setSemester(value);
                localStorage.setItem(`sched_${studentId}_semester`, value);
              }}
            >
              <option value={1}>1st Semester</option>
              <option value={2}>2nd Semester</option>
            </select>
          </div>
        </div>

        {/* Floating Add/Create button */}
        <div className="fixed bottom-12 right-10 z-50 flex flex-col items-end gap-2">
          {showActions && (
            <div className="flex flex-col gap-2 mb-2 animate-fade-in">
              <button
                className="btn btn-primary btn-md bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b] flex items-center gap-2"
                onClick={() => {
                  setShowActions(false);
                  setCreateOpen(true);
                }}
              >
                Create Schedule
              </button>

              <button
                className="btn btn-md bg-gray-600 border-gray-500 hover:bg-black text-white flex items-center gap-2"
                onClick={() => {
                  setShowActions(false);
                  setAddOpen(true);
                }}
              >
                Add Subject
              </button>
            </div>
          )}

          <button
            onClick={() => setShowActions((prev) => !prev)}
            className="btn btn-circle bg-[#5603AD] hover:bg-[#450887] border-[#5603AD] text-white shadow-xl w-40 h-15 flex items-center justify-center font-semibold gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-7 h-7 transition-transform duration-200 ${
                showActions ? "rotate-45" : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add / Create
          </button>
        </div>

        {/* Edit + Delete */}
        <div className="flex items-center gap-2 ml-4 mt-6">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search subject, code, teacher..."
            className="input input-bordered input-sm w-56 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="btn btn-warning"
            disabled={!canEdit || !schedule}
            onClick={handleOpenEdit}
          >
            Edit Subject
          </button>

          <button
            className="btn btn-error text-white"
            disabled={!canDelete || !schedule}
            onClick={handleOpenDelete}
          >
            Delete Subject
          </button>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="alert alert-error mb-3">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-24">
        {loading ? (
          <div className="text-center text-gray-500 py-6">Loading...</div>
        ) : !schedule ? (
          <div className="text-center text-gray-500 py-6">
            No schedule found for Academic Year {acadYear},{" "}
            {semester === 1 ? "1st" : "2nd"} Semester. <br />
            Click{" "}
            <span className="font-semibold text-[#5603AD]">
              "Create Schedule"
            </span>{" "}
            to set up a new one.
          </div>
        ) : !schedule.schedules?.length ? (
          <div className="text-center text-gray-500 py-6">
            This schedule has no subjects yet. Click{" "}
            <span className="font-semibold text-[#5603AD]">"Add Subject"</span>{" "}
            to begin.
          </div>
        ) : (
          <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={
                        schedule.schedules.length > 0 &&
                        selectedCodes.length === schedule.schedules.length
                      }
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th>Course Code</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                  <th className="text-center">Assign</th>
                </tr>
              </thead>

              <tbody>
                {filteredSchedules.map((entry) => (
                  <tr key={entry._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedCodes.includes(entry.course_code)}
                        onChange={() => toggleSelect(entry.course_code)}
                      />
                    </td>

                    <td>{entry.subject_ref?.subject_name || "N/A"}</td>

                    <td>
                      {entry.teacher_ref?.account_ref
                        ? `${entry.teacher_ref.account_ref.firstname} ${entry.teacher_ref.account_ref.lastname}`
                        : "Unassigned"}
                    </td>

                    <td>{entry.course_code}</td>
                    <td>{entry.room}</td>
                    <td>{entry.day}</td>
                    <td>{entry.time}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenAssign(entry)}
                      >
                        Assign Teacher
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateScheduleModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        student={student}
        currentAcadYear={acadYear}
        currentSemester={semester}
        onCreated={(newAy, newSem) => {
          setCreateOpen(false);
          setAcadYear(newAy);
          setSemester(newSem);

          localStorage.setItem(`sched_${studentId}_acadYear`, newAy);
          localStorage.setItem(`sched_${studentId}_semester`, newSem);

          loadSchedule();
        }}
      />

      <AddScheduleEntryModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        scheduleId={schedule?._id}
        student={student}
        semester={semester}
        onAdded={() => {
          setAddOpen(false);
          loadSchedule();
        }}
      />

      <EditScheduleEntryModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        scheduleId={schedule?._id}
        entry={activeEntry}
        onUpdated={() => {
          setEditOpen(false);
          loadSchedule();
        }}
      />

      <AssignTeacherModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        scheduleId={schedule?._id}
        entry={activeEntry}
        onAssigned={() => {
          setAssignOpen(false);
          loadSchedule();
        }}
      />

      <ConfirmDeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        scheduleId={schedule?._id}
        courseCodes={selectedCodes}
        onDeleted={() => {
          setDeleteOpen(false);
          setSelectedCodes([]);
          loadSchedule();
        }}
      />
    </div>
  );
}

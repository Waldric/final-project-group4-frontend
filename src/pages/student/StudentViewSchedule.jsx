// src/pages/student/StudentScheduleViewPage.jsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";

const StudentViewSchedule = () => {;
  const [searchTerm, setSearchTerm] = useState("");
  const [student, setStudent] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuth();

  // Persist AY & Semester using localStorage
  const [acadYear, setAcadYear] = useState(() => {
    const saved = localStorage.getItem(`student_sched_acadYear`);
    return saved ? Number(saved) : 1;
  });

  const [semester, setSemester] = useState(() => {
    const saved = localStorage.getItem(`student_sched_semester`);
    return saved ? Number(saved) : 1;
  });

  /* Fetch Current Student Profile */
  useEffect(() => {
    
    const fetchStudent = async () => {
      try {
        // Assuming there's an endpoint to get current logged-in student
        const res1 = await api.get(`/students/byAccount/${user.id}`);
        setStudent(res1.data.data || null);
        console.log("response", student);
      } catch (err) {
        console.error("Failed to load student profile:", err);
        setErrorMsg("Failed to load your profile.");
      }
    };

    fetchStudent();
  }, []);

  /* Fetch Schedule */
  const loadSchedule = useCallback(async () => {
    if (!student?._id) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.get(`/schedules/student/${student._id}`, {
        params: { acad_year: acadYear, semester },
      });

      setSchedule(res.data.data || null);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      setErrorMsg("Failed to load schedule.");
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }, [student?._id, acadYear, semester]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

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
        location="My Schedule"
        subheader="View your enrolled subjects and assigned teachers per academic year and semester."
      />

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
              className="select select-bordered select-md w-45"
              value={acadYear}
              onChange={(e) => {
                const value = Number(e.target.value);
                setAcadYear(value);
                localStorage.setItem(`student_sched_acadYear`, value);
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
                localStorage.setItem(`student_sched_semester`, value);
              }}
            >
              <option value={1}>1st Semester</option>
              <option value={2}>2nd Semester</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search subject, code, teacher..."
            className="input input-bordered input-sm w-56 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            {semester === 1 ? "1st" : "2nd"} Semester.
          </div>
        ) : !schedule.schedules?.length ? (
          <div className="text-center text-gray-500 py-6">
            No subjects enrolled for this semester yet.
          </div>
        ) : (
          <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th>Subject</th>
                  <th>Course Code</th>
                  <th>Teacher</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredSchedules.map((entry) => (
                  <tr key={entry.course_code}>
                    <td className="font-medium">
                      {entry.subject_ref?.subject_name || "N/A"}
                    </td>

                    <td>{entry.course_code}</td>

                    <td>
                      {entry.teacher_ref?.account_ref
                        ? `${entry.teacher_ref.account_ref.firstname} ${entry.teacher_ref.account_ref.lastname}`
                        : "TBA"}
                    </td>

                    <td>{entry.room}</td>
                    <td>{entry.day}</td>
                    <td>{entry.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentViewSchedule
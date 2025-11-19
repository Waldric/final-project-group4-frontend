import { useEffect, useState } from "react";
import api from "../../api";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

const generateTimeSlots = (start = "7:00", end = "17:00") => {
  const slots = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute <= endMinute)) {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");

    slots.push(`${h}:${m}`);
    minute += 30;
    if (minute >= 60) {
      hour++;
      minute = 0;
    }
  }

  return slots;
};

const expandTimeRange = (range) => {
  const [start, end] = range.split("-");
  const times = [];
  let [h, m] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  while (h < eh || (h === eh && m <= em)) {
    const hh = h.toString().padStart(2, "0");
    const mm = m.toString().padStart(2, "0");

    times.push(`${hh}:${mm}`);
    m += 30;
    if (m >= 60) {
      h++;
      m = 0;
    }
  }

  return times;
};

const TeacherDashboard = () => {
  const headerLocation = "My Dashboard";
  const headerSubtext = `Have an overview regarding all of your classes, students
                        and schedules.`;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState({
    loading: false,
    error: null,
    subjects: [],
    partialSubjects: [],
  });
  const [numOfStudents, setNumOfStudents] = useState({
    loading: false,
    error: null,
    total: null,
  });

  useEffect(() => {
    if (!user?.id) return;
    setTeacher((prev) => ({ ...prev, loading: true, error: null }));
    setNumOfStudents((prev) => ({ ...prev, loading: true, error: null }));

    const fetchSchedule = async () => {
      try {
        const res1 = await api.get(`/teachers/account/${user.id}`);
        const schedule = res1.data.data.subjects ?? [];
        setTeacher({
          loading: false,
          error: null,
          subjects: schedule,
          partialSubjects: schedule.slice(0, 2),
        });
        const re2 = await api.get(
          `/reports/numStudents/teacher/${res1.data.data._id}`
        );
        const nStudents = re2.data.data[0].total ?? null;
        setNumOfStudents({
          loading: false,
          error: null,
          total: nStudents,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSchedule();
  }, [user]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const timeSlots = generateTimeSlots("07:00", "17:00");

  const lookup = {};
  teacher.subjects.forEach((s) => {
    const times = expandTimeRange(s.time);
    if (!lookup[s.day]) lookup[s.day] = {};
    times.forEach((t) => {
      lookup[s.day][t] = s.room;
    });
  });

  if (teacher.loading || numOfStudents.loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (teacher.error || numOfStudents.error) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="text-4xl">{teacher.error ? teacher.error : null}</span>
        <span className="text-4xl">
          {numOfStudents.error ? numOfStudents.error : null}
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* Dashboard Content */}
      <div className="p-4 md:p-6 min-h-96">
        {/* Main Content */}
        <div>
          {/* First Row */}
          <div className="flex *:mx-3">
            {/* Profile Summary */}
            <div className="p-5 flex-1 flex flex-col w-full justify-center items-center text-center bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="m-3 font-bold text-xl">Profile Summary</h2>
              <div className="flex flex-col *:my-0.5">
                <div className="avatar flex w-full justify-center">
                  <div className="w-24 rounded-full">
                    <img src={user.photo} />
                  </div>
                </div>
                <span className="font-bold text-2xl">
                  {user.firstname} {user.lastname}
                </span>
                <span className="font-extralight text-sm text-gray-400">
                  Account ID: {user.account_id}
                </span>
                <span className="">Teacher</span>
              </div>
              <div className="flex *:my-1 *:mx-2">
                <div className="flex flex-col *:my-1">
                  <h3>Total Classes:</h3>
                  <h1 className="text-3xl font-bold">
                    {teacher.subjects.length}
                  </h1>
                </div>
                <div className="flex flex-col *:my-1">
                  <h3>Total Students:</h3>
                  <h1 className="text-3xl font-bold">{numOfStudents.total}</h1>
                </div>
              </div>
            </div>

            {/* My Classes */}
            <div className="flex-3 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 justify-between">
              <div className="flex justify-between mx-5 my-5">
                <h1 className="font-bold text-2xl">My classes</h1>
                <h1 className="font-extralight text-gray-400">SY 2025-2026</h1>
              </div>
              {teacher.partialSubjects.map((subject, index) => (
                <div className="flex flex-col w-full *:mx-5 *:px-5 *:py-3 text-gray-50">
                  <div className="my-2 flex flex-col bg-amber-600 rounded-3xl *:my-1">
                    <div className="flex justify-start">
                      <h2 className="font-extrabold">
                        {subject.subject_id.subject_name}
                      </h2>
                    </div>
                    <div className="flex justify-between">
                      <p1>
                        Schedule: {subject.day} {subject.time}
                      </p1>
                      <p1>Room: {subject.room}</p1>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex m-5 justify-between items-center">
                <span className="text-gray-400">
                  {" "}
                  Showing {teacher.partialSubjects.length} of{" "}
                  {teacher.subjects.length} classes
                </span>
                <button className="btn" onClick={() => navigate("/dashboard/teacher/classes")}>View My Classes</button>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col mx-3 my-5 bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
            <h2 className="m-5 font-bold text-2xl">My Schedule</h2>
            <div className="overflow-x-auto w-full rounded-box border border-base-content/5 bg-base">
              <table className="table table-zebra w-full text-sm text-center">
                <thead>
                  <tr>
                    <th className="-400 px-2 py-1">Time</th>
                    {days.map((day) => (
                      <th key={day} className="px-2 py-1">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((time) => (
                    <tr key={time}>
                      <td className="px-2 py-1 font-semibold bg-gray-50">
                        {time}
                      </td>
                      {days.map((day) => (
                        <td key={day} className="px-2 py-1">
                          {lookup[day]?.[time] || "---"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

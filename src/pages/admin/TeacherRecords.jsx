import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useTeachersContext } from "../../contexts/TeacherContext";
import { useSubjectContext } from "../../contexts/SubjectContext";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const TeacherRecords = () => {
  const headerLocation = "Teacher Records";
  const headerSubtext = `View real-time statistics, recent activities, and key 
                      updates across students, teachers, payments, and 
                      announcements — all in one place.`;
  const { filteredTeachers, loading, error } = useTeachersContext();
  const { departmentsList } = useSubjectContext();
  const [view, setView] = useState("list");
  const [sentData, setSendData] = useState({
    teacher_code: null,
    teacher_id: null,
  })
  const [filterParams, setFiltersParams] = useState({
    name: null,
    department: [],
    year: null,
    semester: null,
  });

  useEffect(() => {
    console.log(filteredTeachers);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="text-4xl">{info.error}</span>
      </div>
    );
  }

  if (view === "teacher") {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={""} subheader={""} />

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
          <button className="btn mb-4 btn-success" onClick={() => setView("list")}>
            Back to Classes View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* Dashboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        {/* Filter, Sort, Search, and Edit Buttons*/}
        <div className="[&>div]:m-5">
          {/* Filter by College Department Buttons and Editing Buttons*/}
          <div className="flex">
            <form className="mx-1 justify-between flex bg-[#F5F5F5] rounded-4xl gap-2">
              {departmentsList.map((department, index) => (
                <input
                  className="btn rounded-4xl border-0 checked:bg-[#5603AD]"
                  type="checkbox"
                  name="frameworks"
                  aria-label={department}
                  value={department}
                  key={index}
                  onChange={null}
                />
              ))}
            </form>
          </div>
          <div className="flex">
            {/* Dropdown Filters */}
            <div className="flex flex-2 mr-2 [&>div]:mx-2">
              <div className="flex-1">
                <input
                  type="number"
                  className="input join-item w-full"
                  placeholder="Year/Grade"
                  min="1"
                  max="12"
                  value={filterParams?.year ?? ""}
                  onChange={null}
                />
              </div>
              <div className="flex-1">
                <select
                  className="select"
                  onChange={null}
                  value={filterParams?.semester ?? ""}
                >
                  <option disabled={true} value={""} defaultValue>
                    Semester
                  </option>
                  <option value={"1"}>1</option>
                  <option value={"2"}>2</option>
                  <option value={"3"}>3</option>
                  <option value={"4"}>4</option>
                </select>
              </div>
            </div>
            {/* Filler Div */}
            <div className="flex-2">
              {filterParams.year || filterParams.semester ? (
                <div>
                  <button
                    className="btn rounded-4xl bg-[#5603AD] text-gray-200 "
                    type="button"
                    onClick={null}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : null}
            </div>
            {/* Search and Sort */}
            <div className="flex justify-end flex-2">
              {/* Search */}
              <div className="mx-3 flex-2">
                <input
                  type="text"
                  className="input"
                  placeholder="Search for Subject Name"
                  value={filterParams?.name ?? ""}
                  onChange={null}
                />
              </div>
              {/* Sort */}
              {/* <div>
                <button className="btn">
                  <BarsArrowDownIcon className="w-5 h-5" />
                  <span>Sort By</span>
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table table-zebra text-center">
            {/* Headers */}
            <thead className="bg-[#F5F5F5]">
              <tr className="bg-[#5603AD] text-gray-200">
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Departments</th>
                <th>Email</th>
                <th>Number of Schedules</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {/* Rows from DB */}

              {filteredTeachers.map((teacher) => (
                <tr key={teacher._id} value={teacher._id}>
                  <td>{teacher.teacher_uid}</td>
                  <td>
                    {teacher?.account_ref?.firstname}{" "}
                    {teacher?.account_ref?.lastname}
                  </td>
                  <td>
                    <p>{teacher?.departments.map((dept) => dept).join(", ")}</p>
                  </td>
                  <td>{teacher?.account_ref?.email}</td>
                  <td>{teacher.subjects.length}</td>
                  <td>
                    <button className="btn bg-[#F7B801]" onClick={() => {setView("teacher"); setSendData({
                      teacher_code: teacher.teacher_uid,
                      teacher_id: teacher.teacher_id
                    })}}>View Schedules</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherRecords;

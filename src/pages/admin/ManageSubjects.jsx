import { useState } from "react";
import Header from "../../components/Header";
import { useSubjectContext } from "../../contexts/SubjectContext";
import {
  ArrowLeftEndOnRectangleIcon,
  BarsArrowDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const ManageSubjects = () => {
  const headerLocation = "Manage Subjects";
  const headerSubtext = `View real-time statistics, recent activities, and key 
                      updates across students, teachers, payments, and 
                      announcements — all in one place.`;
  const [btnStats, setBtnStatus] = useState({
    editSub: false,
    deleteSub: false,
  });
  const {
    subjects = [],
    loading,
    error,
    dispatch,
    departmentsList = [],
  } = useSubjectContext() || {};

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
        <span className="text-4xl">{error}</span>
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
            <form className="mx-1 flex-1 justify-between flex bg-[#F5F5F5] rounded-4xl">
              {departmentsList.map((department, index) => (
                <input
                  className="btn rounded-4xl border-0 checked:bg-[#5603AD]"
                  type="checkbox"
                  name="frameworks"
                  aria-label={department}
                />
              ))}
              <input
                className="btn rounded-4xl bg-[#5603AD] text-gray-200 "
                type="reset"
                value="×"
              />
            </form>

            {/* Edit Subjects Buttons */}
            {!btnStats.deleteSub && !btnStats.editSub ? (
              <div className="flex flex-2 justify-end *:mx-1">
                <button className="btn bg-[#F7B801]">
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Subject</span>
                </button>
                <button
                  className="btn bg-success"
                  onClick={() => setBtnStatus({ ...btnStats, editSub: true })}
                >
                  <PencilIcon className="w-5 x-5" />
                  <span>Edit Subjects</span>
                </button>
                <button
                  className="btn bg-error"
                  onClick={() => setBtnStatus({ ...btnStats, deleteSub: true })}
                >
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete Subjects</span>
                </button>
              </div>
            ) : null}
            {btnStats.deleteSub ? (
              <div className="flex flex-2 justify-end *:mx-1">
                <button className="btn bg-error">
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete Selected Subjects</span>
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    setBtnStatus({ ...btnStats, deleteSub: false })
                  }
                >
                  <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                  <span>Cancel Deletion</span>
                </button>
              </div>
            ) : null}
            {btnStats.editSub ? (
              <div className="flex flex-2 justify-end *:mx-1">
                <button
                  className="btn"
                  onClick={() => setBtnStatus({ ...btnStats, editSub: false })}
                >
                  <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                  <span>Exit Edit</span>
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex">
            {/* Dropdown Filters */}
            <div className="flex flex-3 mr-2 [&>div]:mx-2">
              <div className="flex-1">
                <input
                  type="number"
                  className="input join-item w-full validator"
                  placeholder="Year/Grade"
                  min="0"
                  max="12"
                />
              </div>
              <div className="flex-1">
                <select className="select">
                  <option disabled={true} value={""} selected> Semester </option>
                  <option value={"1"}>1</option>
                  <option value={"2"}>2</option>
                  <option value={"3"}>3</option>
                  <option value={"4"}>4</option>
                </select>
              </div>
            </div>
            {/* Search and Sort */}
            <div className="flex justify-end flex-2">
              {/* Search */}
              <div className="mx-3 flex-2">
                <input
                  type="text"
                  class="input"
                  placeholder="Search for Subject Name"
                />
              </div>
              {/* Sort */}
              <div>
                <button className="btn">
                  <BarsArrowDownIcon className="w-5 h-5" />
                  <span>Sort By</span>
                </button>
              </div>
            </div>
            {/* Sort and Search */}
          </div>
        </div>
        {/* Table */}
        <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table table-zebra">
            {/* Headers */}
            <thead className="bg-[#F5F5F5]">
              <tr>
                {btnStats.deleteSub ? <th></th> : null}
                <th>Code</th>
                <th>Name</th>
                <th>Units</th>
                <th>Department</th>
                <th>Year/Grade Level</th>
                <th>Semester</th>
                {btnStats.editSub ? <th></th> : null}
              </tr>
            </thead>
            <tbody>
              {/* Rows from DB */}
              {subjects.map((subject) => (
                <tr key={subject._id} value={subject.code}>
                  {btnStats.deleteSub ? (
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs mx-auto"
                      />
                    </td>
                  ) : null}
                  <td>{subject.code}</td>
                  <td>{subject.subject_name}</td>
                  <td>{subject.units}.00</td>
                  <td>{subject.department}</td>
                  <td>{subject.department === "IS" ? ("Grade") : ("Year")} {subject.year_level}</td>
                  <td>Semester {subject.semester}</td>
                  {btnStats.editSub ? (
                    <td className="items-center">
                      <button className="btn btn-success mx-auto">
                        <PencilIcon className="w-5 x-5" />
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSubjects;

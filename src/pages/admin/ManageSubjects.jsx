import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSubjectContext } from "../../contexts/SubjectContext";
import {
  ArrowLeftEndOnRectangleIcon,
  BarsArrowDownIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useModal } from "../../contexts/ModalContext";

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
    filteredData = [],
    loading,
    error,
    dispatch,
    departmentsList = [],
    setFiltersParams,
    filterParams,
  } = useSubjectContext() || {};
  const { setSubMod, deleteSubj, setDeleteSubj } = useModal();

  const updateDelete = (event) => {
    const e = event.target;
    setDeleteSubj((prev) => {
      if (e.checked) {
        return { ...prev, subjList: [...prev.subjList, e.value] };
      } else {
        return {
          ...prev,
          subjList: prev.subjList.filter((entry) => entry !== e.value),
        };
      }
    });
  };

  useEffect(() => {
    console.log(deleteSubj.subjects);
  }, [deleteSubj]);

  function updateFilter(key) {
    return function (event) {
      const e = event.target;
      if (key === "year" || key === "semester") {
        setFiltersParams((prev) => ({
          ...prev,
          [key]: e.value === "" ? null : Number(e.value),
        }));
      } else if (key === "department") {
        setFiltersParams((prev) => {
          let updatedDepartments;

          if (e.checked) {
            updatedDepartments = [...prev.department, e.value];
          } else {
            updatedDepartments = prev.department.filter(
              (dep) => dep !== e.value
            );
          }
          return { ...prev, department: updatedDepartments };
        });
      } else if (key === "clearOthers") {
        setFiltersParams((prev) => ({
          ...prev,
          name: null,
          year: null,
          semester: null,
        }));
      } else {
        setFiltersParams((prev) => ({ ...prev, [key]: e.value }));
      }
    };
  }

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
                  value={department}
                  key={index}
                  onChange={updateFilter("department")}
                />
              ))}
            </form>

            {/* Edit Subjects Buttons */}
            {!btnStats.deleteSub && !btnStats.editSub ? (
              <div className="flex flex-3 justify-end *:mx-1">
                <button
                  className="btn bg-[#F7B801]"
                  onClick={() =>
                    setSubMod((prev) => ({
                      ...prev,
                      status: true,
                      _id: "",
                      method: "Add",
                    }))
                  }
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add Subject</span>
                </button>

                <button
                  className="btn bg-success"
                  onClick={() => setBtnStatus({ ...btnStats, editSub: true })}
                >
                  <PencilSquareIcon className="w-5 x-5" />
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
              <div className="flex flex-3 justify-end *:mx-1">
                <button
                  className="btn btn-error"
                  disabled={deleteSubj.subjList.length === 0}
                  onClick={() =>
                    setDeleteSubj((prev) => ({
                      ...prev,
                      status: true
                    }))
                  }
                >
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete Selected Subjects</span>
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    setDeleteSubj((prev) => ({
                      ...prev,
                      subjList: [],
                    }));
                    setBtnStatus({ ...btnStats, deleteSub: false });
                  }}
                >
                  <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                  <span>Exit Deletion View</span>
                </button>
              </div>
            ) : null}

            {btnStats.editSub ? (
              <div className="flex flex-3 justify-end *:mx-1">
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
            <div className="flex flex-2 mr-2 [&>div]:mx-2">
              <div className="flex-1">
                <input
                  type="number"
                  className="input join-item w-full"
                  placeholder="Year/Grade"
                  min="1"
                  max="12"
                  value={filterParams?.year ?? ""}
                  onChange={updateFilter("year")}
                />
              </div>
              <div className="flex-1">
                <select
                  className="select"
                  onChange={updateFilter("semester")}
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
                    onClick={updateFilter("clearOthers")}
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
                  onChange={updateFilter("name")}
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
        {/* Table */}
        <div className="m-5 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          {filteredData.length !== 0 ? (
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

                {filteredData.map((subject) => (
                  <tr key={subject._id} value={subject.code}>
                    {btnStats.deleteSub ? (
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs mx-auto"
                          value={subject._id}
                          key={subject._id}
                          onChange={updateDelete}
                        />
                      </td>
                    ) : null}
                    <td>{subject.code}</td>
                    <td>{subject.subject_name}</td>
                    <td>{subject.units}.00</td>
                    <td>{subject.department}</td>
                    <td>
                      {subject.department === "IS" ? "Grade" : "Year"}{" "}
                      {subject.year_level}
                    </td>
                    <td>Semester {subject.semester}</td>
                    {btnStats.editSub ? (
                      <td className="items-center">
                        <button
                          className="btn btn-success mx-auto"
                          onClick={() =>
                            setSubMod(() => ({
                              status: true,
                              method: "Edit",
                              data: { ...subject },
                            }))
                          }
                        >
                          <PencilSquareIcon className="w-5 x-5" />
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <p className="text-gray-500 text-center py-12">
                No subjects found using your filters...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSubjects;

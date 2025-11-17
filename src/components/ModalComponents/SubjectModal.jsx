import { ArrowRightStartOnRectangleIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useModal } from "../../contexts/ModalContext";
import { useSubjectContext } from "../../contexts/SubjectContext";
import { useState } from "react";
import api from "../../api";

const SubjectModal = () => {
  const { subMod, setSubMod } = useModal();
  const { dispatch, departmentsList, setFiltersParams } = useSubjectContext();
  const { _id, code, subject_name, units, department, year_level, semester } =
    subMod.data;
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !code ||
      !subject_name ||
      !units ||
      !department ||
      !year_level ||
      !semester
    ) {
      return setError("Missing values");
    }

    try {
      const details = { ...subMod.data };
      if (subMod.method === "Add") {
        const res = await api.post("/subjects", details);
        console.log("Forms details added.");
        dispatch({ type: "CREATE_SUBJECT", payload: res.data.data });
      } else if (subMod.method === "Edit") {
        const res = await api.put(`/subjects/${_id}`, details);
        console.log(`${code} successfully edited!`);
        dispatch({ type: "EDIT_SUBJECT", payload: res.data.data });
      }

      setSubMod({
        status: false,
        method: "",
        data: {
          _id: "",
          code: "",
          subject_name: "",
          units: 0,
          department: "",
          year_level: 0,
          semester: 0,
        },
      });

    } catch (error) {
      console.log(error.response?.data?.error || "An error occurred");
      setError(error.response?.data?.message);
    }
  };

  return (
    <dialog id="my_modal_1" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg flex w-auto justify-center">
          {subMod.method} Subjects
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="py-5 flex w-full">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 flex flex-col">
              <div className="flex *:m-2 *:w-full">
                <div>
                  <label className="label">Subject Code</label>
                  <input
                    required
                    type="text"
                    className="input w-full validator"
                    placeholder="Subject Code"
                    value={code ?? ""}
                    onChange={(event) =>
                      setSubMod((prev) => ({
                        ...prev,
                        data: { ...prev.data, code: event.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label">College</label>
                  <select
                    required
                    className="select w-full validator"
                    value={department ?? ""}
                    onChange={(event) =>
                      setSubMod((prev) => ({
                        ...prev,
                        data: { ...prev.data, department: event.target.value },
                      }))
                    }
                  >
                    <option disabled={true} value={""} defaultValue>
                      Pick a college
                    </option>
                    {departmentsList.map((department, index) => (
                      <option key={index} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex *:m-2 *:w-full">
                <div>
                  <label className="label">Year/Grade</label>
                  <input
                    required
                    type="number"
                    className="input join-item w-full validator"
                    placeholder="Year/Grade"
                    min="1"
                    max="12"
                    value={year_level ?? ""}
                    onChange={(event) =>
                      setSubMod((prev) => ({
                        ...prev,
                        data: { ...prev.data, year_level: event.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label">Semester</label>
                  <input
                    required
                    type="number"
                    className="input join-item w-full validator"
                    placeholder="Year/Grade"
                    min="1"
                    max="4"
                    value={semester ?? ""}
                    onChange={(event) =>
                      setSubMod((prev) => ({
                        ...prev,
                        data: { ...prev.data, semester: event.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="label">Units</label>
                  <input
                    required
                    type="number"
                    className="input join-item w-full validator"
                    placeholder="Year/Grade"
                    min="1"
                    value={units ?? ""}
                    onChange={(event) =>
                      setSubMod((prev) => ({
                        ...prev,
                        data: { ...prev.data, units: event.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col m-2">
                <label className="label">Subject Name</label>
                <input
                  required
                  type="text"
                  className="input w-full validator"
                  placeholder="Name"
                  value={subject_name ?? ""}
                  onChange={(event) =>
                    setSubMod((prev) => ({
                      ...prev,
                      data: { ...prev.data, subject_name: event.target.value },
                    }))
                  }
                />
              </div>
            </fieldset>
          </div>
          {error ? (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {error}</span>
            </div>
          ) : null}
          <div className="modal-action flex justify-between">
            {subMod.method === "Add" ? (
              <button className="btn btn-success" type="submit">
                <PlusIcon className="w-5 h-5" />
                Add
              </button>
            ) : subMod.method === "Edit" ? (
              <button className="btn btn-success" type="submit">
                <PencilIcon className="w-5 x-5" />
                Edit
              </button>
            ) : null}
            <button
              className="btn"
              onClick={(event) => {
                event.preventDefault();
                setSubMod({
                  status: false,
                  method: "",
                  data: {
                    _id: "",
                    code: "",
                    subject_name: "",
                    units: 0,
                    department: "",
                    year_level: 0,
                    semester: 0,
                  },
                });
              }}
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default SubjectModal;

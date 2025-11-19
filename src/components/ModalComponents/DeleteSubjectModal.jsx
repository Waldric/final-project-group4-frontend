import {
  ArrowRightStartOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useModal } from "../../contexts/ModalContext";
import { useSubjectContext } from "../../contexts/SubjectContext";
import { useState } from "react";
import api from "../../api";

const DeleteSubjectModal = () => {
  const { deleteSubj, setDeleteSubj } = useModal();
  const { dispatch, setFiltersParams } = useSubjectContext();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.delete("/subjects", {
        data: { ids: deleteSubj.subjList },
      });
      console.log("Entries successfully deleted.");
      dispatch({ type: "DELETE_SUBJECTS", payload: deleteSubj.subjList });

      setDeleteSubj((prev) => ({
        status: false,
        subjList: [],
      }));
    } catch (error) {
      console.log(error.response?.data?.error || "An error occurred");
      setError(error.response?.data?.message);
    }
  };

  return (
    <dialog id="my_modal_1" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg flex w-auto justify-center">
          Delete Subjects
        </h3>
        <div className="flex justify-center text-center my-5 text-gray-800 fon">
          <span className="">
            Are you sure you want to delete these subjects?
          </span>
          <div className="flex flex-col">
            {deleteSubj.subjList.map((subject, index) => (
              <span value={subject} key={index}>
                {subject}
              </span>
            ))}
          </div>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit(event);
          }}
        >
          <div className="flex w-full">
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
            <div className="modal-action m-0 flex w-full justify-between">
              <button className="btn btn-error" type="submit">
                <TrashIcon className="w-5 h-5" />
                Delete Subjects
              </button>

              <button
                className="btn"
                onClick={(event) => {
                  event.preventDefault();
                  setDeleteSubj((prev) => ({
                    ...prev,
                    status: false,
                  }));
                }}
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default DeleteSubjectModal;

// src/contexts/ModalContext.jsx
import { createContext, useContext, useState } from "react";

const ModalContext = createContext({ data: null });

export function ModalProvider({ children }) {
  /* -------------------- SUBJECT MODAL -------------------- */
  const [subMod, setSubMod] = useState({
    status: false,
    method: "", // "Add" or "Edit"
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

  const [deleteSubj, setDeleteSubj] = useState({
    status: false,
    subjList: [], // array of subject _id
  });

  /* -------------------- ACCOUNT MODAL -------------------- */
  const [accMod, setAccMod] = useState({
    status: false,
    method: "", // "Add" or "Edit"
    data: {
      _id: "",
      account_id: "ACCT-000", // default as requested
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      user_type: "Student",
      department: "",
      photo: "",
    },
  });

  const [deleteAcc, setDeleteAcc] = useState({
    status: false,
    accList: [], // array of account _id (or whatever you push from ManageAccounts)
  });

  return (
    <ModalContext.Provider
      value={{
        // Subjects
        subMod,
        setSubMod,
        deleteSubj,
        setDeleteSubj,

        // Accounts
        accMod,
        setAccMod,
        deleteAcc,
        setDeleteAcc,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw Error("useModal must be used inside a ModalProvider");
  }

  return context;
};

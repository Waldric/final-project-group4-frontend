import { createContext, useContext, useState } from "react";

const ModalContext = createContext({ data: null });

export function ModalProvider({ children }) {
  const [subMod, setSubMod] = useState({
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

  const [deleteSubj, setDeleteSubj] = useState({
    status: false,
    subjList: [],
  });

  return (
    <ModalContext.Provider
      value={{ subMod, setSubMod, deleteSubj, setDeleteSubj }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw Error("useModalContext must be used inside a ModalContextProvider");
  }

  return context;
};

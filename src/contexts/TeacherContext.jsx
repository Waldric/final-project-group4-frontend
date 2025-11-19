import { createContext, useContext, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import api from "../api";

const TeacherContext = createContext({ data: null });

export function TeacherProvider({ children }) {
  const [indivTeacher, setIndivTeacher] = useState({
    loadingStatus: false,
    errorStatus: null,
    teacher: null,
  });

  const requestIndivTeacher = async (user) => {
    if (user.user_type !== "Teacher") return;

    setIndivTeacher((prev) => ({
      ...prev,
      loadingStatus: true,
      errorStatus: null,
    }));

    try {
      const res = await api.get(`/teachers/account/${user._id}`);
      setIndivTeacher({
        loadingStatus: false,
        errorStatus: null,
        teacher: res.data.data
      });
    } catch (error) {
      console.error("Error fetching", error);
      setIndivTeacher({
        loadingStatus: false,
        errorStatus: error,
        teacher: null
      });
    }
  };

  return (
    <TeacherContext.Provider value={{ requestIndivTeacher, ...indivTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
}

export const useTeacher = () => {
  const context = useContext(TeacherContext);

  if (!context) {
    throw Error("useTeacherContext must be inside a TeacherContextProvider");
  }

  return context;
};

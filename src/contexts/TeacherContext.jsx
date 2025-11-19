import { createContext, useContext, useEffect, useReducer } from "react";
import { useFetch } from "../hooks/useFetch";

const TeacherContext = createContext({ data: null });

export const teacherReducer = (state, action) => {
  switch (action.type) {
    case "SET_TEACHERS":
      return {
        ...state,
        teachers: action.payload ?? [],
        filteredTeachers: action.payload ?? [],
      };
    case "SET_FILTERED_TEACHERS":
      return { ...state, filteredTeachers: action.payload ?? [] };
    case "ADJUST_TEACHER_SCHEDULE":
      const newTeacher = state.teachers.map((tchr) =>
        tchr._id === action.payload._id ? {...tchr, subjects: action.payload.subjects} : tchr
      );
      return {
        ...state,
        teachers: newTeacher ?? [],
        filteredTeachers: newTeacher ?? [],
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const TeacherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(teacherReducer, {
    teachers: [],
    filteredTeachers: [],
    loading: false,
    error: null,
  });

  const { data, loading, error } = useFetch("/teachers");
  useEffect(() => {
    dispatch({ type: "SET_TEACHERS", payload: data });
    dispatch({ type: "SET_LOADING", payload: loading });
    dispatch({ type: "SET_ERROR", payload: error });
    console.log(data);
  }, [data, loading, error]);

  return (
    <TeacherContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeachersContext = () => {
  const context = useContext(TeacherContext);

  if (!context) {
    throw Error(
      "useTeachersContext must be used inside a TeacherContextProvider"
    );
  }

  return context;
};

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { useFetch } from "../hooks/useFetch";

const SubjectContext = createContext({ data: null });

export const subjectsReducer = (state, action) => {
  switch (action.type) {
    case "SET_SUBJECTS":
      return {
        ...state,
        subjects: action.payload ?? [],
        filteredSubjects: action.payload ?? [],
      };
    case "SET_FILTERED_SUBJECTS":
      return {
        ...state,
        filteredSubjects: action.payload ?? [],
      };
    case "CREATE_SUBJECT":
      return {
        ...state,
        subjects: [action.payload, ...(state.subjects || [])],
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
  }
};

export const SubjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subjectsReducer, {
    subjects: [],
    filteredSubjects: [],
    loading: false,
    error: null,
  });
  const [filter, setFilters] = useState({
    department: [],
    year: null,
    semester: null,
    name: null
  });

  // Fetch all subjects
  const { data, loading, error } = useFetch("/subjects");
  useEffect(() => {
    dispatch({ type: "SET_SUBJECTS", payload: data });
    dispatch({ type: "SET_LOADING", payload: loading });
    dispatch({ type: "SET_ERROR", payload: error });
  }, [data, loading, error]);

  const departmentsList = Array.from(
    new Set((data ?? []).map((d) => d.department).filter(Boolean))
  );

  return (
    <SubjectContext.Provider value={{ ...state, dispatch, departmentsList }}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubjectContext = () => {
  const context = useContext(SubjectContext);

  if (!context) {
    throw Error(
      "useSubjectContext must be used inside a SubjectContextProvider"
    );
  }

  return context;
};

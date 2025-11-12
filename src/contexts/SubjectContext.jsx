import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useFetch } from "../hooks/useFetch";

const SubjectContext = createContext({ data: null });

export const subjectsReducer = (state, action) => {
  switch (action.type) {
    case "SET_SUBJECTS":
      return {
        ...state,
        subjects: action.payload ?? [],
        filteredData: action.payload ?? [],
      };
    case "SET_FILTERED_SUBJECTS":
      return {
        ...state,
        filteredData: action.payload ?? [],
      };
    case "CREATE_SUBJECT":
      const createUpdSubj = [action.payload, ...(state.subjects || [])];
      return {
        ...state,
        subjects: createUpdSubj,
        filteredData: createUpdSubj,
      };
    case "EDIT_SUBJECT":
      const editUpdSubj = state.subjects.map((sub) =>
        sub._id === action.payload._id ? action.payload : sub
      );
      return {
        ...state,
        subjects: editUpdSubj,
        filteredData: editUpdSubj,
      };
    case "DELETE_SUBJECTS":
      const delUpdSubj = state.subjects.filter(
        (sub) => !action.payload.includes(sub._id)
      );
      return {
        ...state,
        subjects: delUpdSubj,
        filteredData: delUpdSubj,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return;
  }
};

export const SubjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subjectsReducer, {
    subjects: [],
    filteredData: [],
    loading: false,
    error: null,
  });

  // Fetch all subjects
  const { data, loading, error } = useFetch("/subjects");
  useEffect(() => {
    dispatch({ type: "SET_SUBJECTS", payload: data });
    dispatch({ type: "SET_LOADING", payload: loading });
    dispatch({ type: "SET_ERROR", payload: error });
  }, [data, loading, error]);

  // Gets list of colleges
  const departmentsList = Array.from(
    new Set((data ?? []).map((d) => d.department).filter(Boolean))
  );

  const [filterParams, setFiltersParams] = useState({
    name: null,
    department: [],
    year: null,
    semester: null,
  });

  // Filters data based on parameters from filter
  const passFilters = (filterParams) => {
    let filtered = state.subjects;

    filtered = filtered.filter((d) => {
      const nameMatches =
        !filterParams.name ||
        d.subject_name.toLowerCase().includes(filterParams.name.toLowerCase());

      const depMatches =
        filterParams.department.length === 0 ||
        filterParams.department.includes(d.department);

      const yearMatches =
        !filterParams.year || filterParams.year === d.year_level;

      const semMatches =
        !filterParams.semester || filterParams.semester === d.semester;

      return nameMatches && depMatches && yearMatches && semMatches;
    });
    dispatch({ type: "SET_FILTERED_SUBJECTS", payload: filtered });
  };

  useEffect(() => {
    passFilters(filterParams);
  }, [filterParams, state.subjects]);

  return (
    <SubjectContext.Provider
      value={{
        ...state,
        dispatch,
        departmentsList,
        filterParams,
        passFilters,
        setFiltersParams,
      }}
    >
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

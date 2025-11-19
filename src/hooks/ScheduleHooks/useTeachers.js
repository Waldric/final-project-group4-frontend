import { useState, useEffect } from "react";
import { getTeachers } from "../services/teacher.api";

export default function useTeachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    getTeachers().then((data) => setTeachers(data));
  }, []);

  return teachers;
}

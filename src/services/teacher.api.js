import api from "../api";

export const getTeachers = async () => {
  const res = await api.get("/teachers");
  return res.data.data || [];
};

import api from "../api";

// GET schedule by student
export const getScheduleByStudent = async (studentId) => {
  const res = await api.get("/schedules", {
    params: { student_ref: studentId },
  });
  return res.data.data.find((s) => s.student_ref?._id === studentId) || null;
};

// DELETE one or more schedule entries
export const deleteScheduleEntries = async (scheduleId, courseCodes) => {
  return api.patch(`/schedules/${scheduleId}/delete-entries`, {
    course_codes: courseCodes,
  });
};

// ASSIGN teacher
export const assignTeacher = async (scheduleId, courseCode, teacherId) => {
  return api.patch(`/schedules/${scheduleId}/assign-teacher`, {
    course_code: courseCode,
    teacher_ref: teacherId,
  });
};

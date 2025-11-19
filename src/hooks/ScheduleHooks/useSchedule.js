import { useState, useEffect } from "react";
import { getScheduleByStudent } from "../services/schedule.api";

export default function useSchedule(studentId) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSchedule = async () => {
    setLoading(true);
    const result = await getScheduleByStudent(studentId);
    setSchedule(result);
    setLoading(false);
  };

  useEffect(() => {
    if (studentId) loadSchedule();
  }, [studentId]);

  return {
    schedule,
    loading,
    reload: loadSchedule,
  };
}

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import api from "../../api";
import StudentsListView from "../../components/TeacherMyClasses/StudentsListView";
import AssignedSubjectsView from "../../components/TeacherMyClasses/AssignedSubjectsView";

const TeacherClasses = () => {
  const [view, setView] = useState("list"); // "list" | "students"
  const [subjectID, setSubjectID] = useState({
    id: null,
    code: null,
  });
  const [selectedSubject, setSelectedSubject] = useState({
    data: [],
    error: null,
    loading: false,
  });

  const { user } = useAuth();
  const {
    data: teacher,
    loading,
    error,
  } = useFetch(`/teachers/account/${user.id}`);

  useEffect(() => {
    if (!subjectID.id) {
      return;
    }

    const fetchStudents = async () => {
      setSelectedSubject({
        loading: true,
        error: null,
        data: [],
      });

      try {
        const res = await api.get(
          `/schedules/students/${subjectID.id}/${teacher._id}`
        );
        const data = res.data.data ?? [];

        setSelectedSubject({
          loading: false,
          error: null,
          data: data,
        });
      } catch (err) {
        console.error(err);
        setSelectedSubject({
          loading: false,
          error: err.response?.data?.message || "Unexpected Error.",
          data: [],
        });
      }
    };

    fetchStudents();
  }, [subjectID.id, teacher?._id]);

  const handleViewStudents = (id, code) => {
    setSubjectID({ id, code });
    setView("students");
  };

  const handleBackToClasses = () => {
    setSubjectID({ id: null, code: null });
    setSelectedSubject({ data: [], error: null, loading: false });
    setView("list");
  };

  if (loading || !teacher?.subjects) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="text-4xl">{error}</span>
      </div>
    );
  }

  // Individual Student View
  if (view === "students") {
    return (
      <StudentsListView
        students={selectedSubject.data}
        loading={selectedSubject.loading}
        error={selectedSubject.error}
        onBack={handleBackToClasses}
        subjectCode={subjectID.code}
      />
    );
  }

  // Default View
  return (
    <AssignedSubjectsView
      teacher={teacher}
      onViewStudents={handleViewStudents}
    />
  );
};

export default TeacherClasses;

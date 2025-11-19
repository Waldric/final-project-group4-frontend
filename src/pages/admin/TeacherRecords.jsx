import { useState } from "react";
import Header from "../../components/Header";
import { useTeachersContext } from "../../contexts/TeacherContext";
import { useSubjectContext } from "../../contexts/SubjectContext";
import ListOfTeachers from "./ListOfTeachers";
import TeacherScheduleView from "./TeacherScheduleView";

const TeacherRecords = () => {
  const headerLocation = "Teacher Records";
  const headerSubtext = `View real-time statistics, recent activities, and key 
                      updates across students, teachers, payments, and 
                      announcements — all in one place.`;
  const { filteredTeachers, loading, error } = useTeachersContext();
  const { departmentsList } = useSubjectContext();
  const [view, setView] = useState("list");
  const [selectedTeacher, setSelectedTeacher] = useState({
    teacher_code: null,
    teacher_id: null,
  });

  const handleViewTeacher = (teacherId, teacherCode) => {
    setSelectedTeacher({
      teacher_code: teacherCode,
      teacher_id: teacherId,
    });
    setView("teacher");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedTeacher({
      teacher_code: null,
      teacher_id: null,
    });
  };

  if (loading) {
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

  if (view === "teacher") {
    return (
      <TeacherScheduleView
        teacherId={selectedTeacher.teacher_id}
        teacherCode={selectedTeacher.teacher_code}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header location={headerLocation} subheader={headerSubtext} />
      <ListOfTeachers
        teachers={filteredTeachers}
        departmentsList={departmentsList}
        onViewTeacher={handleViewTeacher}
      />
    </div>
  );
};

export default TeacherRecords;

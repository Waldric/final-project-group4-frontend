export default function ScheduleInfoCard({ student, schedule }) {
  if (!student) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
      <p>
        <strong>Name:</strong> {student.accounts_ref?.firstname}{" "}
        {student.accounts_ref?.lastname}
      </p>
      <p>
        <strong>Student Number:</strong> {student.student_number}
      </p>
      <p>
        <strong>Department:</strong> {student.department}
      </p>
      <p>
        <strong>Year Level:</strong> Grade {student.year_level}
      </p>

      {schedule && (
        <p className="mt-2 text-gray-600">
          <strong>Semester:</strong> {schedule.semester} ·{" "}
          <strong>AY:</strong> {schedule.acad_year}
        </p>
      )}
    </div>
  );
}

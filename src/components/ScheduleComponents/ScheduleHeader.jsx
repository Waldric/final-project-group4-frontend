export default function ScheduleHeader({ schedule }) {
  return (
    <div className="text-sm text-gray-600 mb-3">
      {schedule ? (
        <>
          {schedule.semester} Semester · AY {schedule.acad_year}
        </>
      ) : (
        "No schedule info"
      )}
    </div>
  );
}

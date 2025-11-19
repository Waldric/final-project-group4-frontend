import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../api";

export default function RecordGrades() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [gradeRecord, setGradeRecord] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state for grades - includes teacher selection
  const [editingGrades, setEditingGrades] = useState({});

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch student info
      const studentRes = await api.get(`/students/${studentId}`);
      const studentData = studentRes.data.data;
      setStudent(studentData);

      // Fetch all teachers
      const teachersRes = await api.get("/teachers");
      setTeachers(teachersRes.data.data || []);

      // Fetch student's grades
      const gradesRes = await api.get(`/grades?studentId=${studentId}`);
      const gradeData = gradesRes.data.data[0]; // Assuming one record per student
      setGradeRecord(gradeData);

      // Fetch subjects for the student's department and year level
      const subjectsRes = await api.get("/subjects");
      const filteredSubjects = subjectsRes.data.data.filter(
        (sub) =>
          sub.department === studentData.department &&
          sub.year_level === studentData.year_level
      );
      setSubjects(filteredSubjects);

      // Initialize editing grades
      const gradesMap = {};
      
      if (gradeData && gradeData.grades) {
        // Load existing grades
        gradeData.grades.forEach((g) => {
          gradesMap[g.subject_ref._id] = {
            percent: g.percent,
            teacher_ref: g.teacher_ref._id,
            graded_date: g.graded_date,
          };
        });
      }

      // Initialize empty grades for subjects without grades
      filteredSubjects.forEach((subject) => {
        if (!gradesMap[subject._id]) {
          // Find teacher who teaches this subject
          const teacherForSubject = teachersRes.data.data.find((teacher) =>
            teacher.subjects?.some((s) => s.subject_id?._id === subject._id)
          );

          gradesMap[subject._id] = {
            percent: "",
            teacher_ref: teacherForSubject?._id || "",
            graded_date: null,
          };
        }
      });

      setEditingGrades(gradesMap);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load student data");
      setLoading(false);
    }
  };

  const handleGradeChange = (subjectId, value) => {
    setEditingGrades((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        percent: value === "" ? "" : Number(value),
      },
    }));
  };

  const handleTeacherChange = (subjectId, teacherId) => {
    setEditingGrades((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        teacher_ref: teacherId,
      },
    }));
  };

  const handleSaveGrade = async (subjectId) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const gradeData = editingGrades[subjectId];

      // Validation
      if (!gradeData.teacher_ref) {
        setError("Please select a teacher for this subject");
        setSaving(false);
        return;
      }

      if (gradeData.percent === "" || gradeData.percent < 0 || gradeData.percent > 100) {
        setError("Please enter a valid grade between 0 and 100");
        setSaving(false);
        return;
      }

      // Check if grade record exists for this student
      if (gradeRecord) {
        // Check if this specific subject has a grade
        const existingGrade = gradeRecord.grades?.find(
          (g) => g.subject_ref._id === subjectId
        );

        if (existingGrade) {
          // Update existing grade for this subject
          await api.put(
            `/grades/student/${student.student_number}/subject/${subjectId}`,
            {
              teacher_ref: gradeData.teacher_ref,
              percent: gradeData.percent,
            }
          );
        } else {
          // Add new subject grade to existing record
          await api.put(`/grades/${gradeRecord._id}`, {
            ...gradeRecord,
            grades: [
              ...gradeRecord.grades,
              {
                teacher_ref: gradeData.teacher_ref,
                subject_ref: subjectId,
                percent: gradeData.percent,
                graded_date: new Date(),
              },
            ],
          });
        }
      } else {
        // Create new grade record for student
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        
        // Determine semester: Jan-May = 2, Jun-Oct = 1, Nov-Dec = 2 (next year prep)
        const semester = currentMonth >= 5 && currentMonth <= 9 ? 1 : 2;

        await api.post("/grades", {
          student_ref: studentId,
          student_number: student.student_number,
          semester: semester,
          acad_year: `${currentYear}-${currentYear + 1}`,
          grades: [
            {
              teacher_ref: gradeData.teacher_ref,
              subject_ref: subjectId,
              percent: gradeData.percent,
              graded_date: new Date(),
            },
          ],
        });
      }

      setSuccess("Grade saved successfully!");
      await fetchData();
      setSaving(false);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save grade");
      setSaving(false);
    }
  };

  const getGradeStatus = (percent) => {
    if (percent === null || percent === undefined || percent === "") return "Not Graded";
    return percent >= 75 ? "Passed" : "Failed";
  };

  const getStatusBadge = (percent) => {
    const status = getGradeStatus(percent);
    if (status === "Not Graded") {
      return <span className="badge badge-outline">Not Graded</span>;
    }
    if (status === "Passed") {
      return (
        <span className="badge badge-outline border-green-500 text-green-500">
          Passed
        </span>
      );
    }
    return (
      <span className="badge badge-outline border-red-500 text-red-500">
        Failed
      </span>
    );
  };

  // Get teachers who can teach a specific subject
  const getTeachersForSubject = (subjectId) => {
    return teachers.filter((teacher) =>
      teacher.subjects?.some((s) => s.subject_id?._id === subjectId)
    );
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="text-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="alert alert-error">
          <span>Student not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <Header
        location="Record Grades"
        subheader={`Manage grades for ${student.accounts_ref?.firstname} ${student.accounts_ref?.lastname}`}
      />

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              {student.accounts_ref?.photo ? (
                <img src={student.accounts_ref.photo} alt="Student" />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-2xl text-gray-600">
                  {student.accounts_ref?.firstname?.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">
              {student.accounts_ref?.firstname} {student.accounts_ref?.lastname}
            </h3>
            <p className="text-gray-600">
              {student.student_number} • {student.department} •{" "}
              {student.department === "IS"
                ? `Grade ${student.year_level}`
                : `Year ${student.year_level}`}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}

        {/* Grades Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Units</th>
                <th>Semester</th>
                <th>Teacher</th>
                <th className="text-center">Grade (%)</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No subjects found for this student
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => {
                  const currentGrade = editingGrades[subject._id];
                  const percent = currentGrade?.percent ?? "";
                  const teacherId = currentGrade?.teacher_ref ?? "";
                  const availableTeachers = getTeachersForSubject(subject._id);

                  return (
                    <tr key={subject._id}>
                      <td className="font-medium">{subject.code}</td>
                      <td>{subject.subject_name}</td>
                      <td>{subject.units}</td>
                      <td>Semester {subject.semester}</td>
                      <td>
                        <select
                          className="select select-bordered select-sm w-full max-w-xs"
                          value={teacherId}
                          onChange={(e) =>
                            handleTeacherChange(subject._id, e.target.value)
                          }
                        >
                          <option value="">Select Teacher</option>
                          {availableTeachers.map((teacher) => (
                            <option key={teacher._id} value={teacher._id}>
                              {teacher.account_ref?.firstname}{" "}
                              {teacher.account_ref?.lastname}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          className="input input-bordered input-sm w-24 text-center"
                          value={percent}
                          onChange={(e) =>
                            handleGradeChange(subject._id, e.target.value)
                          }
                          placeholder="--"
                        />
                      </td>
                      <td className="text-center">{getStatusBadge(percent)}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary bg-[#5603AD] border-[#5603AD] hover:bg-[#3e047b]"
                          onClick={() => handleSaveGrade(subject._id)}
                          disabled={
                            saving ||
                            !teacherId ||
                            percent === "" ||
                            percent === null
                          }
                        >
                          {saving ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            "Save"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Grade Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Grading System:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Passing Grade: 75% and above</li>
            <li>• Failing Grade: Below 75%</li>
            <li>• Grade Range: 0 - 100</li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/dashboard/admin/student-records")}
          >
            ← Back to Student Records
          </button>
        </div>
      </div>
    </div>
  );
}
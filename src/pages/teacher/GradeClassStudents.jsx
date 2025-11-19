// src/pages/teacher/GradeClassStudents.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import Header from "../../components/Header";
import { ArrowLeftIcon, UserCircleIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import EditGradeModal from "../../components/EditGradeModal";

const GradeClassStudents = () => {
  const { teacherId, subjectId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(
    `/grades/teacher/${teacherId}/subject/${subjectId}/students`
  );

  const students = Array.isArray(data) ? data : data?.data || data || [];

  const [editingStudent, setEditingStudent] = useState(null);

  const handleEditClick = (student) => {
    setEditingStudent({
      ...student,
      teacherId: teacherId,
      subjectId: subjectId,
      gradeId: student.grade_id,
    });
  };

  const handleGradeSaved = () => {
    setEditingStudent(null);
    // Optional: refetch instead of reload
    window.location.reload();
  };

  return (
    <div className="flex-1 p-4 md:p-8 bg-[#F5F5FB]">
      <Header location="Class Grades" subheader="View and manage student grades" />

      <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-6 text-gray-600 hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Classes
        </button>

        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Enrolled Students ({students.length})
        </h2>

        {/* Loading & Error States */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="skeleton w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-32" />
                  <div className="skeleton h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg">
            <span>Error: {error.message || "Please try again."}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && students.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <UserCircleIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No students enrolled in this class yet.</p>
          </div>
        )}

        {/* Students Table */}
        {!loading && !error && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-left">
                  <th>Student</th>
                  <th>Student Number</th>
                  <th>Grade</th>
                  <th>Date Graded</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id || s.student_number} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-circle w-10 h-10">
                            <img
                              src={s.photo || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                              alt={`${s.firstname} ${s.lastname}`}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {s.firstname} {s.lastname}
                          </div>
                          <div className="text-xs text-gray-500">{s.course}</div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-sm">{s.student_number}</td>
                    <td>
                      {s.percent !== null && s.percent !== undefined ? (
                        <span className={`font-bold text-lg ${s.percent >= 75 ? "text-success" : "text-error"}`}>
                          {s.percent}%
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not graded</span>
                      )}
                    </td>
                    <td>
                      {s.graded_date ? (
                        <span className="text-sm">
                          {new Date(s.graded_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* THIS IS THE FIXED STATUS COLUMN WITH PENCIL */}
                    <td>
                      <div className="flex items-center justify-between">
                        <span
                          className={`badge badge-lg font-medium ${
                            s.status === "Passed"
                              ? "badge-success"
                              : s.status === "Failed"
                              ? "badge-error"
                              : "badge-warning"
                          }`}
                        >
                          {s.status}
                        </span>
                        <button
                          onClick={() => handleEditClick(s)}
                          className="btn btn-ghost btn-xs ml-4 opacity-70 hover:opacity-100 transition"
                          title="Edit grade"
                        >
                          <PencilSquareIcon className="w-5 h-5 text-[#5603AD]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL — MUST BE INSIDE RETURN AND AT THE END */}
      {editingStudent && (
        <EditGradeModal
          student={editingStudent}
          onSuccess={handleGradeSaved}
          onClose={() => setEditingStudent(null)}
        />
      )}
    </div>
  );
};

export default GradeClassStudents;
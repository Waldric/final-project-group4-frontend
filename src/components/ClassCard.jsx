// src/components/ClassCard.jsx
import React from "react";

const ClassCard = ({ classInfo, onClick }) => {
  const subject = classInfo.subject_id || {};
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-[#5603AD] transition-all duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          {/* FIXED: Show code + name */}
          <h4 className="text-lg font-bold text-gray-800">
            {subject.code || "N/A"} - {subject.subject_name || "Unknown Subject"}
          </h4>
          {/* FIXED: Real schedule from teacher's assignment */}
          <p className="text-sm text-gray-600 mt-1">
            {classInfo.day || "TBA"} • {classInfo.time || "TBA"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Room: {classInfo.room || "TBA"}</p>
          <p className="text-xs text-gray-500 mt-1">
            {classInfo.num_students || 0} / {classInfo.slots || "?"} students
          </p>
        </div>
      </div>
    </button>
  );
};

export default ClassCard;
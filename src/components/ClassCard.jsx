import React from 'react';

const ClassCard = ({ classInfo, onClick }) => {
  
  // ✅ Use the populated subject data
  const subjectName = classInfo.subject_id?.subject_name || "Unknown Subject";
  const schedule = `Section: C4A | ${classInfo.day || 'TBA'} ${classInfo.time || 'TBA'}`; // Section is not in the schema, hardcoding for now per Figma
  const room = `Room: ${classInfo.room || 'TBA'}`;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-[#5603AD] transition-all duration-300"
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-bold text-gray-800">{subjectName}</h4>
          <p className="text-sm text-gray-600">{schedule}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{room}</p>
        </div>
      </div>
    </button>
  );
};

export default ClassCard;
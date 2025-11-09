import React from "react";
import Footer from "./Footer";

const MainContent = ({ activeItem }) => {
  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-10 bg-[#5603AD] rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              My Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600 flex items-start gap-2">
              <span className="text-yellow-500 mt-0.5">💡</span>
              <span>
                View your academic performance, financial summary, class
                schedule, and the latest announcements all in one place.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <p className="text-gray-500 text-center py-12">
          Dashboard content for{" "}
          <span className="font-semibold text-[#5603AD]">{activeItem}</span>{" "}
          goes here...
        </p>
      </div>
    </div>
  );
};

export default MainContent;

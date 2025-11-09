import Header from "../../components/Header";

const StudentPageSample = () => {
  const headerLocation = "My Grades";
  const headerSubtext = `View your academic performance, subject grades, 
                        and overall GPA for the selected semester.`;

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />
      
      {/* Dashboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <p className="text-gray-500 text-center py-12">
          Dashboard content for student's grades goes here...
        </p>
      </div>
    </div>
  );
};

export default StudentPageSample;

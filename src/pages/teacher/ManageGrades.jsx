import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import ClassCard from "../../components/ClassCard"; 

const ManageGrades = () => {
  const headerLocation = "Student Grades";
  const headerSubtext = "View and manage your assigned classes, student lists, and academic records for the selected semester.";
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch the account data.
  const { data: teacherData, loading, error } = useFetch(`/accounts/${user.account_id}`);

  // We will get the list of classes from the fetched account data
  const classes = teacherData?.subjects || [];

  // Handle click on a class card
  const handleClassClick = (classId) => {
    navigate(`/dashboard/teacher/grades/${classId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="flex justify-center items-center py-48">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <Header location={headerLocation} subheader={headerSubtext} />
        <div className="text-center py-48">
          <p className="text-2xl font-semibold text-red-500">Error loading data</p>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  // Render the main content
  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />
      
      {/* Dashboard Content matching Figma */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        
        {/* Dept. Tabs and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* Tabs */}
          <div role="tablist" className="tabs tabs-boxed bg-gray-100">
            <a role="tab" className="tab tab-active !bg-[#5603AD] text-white">CITE</a>
            <a role="tab" className="tab">CBEAM</a>
            <a role="tab" className="tab">CEAS</a>
            <a role="tab" className="tab">CON</a>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Search..." 
              className="input input-bordered w-full max-w-xs" 
            />
            <select className="select select-bordered">
              <option disabled selected>Sort by Code A-Z</option>
              <option>Sort by Code Z-A</option>
              <option>Sort by Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Class List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Classes ({classes.length})</h3>
          
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <ClassCard 
                key={classItem.subject_id._id} // Use the populated subject_id
                classInfo={classItem}
                onClick={() => handleClassClick(classItem.subject_id._id)} 
              />
            ))
          ) : (
            <p className="text-gray-500 text-center py-12">
              You are not assigned to any classes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageGrades;
import Header from "../../components/Header";

const AdminPageSample = () => {
  const headerLocation = "Manage Accounts";
  const headerSubtext = `View real-time statistics, recent activities, and key 
                      updates across students, teachers, payments, and 
                      announcements — all in one place.`;

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />
      
      {/* Dashboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <p className="text-gray-500 text-center py-12">
          Dashboard content for admin's account management goes here...
        </p>
      </div>
    </div>
  );
};

export default AdminPageSample;

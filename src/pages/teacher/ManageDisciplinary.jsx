import Header from "../../components/Header";

const ManageDisciplinary = () => {
  const headerLocation = "Disciplinary Records";
  const headerSubtext = "View and create student disciplinary records.";

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* Dashboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 min-h-96">
        <p className="text-gray-500 text-center py-12">
          Your UI for managing disciplinary records will go here...
        </p>
      </div>
    </div>
  );
};

export default ManageDisciplinary;
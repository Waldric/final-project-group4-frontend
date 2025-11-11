import Header from "../../components/Header";

const StudentProfileView = () => {
  const headerLocation = "My Profile";
  const headerSubtext =
    "View and update your personal, academic, and account details.";

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* ===== Main Profile Layout ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* ===== Left Column: Profile Summary ===== */}
        <div className="bg-white shadow-md rounded-2xl p-3 border border-gray-200 text-center lg:h-fit">
          <img
            src="/waguri.jpg" 
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 object-cover mx-auto"
          />
          <h2 className="font-semibold text-lg">John Doe</h2>
          <p className="text-gray-500 text-sm">Student</p>
          <p className="text-sm mt-2">ID: 202342091</p>

          <div className="mt-4 text-center text-sm space-y-1">
            <p>
              <span className="font-medium">Program:</span> Computer Science
            </p>
            <p>
              <span className="font-medium">Semester:</span> 1st Semester
            </p>
            <p>
              <span className="font-medium">Year Level:</span> 3rd Year
            </p>
            <p>
              <span className="font-medium">School Year:</span> 2025–2026
            </p>
          </div>
        </div>

        {/* ===== Right Column: Information Cards (temporary infos) ===== */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Personal Details */}
          <Card title="Personal Details">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Full Name" placeholder="Name Here" />
              <InputField label="Gender" placeholder="Female" />
              <InputField label="Birthdate" placeholder="Date here" />
              <InputField label="Mobile Number" placeholder="Number Here" />
              <InputField label="Address" placeholder="Address" />
              <InputField
                label="Guardian / Emergency Contact Name"
                placeholder="Name Here"
              />
              <InputField
                label="Guardian / Contact Number"
                placeholder="Number Here"
              />
            </div>
          </Card>

          {/* Academic Information */}
          <Card title="Academic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Department" placeholder="IS" />
              <InputField label="Academic Program" placeholder="Computer Science" />
              <InputField label="Year Level" placeholder="3rd Year" />
              <InputField label="Section" placeholder="C3A" />
              <InputField label="Enrollment Status" placeholder="Enrolled" />
              <InputField
                label="Semester / School Year"
                placeholder="2nd Semester"
              />
              <InputField label="Adviser / Instructor" placeholder="Name Here" />
              <InputField label="Subjects Enrolled" placeholder="Number Here" />
            </div>
          </Card>

          {/* Account Information */}
          <Card title="Account Information">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField label="Student ID" placeholder="2023123234" />
              <InputField label="Username" placeholder="Name Here" />
              <InputField label="Password" placeholder="Student" />
              <InputField label="Role" placeholder="Student" />
              <InputField
                label="Email"
                placeholder="waguri@mie.edu.ph"
                type="email"
              />
              <InputField label="Account Status" placeholder="Active" />
              <InputField label="Date Registered" placeholder="Date here" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <button className="btn btn-sm bg-[#5603AD] hover:bg-purple-700 text-white rounded-lg">
        Edit Profile
      </button>
    </div>
    {children}
  </div>
);

const InputField = ({ label, placeholder, type = "text" }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-gray-600 text-sm">{label}</span>
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="input input-bordered w-full rounded-lg"
      disabled
    />
  </div>
);

export default StudentProfileView;

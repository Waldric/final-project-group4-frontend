import {
  BeakerIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  CpuChipIcon,
  DocumentChartBarIcon,
  PencilIcon,
  PencilSquareIcon,
  UserGroupIcon,
  UserIcon,
  WrenchIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import Header from "../../components/Header";
import { useState } from "react";
import { useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router";

const AdminDashboard = () => {
  const headerLocation = "Admin Dashboard";
  const headerSubtext = `View statistics, recent activities, and key 
                      updates across students, and teachers from different 
                      records, all in one place.`;
  const { data, loading, error } = useFetch("/reports/recordsNum");
  const {
    classes,
    department,
    disciplinary,
    students,
    teachers,
    departmentDistribution = [],
  } = data ?? {};
  const navigate = useNavigate();

  const DEPARTMENT_META = {
    CCS: {
      name: "College of Computer Studies",
      color: "#c51c10",
      icon: CpuChipIcon,
    },
    COE: {
      name: "College of Engineering",
      color: "#138b41",
      icon: WrenchIcon,
    },
    COS: {
      name: "College of Science",
      color: "#2a48cf",
      icon: BeakerIcon,
    },
    IS: {
      name: "Integrated School",
      color: "#d1bc02",
      icon: PencilIcon,
    },
  };

  const distMap = Object.fromEntries(
    departmentDistribution.map((d) => [d._id, d.count])
  );

  useEffect(() => {
    console.log(data);
  }, [loading]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="loading loading-dots loading-xl"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-center">
        <span className="text-4xl">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Page Header */}
      <Header location={headerLocation} subheader={headerSubtext} />

      {/* Dashboard Content */}
      <div className="p-4 md:p-6 min-h-96">
        {/* First Row */}
        <div className="flex *:m-3 *:p-3 *:bg-white *:rounded-lg *:shadow-sm *:border *:border-gray-200 *:min-h-36 text-center w-full">
          <div className="flex-1 flex flex-col justify-center w-full">
            <div className="flex justify-center items-center *:m-2">
              <UserGroupIcon className="w-12 h-12 text-[#5603AD] drop-shadow" />
              <span className="font-bold text-2xl text-shadow-xs">
                {students}
              </span>
            </div>
            <span className="font-light">Students</span>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full items-center">
            <div className="flex justify-center items-center *:m-2">
              <UserIcon className="w-12 h-12 text-[#5603AD] drop-shadow" />
              <span className="font-bold text-2xl text-shadow-xs">
                {teachers}
              </span>
            </div>
            <span className="font-light">Teachers</span>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full items-center">
            <div className="flex justify-center items-center *:m-2">
              <DocumentChartBarIcon className="w-12 h-12 text-[#5603AD] drop-shadow" />
              <span className="font-bold text-2xl text-shadow-xs">
                {disciplinary}
              </span>
            </div>
            <span className="font-light">Disciplinary Records</span>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full items-center">
            <div className="flex justify-center items-center *:m-2">
              <BookOpenIcon className="w-12 h-12 text-[#5603AD] drop-shadow" />
              <span className="font-bold text-2xl text-shadow-xs">
                {classes}
              </span>
            </div>
            <span className="font-light">Classes</span>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full items-center">
            <div className="flex justify-center items-center *:m-2">
              <BuildingOffice2Icon className="w-12 h-12 text-[#5603AD] drop-shadow" />
              <span className="font-bold text-2xl text-shadow-xs">
                {department}
              </span>
            </div>
            <span className="font-light">Departments</span>
          </div>
        </div>

        {/* Second Row */}
        <div className="flex w-full">
          <div className="flex-3 flex flex-col justify-center m-3 p-7 bg-white rounded-lg shadow-sm border border-gray-200">
            <span className="flex flex-1 text-xl font-medium text-shadow-2xs mx-3">
              Students per Department
            </span>
            <div className="flex flex-8 flex-col w-full justify-evenly">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(DEPARTMENT_META).map(([key, meta]) => {
                  const Icon = meta.icon;

                  return (
                  <div
                    key={key}
                    className={`flex flex-col flex-1 rounded-2xl p-5 my-3 m-1 justify-between shadow-xl`}
                    style={{backgroundColor: meta.color}}
                  >
                    <div className="flex items-center justify-center *:mx-5 m-3">
                      <Icon className="w-12 h-12 text-gray-100 drop-shadow" />
                      <span className="text-3xl text-gray-100 font-bold text-shadow-xs">
                        {distMap[key] ?? 0}
                      </span>
                    </div>

                    <span className="text-xl text-gray-100 font-bold justify-center items-center text-center text-shadow-xs">
                      {meta.name}
                    </span>
                  </div>
                )})}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col *:m-3 *:p-3 *:bg-white *:rounded-lg *:shadow-sm *:border *:border-gray-200 *:min-h-36 text-center">
            <div className="flex-1 flex flex-col justify-center items-center btn" onClick={() => navigate("/dashboard/admin/manage-accounts")}>
              <div className="flex flex-col justify-center items-center *:m-2">
                <WrenchScrewdriverIcon className="w-12 h-12 text-[#747372] " />
                <span className="font-bold text-md text-shadow-xs text-2xl">
                  Manage Accounts
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center btn" onClick={() => navigate("/dashboard/admin/subjects")}>
              <div className="flex flex-col justify-center items-center *:m-2">
                <BookOpenIcon className="w-12 h-12 text-[#F7B801] drop-shadow" />
                <span className="font-bold text-md text-shadow-xs text-2xl">
                  Adjust Subjects
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

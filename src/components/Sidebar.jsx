import {
  HomeIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

const Sidebar = ({ activeItem, setActiveItem, isOpen, setIsOpen, user }) => {
  const navigate = useNavigate();

  const menuItemsByRole = {
   Student: [
   {
    id: "dashboard",
    icon: HomeIcon,
    label: "My Dashboard",
    path: "/dashboard/student/dashboard",
  },
  {
    id: "student_grades",
    icon: ChartBarIcon,
    label: "My Grades",
    path: "/dashboard/student/grades",
  },
  {
    id: "student_schedule",
    icon: CalendarDaysIcon,
    label: "My Schedule",
    path: "/dashboard/student/schedule",
  },
      // {
      //   id: "tuition",
      //   icon: CreditCardIcon,
      //   label: "Tuition & Balance",
      //   path: "/dashboard/student/tuition",
      // },
      // {
      //   id: "payment",
      //   icon: ReceiptRefundIcon,
      //   label: "Payment History",
      //   path: "/dashboard/student/payment-history",
      // },
      {
        id: "records",
        icon: DocumentTextIcon,
        label: "My Records",
        path: "/dashboard/student/records",
      },
    ],

    Teacher: [
      {
        id: "dashboard",
        icon: HomeIcon,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        id: "classes",
        icon: BookOpenIcon,
        label: "My Classes",
        path: "/dashboard/teacher/classes",
      },
      {
        id: "teacher_grade",
        icon: ChartBarIcon,
        label: "Student Grades",
        path: "/dashboard/teacher/grades",
      },
      {
        id: "disciplinary_records",
        icon: DocumentDuplicateIcon,
        label: "Disciplinary Records",
        path: "/dashboard/teacher/disciplinary-records",
      },
    ],

    Admin: [
      {
        id: "dashboard",
        icon: HomeIcon,
        label: "Dashboard",
        path: "/dashboard",
      },
      {
        id: "manage_accounts",
        icon: WrenchScrewdriverIcon,
        label: "Manage Accounts",
        path: "/dashboard/admin/manage-accounts",
      },
      {
        id: "student_records",
        icon: AcademicCapIcon,
        label: "Student Records",
        path: "/dashboard/admin/student-records",
      },
      {
        id: "teacher_records",
        icon: BuildingLibraryIcon,
        label: "Teacher Records",
        path: "/dashboard/admin/teacher-records",
      },
      {
        id: "subjects",
        icon: BookOpenIcon,
        label: "Manage Subjects",
        path: "/dashboard/admin/subjects",
      },
      // {
      //   id: "billing_and_payments",
      //   icon: CreditCardIcon,
      //   label: "Billing & Payments",
      //   path: "/dashboard/admin/billing-payments",
      // },
      // {
      //   id: "announcements",
      //   icon: MegaphoneIcon,
      //   label: "Announcements",
      //   path: "/dashboard/admin/announcements",
      // },
    ],
  };

  const menuItems = menuItemsByRole[user.user_type] || [];

  const handleMenuClick = (id, path) => {
    setActiveItem(id);
    navigate(path);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`w-54 bg-white border-r border-gray-200 shadow-md fixed left-0 top-0 h-full flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex justify-between items-center p-4 md:hidden">
          <span className="text-lg font-semibold text-[#5603AD]">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        {/* Logo */}
        <img
          src="/mie-logo.png"
          alt="Medina Institute Logo"
          className="w-43 h-auto object-contain mx-4 my-4"
        />
        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id, item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-700 hover:bg-gray-50`}
                  >
                    <Icon className="w-5 h-5" />
                    <span
                      className={`text-sm relative text-left inline-block w-auto whitespace-nowrap`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

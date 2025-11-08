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
} from "@heroicons/react/24/solid";

const Sidebar = ({ activeItem, setActiveItem, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: "dashboard", icon: HomeIcon, label: "My Dashboard" },
    { id: "grades", icon: ChartBarIcon, label: "My Grades" },
    { id: "schedule", icon: CalendarDaysIcon, label: "My Schedule" },
    { id: "enrollment", icon: AcademicCapIcon, label: "Enrollment" },
    { id: "tuition", icon: CreditCardIcon, label: "Tuition & Balance" },
    { id: "payment", icon: ReceiptRefundIcon, label: "Payment History" },
    { id: "records", icon: DocumentTextIcon, label: "My Records" },
    { id: "announcements", icon: MegaphoneIcon, label: "Announcements" },
  ];

  const handleMenuClick = (id) => {
    setActiveItem(id);
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
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? "text-[#5603AD] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span
                      className={`text-sm relative ${
                        isActive
                          ? "after:absolute after:rounded-full after:transition-all after:duration-300 after:scale-x-100 after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#5603AD] text-[#5603AD]"
                          : ""
                      }`}
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

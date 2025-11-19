const Header = ({ location, subheader }) => {
  return (
    <div className="mb-5">
      <div className="flex items-start gap-3">
        <div className="w-1.5 h-10 bg-[#5603AD] rounded-full"></div>
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            {location}
          </h1>
          <p className="text-sm md:text-base text-gray-600 flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">💡</span>
            <span>{subheader}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;

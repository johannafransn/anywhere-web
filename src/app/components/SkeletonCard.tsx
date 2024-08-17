const SkeletonCard = () => (
  <div className="h-auto w-full flex gap-4 rounded-lg text-black-opacity-80 animate-pulse">
    <div className="h-20 w-20 bg-gray-300 rounded-lg shadow-sm"></div>
    <div className="flex flex-col justify-between py-1 text-left text-sm w-full">
      <div className="flex gap-4 w-[218px]">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="flex items-center">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;

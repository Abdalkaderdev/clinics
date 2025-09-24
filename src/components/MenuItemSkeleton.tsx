import React from "react";

const MenuItemSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-pink-50 to-blue-50 flex flex-col min-h-fit border-2 border-pink-100 animate-pulse">
      <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 items-center text-center relative">
        {/* Badge skeleton */}
        <div className="absolute top-2 right-2 w-16 h-6 bg-pink-200 rounded-full"></div>
        
        {/* Title skeleton */}
        <div className="w-3/4 h-6 bg-pink-200 rounded mb-2"></div>
        
        {/* Location skeleton */}
        <div className="w-1/2 h-4 bg-blue-200 rounded mb-3"></div>
        
        {/* Description skeleton */}
        <div className="w-full space-y-2 mb-4">
          <div className="w-full h-3 bg-gray-200 rounded"></div>
          <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
          <div className="w-3/5 h-3 bg-gray-200 rounded"></div>
        </div>
        
        {/* Price section skeleton */}
        <div className="flex flex-col items-center gap-2 mt-auto w-full">
          <div className="flex items-center gap-2 w-full justify-center">
            <div className="w-20 h-8 bg-red-200 rounded"></div>
            <div className="w-6 h-6 bg-pink-200 rounded-full"></div>
            <div className="w-24 h-8 bg-green-200 rounded"></div>
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex gap-3 justify-center w-full mt-2">
            <div className="w-20 h-10 bg-pink-200 rounded-full"></div>
            <div className="w-24 h-10 bg-green-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemSkeleton;
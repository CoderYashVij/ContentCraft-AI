"use client";
import React, { useContext } from "react";
import { Search, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { SideBarContext } from "@/app/(context)/TotalUsageContext";

const Header: React.FC = () => {
  const { isSidebarOpen, setIsSidebarOpen }: any = useContext(SideBarContext);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="p-5 shadow-md border-b-2 flex flex-col md:flex-row items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        {/* <Search className="text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none placeholder-gray-600 text-gray-800 flex-grow py-1 px-2"
        /> */}
      </div>

      <div className="flex items-center gap-5 mt-4 md:mt-0">
        <h2 className="bg-purple-600 py-2 px-6 rounded-full text-white text-base font-bold text-center">
          Join New Membership from ₹299/Month
        </h2>
        <UserButton appearance={{
          elements: {
            avatarBox: "w-12 h-12" // Make user avatar bigger
          }
        }} />

        <button
          onClick={handleSidebarToggle}
          className="flex items-center"
        >
          {isSidebarOpen ? (
            <X className="w-8 h-8 text-red-600 ring-1 rounded-full ring-red-500" />
          ) : (
            <Menu className="w-8 h-8 text-purple-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

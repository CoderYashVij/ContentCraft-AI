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
    <header className="p-4 shadow-md border-b-2 flex flex-col md:flex-row items-center justify-between bg-white">
      <div className="flex items-center gap-2 border border-gray-300 rounded-md bg-gray-100 max-w-lg w-full">
        <Search className="text-gray-500 ml-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none placeholder-gray-600 text-gray-800 flex-grow py-1 px-2"
        />
      </div>

      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <h2 className="bg-purple-600 py-1 px-4 rounded-full text-white text-sm font-semibold text-center">
          Join New Membership from $9.99/Month
        </h2>
        <UserButton />

        <button
          onClick={handleSidebarToggle}
          className=" flex items-center"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6 text-red-600 ring-1 rounded-full ring-red-500" />
          ) : (
            <Menu className="w-6 h-6 text-purple-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

"use client";
import { useState } from "react";
import {
  SideBarContext,
  TotalUsageContext,
} from "../(context)/TotalUsageContext";
import Header from "./_components/Header";
import SideBar from "./_components/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [totalUsage, setTotalUsage] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <SideBarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <TotalUsageContext.Provider value={{ totalUsage, setTotalUsage }}>
        <div className="flex bg-slate-100 min-h-screen">
          {isSidebarOpen && (
            <div className="md:w-64 fixed w-[60%] z-30">
              <SideBar />
            </div>
          )}

          <div className={`flex-1 ${isSidebarOpen ? "md:ml-64" : ""}`}>
            <Header />
            <main>{children}</main>
          </div>
        </div>
      </TotalUsageContext.Provider>
    </SideBarContext.Provider>
  );
}

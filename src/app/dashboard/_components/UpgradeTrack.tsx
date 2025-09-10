"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import React, { useContext, useEffect } from "react";
import { eq } from "drizzle-orm";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import Link from "next/link";

// Define the type for AIOutput data structure if available
interface AIOutputData {
  aiResponse?: string;
  createdBy?: string;
}


export const TOTLAL_WORDS=40000;
const UpgradeTrack = () => {
  const { user } = useUser();
  const { totalUsage, setTotalUsage }:any = useContext(TotalUsageContext);

  // Function to calculate total usage
  const GetTotalUsage = (result: AIOutputData[]) => {
    let total = 0;
    result.forEach((ele) => {
      total += Number(ele.aiResponse?.length || 0); // Add the length of each aiResponse
    });
    setTotalUsage(total); // Update the context state
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const result:any = await db
            .select()
            .from(AIOutput)
            .where(
              eq(AIOutput.createdBy, user.primaryEmailAddress?.emailAddress!)
            );

          if (result) {
            GetTotalUsage(result);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [user, setTotalUsage]);

  return (
    <div className="m-5 space-y-4">
      <div className="rounded-lg text-white p-4 bg-mainColor shadow-md mb-5">
        <h2 className="text-lg font-semibold">Cardits</h2>

        {/* Progress Bar */}
        <div className="relative h-2 bg-purple-300 w-full rounded-full mt-4">
          <div
            className="absolute top-0 left-0 h-2 bg-white rounded-full"
            style={{ width: `${(totalUsage / TOTLAL_WORDS) * 100}%` }}
          ></div>
        </div>

        <p className="text-sm mt-2">{totalUsage}/{TOTLAL_WORDS} Cardit Used</p>
      </div>

      {/* Upgrade Button */}
      <Link href="/dashboard/pricing" >

      <Button
        className="w-full bg-transparent text-mainColor py-4 
                   hover:bg-mainColor hover:text-white hover:ring-transparent 
                   ring-1 ring-mainColor transition-all duration-300 ease-in-out"
      >
        Upgrade Account
      </Button>
      </Link>
    </div>
  );
};

export default UpgradeTrack;

"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { AIOutput, UserSubscription } from "@/utils/schema";
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


export const TOTAL_WORDS = 40000;
const UpgradeTrack = () => {
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const [lastChecked, setLastChecked] = React.useState<number>(Date.now());
  const contextValue = useContext(TotalUsageContext);
  
  // Safe access to context values with defaults
  const totalUsage = contextValue?.totalUsage || 0;
  const setTotalUsage = contextValue?.setTotalUsage || (() => {});
  const setUserSubscription = contextValue?.setUserSubscription || (() => {});

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
          // Fetch usage data
          const result:any = await db
            .select()
            .from(AIOutput)
            .where(
              eq(AIOutput.createdBy, user.primaryEmailAddress?.emailAddress!)
            );

          if (result) {
            GetTotalUsage(result);
          }
          
          // Check subscription status
          await isUserSubscribed();
          
        } catch (error) {
          console.error("Error fetching data");
        }
      }
    };

    fetchData();
    
    // Add an interval to check subscription status periodically
    // This helps if subscription status changes in another tab/window
    const intervalId = setInterval(() => {
      if (user) {
        isUserSubscribed();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [user, setTotalUsage]);

  const isUserSubscribed = async() => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      
      const result = await db.select()
        .from(UserSubscription)
        .where(eq(UserSubscription.email, user.primaryEmailAddress.emailAddress));
      
      // More robust check for active status with proper type handling
      const isActive = result && 
                        result.length > 0 && 
                        Boolean(result[0].active);
                         
      // Update state based on result
      const newSubscriptionStatus = isActive;
      
      if (newSubscriptionStatus) {
        setIsSubscribed(true);
        setUserSubscription(true);
      } else {
        setIsSubscribed(false);
        setUserSubscription(false);
      }
      
      // Update last checked timestamp
      setLastChecked(Date.now());
    } catch (error) {
      console.error("Error checking subscription status");
      setIsSubscribed(false);
    }
  }

  return (
    <div className="m-5 space-y-4">
      {/* Current Plan Card */}
      <div className="rounded-lg border p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Current Plan:</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSubscribed 
                ? "bg-mainColor text-white" 
                : "bg-gray-200 text-gray-700"
            }`}>
              {isSubscribed ? "Pro" : "Starter"}
            </span>
          </div>
        </div>
        
        {/* Plan features */}
        <div className="mt-3 text-sm text-gray-600">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-mainColor mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {isSubscribed ? "Unlimited Words" : `${TOTAL_WORDS} Words`}
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-mainColor mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {isSubscribed ? "Priority Support" : "Email Support"}
          </div>
        </div>
      </div>

      <div className="rounded-lg text-white p-4 bg-mainColor shadow-md mb-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Credits</h2>
          {isSubscribed && (
            <span className="bg-white text-mainColor text-xs px-2 py-1 rounded-full font-medium">
              Unlimited Access
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-purple-300 w-full rounded-full mt-4">
          <div
            className="absolute top-0 left-0 h-2 bg-white rounded-full"
            style={{ width: `${isSubscribed ? 100 : (totalUsage / TOTAL_WORDS) * 100}%`, 
                    transition: "width 0.5s ease-in-out" }}
          ></div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm">{totalUsage} {isSubscribed ? '' : `/ ${TOTAL_WORDS}`} Words Used</p>
          {!isSubscribed && (
            <p className="text-xs">
              {Math.max(0, TOTAL_WORDS - totalUsage)} words remaining
            </p>
          )}
        </div>
      </div>

      {/* Upgrade Button - Only shown if not subscribed */}
      {!isSubscribed && (
        <Link href="/dashboard/pricing">
          <Button
            className="w-full py-4 flex items-center justify-center gap-2 bg-mainColor text-white hover:bg-mainColor/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
            <span>Upgrade to Pro - ₹299/month</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default UpgradeTrack;

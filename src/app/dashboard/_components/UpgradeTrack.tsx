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
          console.log("User is logged in, checking data...");
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
          console.error("Error fetching data:", error);
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
      
      console.log("Checking subscription for:", user.primaryEmailAddress.emailAddress);
      
      const result = await db.select()
        .from(UserSubscription)
        .where(eq(UserSubscription.email, user.primaryEmailAddress.emailAddress));
      
      console.log("Subscription query result:", JSON.stringify(result, null, 2));
      
      // Check if subscription records exist and active status
      console.log("Active status value:", result?.[0]?.active);
      console.log("Active status type:", result?.[0]?.active !== undefined ? typeof result[0].active : "no value");
      
      // More robust check for active status with proper type handling
      const isActive = result && 
                        result.length > 0 && 
                        Boolean(result[0].active);
                         
      // Update state based on result
      const newSubscriptionStatus = isActive;
      
      if (newSubscriptionStatus) {
        console.log("User is subscribed!");
        setIsSubscribed(true);
        setUserSubscription(true);
      } else {
        console.log("User is NOT subscribed!");
        setIsSubscribed(false);
        setUserSubscription(false);
      }
      
      // Update last checked timestamp
      setLastChecked(Date.now());
    } catch (error) {
      console.error("Error checking subscription status:", error);
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
            {process.env.NODE_ENV === "development" && (
              <button 
                onClick={() => isUserSubscribed()}
                className="text-xs text-gray-500 hover:text-mainColor"
                title="Refresh subscription status"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isSubscribed 
                ? "bg-mainColor text-white" 
                : "bg-gray-200 text-gray-700"
            }`}>
              {isSubscribed ? "Pro" : "Starter"}
            </span>
            {/* Hidden in production, visible only for debugging */}
            {process.env.NODE_ENV === "development" && (
              <span className="text-xs text-gray-400 mt-1">
                Last checked: {new Date(lastChecked).toLocaleTimeString()}
              </span>
            )}
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

      {/* Upgrade/Manage Button */}
      <Link href="/dashboard/pricing">
        <Button
          className={`w-full py-4 flex items-center justify-center gap-2 ${
            isSubscribed 
              ? "bg-transparent text-mainColor hover:bg-gray-100 ring-1 ring-mainColor" 
              : "bg-mainColor text-white hover:bg-mainColor/90"
          }`}
        >
          {isSubscribed ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Manage Subscription
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              Upgrade to Pro
            </>
          )}
        </Button>
      </Link>
    </div>
  );
};

export default UpgradeTrack;

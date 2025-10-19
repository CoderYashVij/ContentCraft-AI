"use client";

import React from "react";
import { TOTAL_WORDS } from "../_components/UpgradeTrack";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon, User } from "lucide-react";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import moment from "moment";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useRouter } from "next/navigation";

const plans = [ 
  {
    name: "Pro",
    price: 299,
    features: [
      "Unlimited Words",
      "2TB of storage",
      "Email support",
      "Help center access",
    ],
    isFree: false,
    borderColor: "border-mainColor",
    backgroundColor: "bg-mainColor",
    textColor: "text-white",
    hoverRingColor: "hover:ring-mainColor",
    textHoverColor: "hover:text-mainColor",
  },
  {
    name: "Starter",
    price: "10",
    features: [`40000 Words`, "1GB of storage", "Email support"],
    isFree: true,
    borderColor: "border-gray-200",
    backgroundColor: "bg-white",
    textColor: "text-mainColor",
    hoverRingColor: "hover:ring-mainColor",
    textHoverColor: "hover:text-mainColor",
  },
];

const Pricing = () => {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = React.useState<boolean>(false);
  const [userSubscription, setUserSubscription] = React.useState<any>(null);
  const { user } = useUser();
  const router = useRouter();
  
  // Check if user already has a subscription
  React.useEffect(() => {
    const checkSubscription = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const result = await db
            .select()
            .from(UserSubscription)
            .where(eq(UserSubscription.email, user.primaryEmailAddress.emailAddress));
          
          if (result && result.length > 0 && result[0].active) {
            setUserSubscription(result[0]);
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };
    
    checkSubscription();
  }, [user]);
  
  const handlePlanSelection = (planName: string, isFree: boolean) => {
    if (isFree) {
      // If user has an active subscription, show confirmation before downgrading
      if (userSubscription && userSubscription.active) {
        setShowConfirmation(true);
      } else {
        // No active subscription, just confirm free plan
        alert("You're now on the free Starter plan!");
        router.push("/dashboard");
      }
    } else {
      // Handle paid plan selection
      createSubscription();
    }
  };

  const createSubscription = async () => {
    try {
      setLoadingPlan("Pro");
      
      const response = await axios.post("/api/create-subscription", {
        // You can add customer details here if needed
        // email: user.email,
        // name: user.name,
      });
      
      // Subscription created successfully
      
      if (response.data && response.data.result && response.data.result.id) {
        // Pass the subscription ID to the payment function
        onPayment(response.data.result.id);
      } else {
        throw new Error("Invalid subscription response");
      }
    } catch (error: any) {
      setLoadingPlan(null);
      console.error("Error creating subscription:", error);
      alert(error.response?.data?.message || "Failed to create subscription. Please try again.");
    }
  };

  const onPayment = (subId: string) => {
    // Configure Razorpay payment options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
      subscription_id: subId,
      name: "ContentCraft AI",
      description: "Pro Plan - Monthly Subscription",
      prefill: {
        email: "", // You can add user email here if available
      },
      theme: {
        color: "#4f46e5", // Indigo color that matches your UI
      },
      modal: {
        ondismiss: function() {
          // Handle payment modal dismiss
          setLoadingPlan(null);
          // Payment cancelled by user
        }
      },
      handler: async (response: any) => {
        try {
          // Payment successful
           if(response){
            await SaveSubscription(response?.razorpay_payment_id);
           }
        } catch (error) {
          console.error("Payment verification error:", error);
          alert("There was an issue verifying your payment. Please contact support.");
        } finally {
          setLoadingPlan(null);
        }
      },
    };
    
    try {
      // @ts-ignore - Razorpay is loaded from external script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay initialization error:", error);
      alert("Payment gateway could not be initialized. Please try again later.");
      setLoadingPlan(null);
    }
  };

  const SaveSubscription = async (paymentId: string) => {
    // Ensure email exists before proceeding
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      alert("User email not found. Please try again or contact support.");
      return;
    }
    
    // First check if a subscription already exists for this user
    const existingSubscriptions = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.email, userEmail));
      
    let result;
    
    if (existingSubscriptions && existingSubscriptions.length > 0) {
      // Update existing subscription record
      result = await db
        .update(UserSubscription)
        .set({
          active: true,
          paymentId: paymentId,
          joinDate: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .where(eq(UserSubscription.email, userEmail));
        
      // Updated existing subscription
    } else {
      // Insert new subscription record
      result = await db.insert(UserSubscription).values({
        email: userEmail,
        username: user?.fullName || "Unknown User",
        active: true,
        paymentId: paymentId,
        joinDate: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      // Created new subscription
    }
    
    if(result){
      alert("Subscription successful! Welcome to Pro plan.");
      window.location.reload();
    }
  };

  // Load Razorpay script
  React.useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 bg-slate-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl border ${plan.borderColor} p-6 shadow-sm ring-1 ${plan.borderColor} sm:px-8 lg:p-12`}
            >
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {plan.name}
                  <span className="sr-only">Plan</span>
                </h2>
                <p className="mt-2 sm:mt-4">
                  <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {plan.isFree ? "Free" : `₹${plan.price}`}
                  </strong>
                  <span className="text-sm font-medium text-gray-700">
                    /month
                  </span>
                </p>
              </div>

              <ul className="mt-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 text-mainColor-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={loadingPlan === plan.name}
                onClick={() => handlePlanSelection(plan.name, plan.isFree)}
                className={`mt-8 block w-full rounded-full border ${plan.borderColor} ${plan.backgroundColor} px-12 py-3 text-center text-sm font-medium ${plan.textColor} ${plan.hoverRingColor} focus:outline-none focus:ring active:${plan.textHoverColor} flex items-center justify-center gap-2`}
              >
                {loadingPlan === plan.name && <Loader2Icon className="animate-spin w-4 h-4" />}
                {plan.isFree ? "Start Free" : "Get Pro"}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Confirmation Modal for canceling subscription */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={cancelSubscription}
        title="Cancel Premium Subscription"
        message="Are you sure you want to cancel your premium subscription and downgrade to the free plan? You'll lose access to unlimited words and premium features."
      />
    </div>
  );
  
  // Function to cancel subscription
  async function cancelSubscription() {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    setLoadingPlan("Starter");
    try {
      // Call the API to cancel subscription
      const response = await axios.post("/api/cancel-subscription", {
        email: user.primaryEmailAddress.emailAddress
      });
      
      if (response.data.success) {
        // Update local state
        setUserSubscription(null);
        // Show success message
        alert("You've been downgraded to the free plan successfully.");
        router.push("/dashboard");
      } else {
        alert("There was a problem canceling your subscription. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("There was a problem canceling your subscription. Please try again.");
    } finally {
      setLoadingPlan(null);
      setShowConfirmation(false);
    }
  }
};

export default Pricing;

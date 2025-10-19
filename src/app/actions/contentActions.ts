"use server";

import { chatSession } from "@/utils/ai";
import { Templates } from "@/data/data";
import { TOTAL_WORDS } from "../dashboard/_components/UpgradeTrack";
import { db } from "@/utils/db";
import { UserSubscription } from "@/utils/schema";
import { eq } from "drizzle-orm";

// Helper function to check if a user has an active subscription
async function checkUserSubscription(email: string): Promise<boolean> {
  if (!email) return false;
  
  try {
    const subscriptions = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.email, email));
    
    return subscriptions.length > 0 && subscriptions[0].active === true;
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}

export async function generateAIContent(
  formData: any,
  slug: string,
  currentUsage: number,
  userEmail: string
) {
  try {
    // Check if user is subscribed (has premium)
    const isSubscribed = await checkUserSubscription(userEmail);
    
    // Only check usage limits if user is not subscribed
    if (!isSubscribed && currentUsage >= TOTAL_WORDS) {
      return {
        success: false,
        error: "usage_limit_reached",
        result: null
      };
    }

    // Find the template
    const selectedTemplate = Templates.find((item) => item.slug === slug);
    if (!selectedTemplate) {
      return {
        success: false,
        error: "template_not_found",
        result: null
      };
    }

    // Build the prompt and generate content
    const selectedPrompt = selectedTemplate.aiPrompt;
    const finalAIPrompt = JSON.stringify(formData) + ", " + selectedPrompt;

    const result = await chatSession.sendMessage(finalAIPrompt);
    const aiResponseText = await result.response.text();

    return {
      success: true,
      error: null,
      result: aiResponseText
    };
  } catch (error) {
    console.error("Error generating AI content:", error);
    return {
      success: false,
      error: "generation_failed",
      result: null
    };
  }
}
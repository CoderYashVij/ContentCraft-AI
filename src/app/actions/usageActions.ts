"use server";

import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function getUserUsage(userEmail: string) {
  try {
    // Get all user's content generations
    const userOutputs = await db
      .select()
      .from(AIOutput)
      .where(eq(AIOutput.createdBy, userEmail));
    
    // Calculate total usage (simple word count estimate)
    const totalWords = userOutputs.reduce((total, output) => {
      const wordCount = output.aiResponse ? output.aiResponse.toString().split(' ').length : 0;
      return total + wordCount;
    }, 0);
    
    return totalWords;
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return 0;
  }
}
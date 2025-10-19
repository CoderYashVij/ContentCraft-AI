"use server";

import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import moment from "moment";

export async function saveAIContentToDB(
  formData: any,
  slug: string,
  aiResponse: string,
  userEmail: string
) {
  try {
    await db.insert(AIOutput).values({
      formData: formData || "",
      slug: slug || "",
      aiResponse: aiResponse || "",
      createdBy: userEmail || "Unknown",
      createAt: moment().format("YYYY-MM-DD"),
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error saving AI content to DB:", error);
    return { 
      success: false,
      error: "Failed to save to database" 
    };
  }
}
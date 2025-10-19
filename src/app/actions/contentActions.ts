"use server";

import { chatSession } from "@/utils/ai";
import { Templates } from "@/data/data";
import { TOTLAL_WORDS } from "../dashboard/_components/UpgradeTrack";

export async function generateAIContent(
  formData: any,
  slug: string,
  currentUsage: number
) {
  try {
    // Check usage limits
    if (currentUsage >= TOTLAL_WORDS) {
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
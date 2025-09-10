// components/HistoryServer.tsx

import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import { ITemplate } from "../_components/TemplateList";
import { Templates } from "@/data/data";

// This function only fetches the history list based on some placeholder criteria
export async function fetchHistory(userEmail: string) {
  return await db
    .select()
    .from(AIOutput)
    .where(eq(AIOutput.createdBy, userEmail))
    .orderBy(desc(AIOutput.id));
}

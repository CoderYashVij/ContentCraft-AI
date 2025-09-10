"use client";

import React, { useContext, useState } from "react";
import FromSection from "../../_components/FromSection";
import OutputSection from "../../_components/OutputSection";
import { Templates } from "@/data/data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { chatSession } from "@/utils/ai";
import { db } from "@/utils/db";
import { AIOutput } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { useRouter } from "next/navigation";
import { TOTLAL_WORDS } from "../../_components/UpgradeTrack";

interface IProps {
  params: {
    slug: string;
  };
}

const CreateContent = (props: IProps) => {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [AIResult, setAIResult] = useState<string>("");
  const { totalUsage, setTotalUsage }: any = useContext(TotalUsageContext);

  const selectedTemplate: any = Templates.find(
    (item) => item.slug === props.params.slug
  );

  const generateAIContent = async (formData: any) => {
    try {
      if (totalUsage >= TOTLAL_WORDS) {
        alert("You have reached your usage limit. Please upgrade your account.");
        router.push("/dashboard/billing");
        return;
      }

      setLoading(true);

      const selectedPrompt = selectedTemplate?.aiPrompt; // FIX: Corrected the property name
      const finalAIPrompt = JSON.stringify(formData) + ", " + selectedPrompt;

      const result = await chatSession.sendMessage(finalAIPrompt);
      const aiResponseText = await result.response.text();

      setAIResult(aiResponseText);

      await saveToDB(formData, selectedTemplate?.slug, aiResponseText, user);
    } catch (error) {
      console.error("Error generating AI content:", error);
      alert("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  const saveToDB = async (
    formData: any,
    slug: string | undefined,
    aiResponse: string,
    user: any
  ) => {
    try {
      if (user) {
        await db.insert(AIOutput).values({
          formData: formData || "",
          slug: slug || "",
          aiResponse: aiResponse || "",
          createdBy: user.primaryEmailAddress?.emailAddress || "Unknown",
          createAt: moment().format("YYYY-MM-DD"),
        });
      }
    } catch (error) {
      console.error("Error saving AI content to DB:", error);
      alert("An error occurred while saving the content.");
    }
  };

  return (
    <div className="p-10 bg-slate-100">
      <Link href="/dashboard">
        <Button className="bg-mainColor hover:bg-transparent hover:text-mainColor hover:ring-mainColor ring-1 ring-transparent text-white py-5">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 sm:gap-5 py-5">
        <FromSection
          loading={loading}
          selectedTemplate={selectedTemplate}
          userFormInput={(formData: any) => generateAIContent(formData)}
        />
        <div className="col-span-2 mt-5 sm:mt-0">
          <OutputSection AIResult={AIResult} /> {/* FIX: Passed correct prop */}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;

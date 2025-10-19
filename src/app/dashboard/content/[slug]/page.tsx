"use client";

import React, { useContext, useState } from "react";
import FromSection from "../../_components/FromSection";
import OutputSection from "../../_components/OutputSection";
import { Templates } from "@/data/data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { TotalUsageContext } from "@/app/(context)/TotalUsageContext";
import { useRouter } from "next/navigation";
import { TOTLAL_WORDS } from "../../_components/UpgradeTrack";
import { generateAIContent } from "@/app/actions/contentActions";
import { saveAIContentToDB } from "@/app/actions/dbActions";

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

  const handleFormSubmit = async (formData: any) => {
    try {
      // if (totalUsage >= TOTLAL_WORDS) {
      //   alert("You have reached your usage limit. Please upgrade your account.");
      //   router.push("/dashboard/billing");
      //   return;
      // }

      setLoading(true);

      // Call server action to generate content
      const response = await generateAIContent(
        formData,
        props.params.slug,
        totalUsage
      );

      if (!response.success) {
        if (response.error === "usage_limit_reached") {
          router.push("/dashboard/billing");
          return;
        }
        throw new Error(response.error || "Failed to generate content");
      }

      setAIResult(response.result);

      // Save to database
      if (user) {
        await saveAIContentToDB(
          formData,
          props.params.slug,
          response.result,
          user.primaryEmailAddress?.emailAddress || "Unknown"
        );
      }

      // Update usage count
      const newWordCount = response.result.split(' ').length;
      setTotalUsage((prev: number) => prev + newWordCount);
      
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while generating content.");
    } finally {
      setLoading(false);
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
          userFormInput={(formData: any) => handleFormSubmit(formData)}
        />
        <div className="col-span-2 mt-5 sm:mt-0">
          <OutputSection AIResult={AIResult} /> 
        </div>
      </div>
    </div>
  );
};

export default CreateContent;

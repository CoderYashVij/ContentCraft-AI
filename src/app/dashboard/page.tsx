"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import SearchHero from "./_components/SearchHero";
import TemplateList from "./_components/TemplateList";

const Dashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [userSearchInput, setUserSearchInput] = useState<string>("");

  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.replace("/sign-in");
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className=" bg-slate-100">
      <SearchHero
        onSearchInput={(value: string) => setUserSearchInput(value)}
      />
      <TemplateList userSearchInput={userSearchInput} />
    </div>
  );
};

export default Dashboard;

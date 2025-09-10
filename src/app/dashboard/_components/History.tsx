"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchHistory } from "./HistoryServer";
import { Templates } from "@/data/data";

interface HistoryProps {
  initialHistoryList: any[];
}

const HistoryClient: React.FC<HistoryProps> = ({ initialHistoryList }) => {
  const { user } = useUser();
  const [historyList, setHistoryList] = useState<any[]>(initialHistoryList);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.primaryEmailAddress?.emailAddress) {
        const email = user.primaryEmailAddress.emailAddress;
        setUserEmail(email); // Set the user's email address
        const data = await fetchHistory(email);
        setHistoryList(data);
       
      }
    };
    
    fetchData();
  }, [user]);

  const getTemplateName = (slug: string) => {
    const template = Templates.find((item: { slug: string }) => item.slug === slug);
    return template?.name || "Unknown Template";
  };

  const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const wordCount = (text: string): number => text.split(" ").length;

  return (
    <div className="container mx-auto my-10">
      <div className="flex flex-col text-center w-full mb-6">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">History</h1>
        <div className=" flex items-center justify-center gap-2 mt-5">
        <span className=" text-gray-700 text-md font-semibold">Your Email:</span>
        <p className="text-gray-500 text-sm ">{userEmail}</p>
        </div>

      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">TEMPLATE</th>
              <th className="px-4 py-2">AI RESP</th>
              <th className="px-4 py-2">WORDS</th>
              <th className="px-4 py-2">COPY</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{getTemplateName(item.slug)}</td>
                <td className="px-4 py-2">{truncateText(item.aiResponse, 10)}</td>
                <td className="px-4 py-2 text-center">{wordCount(item.aiResponse)}</td>
                <td className="px-4 py-2 text-indigo-500 hover:text-indigo-700 cursor-pointer">Copy</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryClient;

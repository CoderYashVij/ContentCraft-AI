"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchHistory } from "./HistoryServer";
import { Templates } from "@/data/data";
import moment from "moment";
import Image from "next/image";
import { Copy } from "lucide-react";

interface HistoryProps {
  initialHistoryList: any[];
}

const HistoryClient: React.FC<HistoryProps> = ({ initialHistoryList }) => {
  const { isSignedIn, user } = useUser();
  const [historyList, setHistoryList] = useState<any[]>(initialHistoryList);
  const [userEmail, setUserEmail] = useState<string>("");
  const [toast, setToast] = useState<{ visible: boolean, message: string }>({ visible: false, message: "" });

  if(!isSignedIn){
    return null;
  }
  
  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 3000); // Hide after 3 seconds
  };

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

  const getTemplateInfo = (slug: string) => {
    const template = Templates.find((item: { slug: string }) => item.slug === slug);
    return {
      name: template?.name || "Unknown Template",
      icon: template?.icon || "https://cdn-icons-png.flaticon.com/128/1686/1686815.png" // Default icon
    };
  };

  const truncateText = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    if (words.length <= wordLimit ) return text;
    return words.slice(0, wordLimit ).join(" ") + "...";
  };

  const wordCount = (text: string): number => text.split(" ").length;
  
  // Format date from YYYY-MM-DD HH:mm:ss to a more readable format
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    return moment(dateStr, "YYYY-MM-DD HH:mm:ss").format("MMM DD, YYYY • h:mm A");
  };

  return (
    <div className="container mx-auto my-10 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-5">
          <Copy size={18} />
          <span>{toast.message}</span>
        </div>
      )}
      
      <div className="flex flex-col text-center w-full mb-6">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">History</h1>
        <div className="flex items-center justify-center gap-2 mt-5">
          <span className="text-gray-700 text-md font-semibold">Your Email:</span>
          <p className="text-gray-500 text-sm">{userEmail}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">TEMPLATE</th>
              <th className="px-4 py-2">AI RESP</th>
              <th className="px-4 py-2">WORDS</th>
              <th className="px-4 py-2">DATE</th>
              <th className="px-4 py-2">COPY</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((item: any, index: number) => {
              const templateInfo = getTemplateInfo(item.slug);
              return (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Image 
                        src={templateInfo.icon}
                        width={24}
                        height={24}
                        alt="Template icon"
                        className="rounded-sm"
                      />
                      <span>{templateInfo.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 max-w-md">
                    <div className="break-words whitespace-normal">{truncateText(item.aiResponse, 38)}</div>
                  </td>
                  <td className="px-4 py-2 text-center">{wordCount(item.aiResponse)}</td>
                  <td className="px-4 py-2">{formatDate(item.createAt)}</td>
                  <td className="px-4 py-2">
                    <button 
                      className="text-indigo-500 hover:text-indigo-700 cursor-pointer flex items-center gap-1"
                      onClick={() => {
                        navigator.clipboard.writeText(item.aiResponse);
                        showToast("Content copied to clipboard!");
                      }}
                    >
                      <Copy size={16} />
                      <span>Copy</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryClient;

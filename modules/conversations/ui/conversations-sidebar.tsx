"use client";

import { Conversation } from "@/modules/conversations/ui/conversation";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/modules/user/ui/user-info";
import { MessagesSquare } from "lucide-react";
import { useState } from "react";

const navMenu = [
  { label: "All", value: "all" },
  { label: "Personal", value: "personal" },
  { label: "Groups", value: "groups" },
];

export const CoversationsSidebar = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="w-70 border p-4 tracking-tight bg-white h-full flex flex-col space-y-6 rounded-xl">
      <UserInfo />
      <div className="w-full h-10 flex items-center  justify-between px-2 py-1  bg-gray-100 rounded-full">
        {navMenu.map((elem) => {
          return (
            <div
              key={elem.value}
              onClick={() => setActiveTab(elem.value)}
              className={cn("text-[13px]  font-medium transition-all duration-300 ease-in-out text-muted-foreground px-3 py-1.5 cursor-pointer  ",activeTab === elem.value && "bg-white  text-blue-500 shadow-xs rounded-full " )}
            >
              <span>{elem.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col space-y-3">
        <div className="text-muted-foreground font-medium flex items-center justify-between">
            <span className="text-[13px]  ">Messages</span>
            <MessagesSquare className="w-4 h-4"/>
        </div>
        <Conversation/>
        <Conversation/>
        <Conversation/>
        <Conversation/>
      </div>
    </div>
  );
};

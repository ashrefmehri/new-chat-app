"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Video,
  Phone,
  EllipsisVertical,
  Check,
  CheckCheck,
  Send,
  Plus,
  Smile,
  Loader,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  isOwn: boolean;
  type: "text" | "image" | "audio";
  imageUrl?: string;
  read?: boolean;
}

interface ConversationViewProps {
  conversationId: string;
}



// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ConversationView = ({ conversationId }: ConversationViewProps) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  const { data: conversation, isLoading } = useQuery(
    trpc.conversations.getById.queryOptions({ conversationId })
  );

  // Memoized other user data (the person you're chatting with)
  const otherUser = useMemo(() => {
    if (!conversation?.participants || !currentUserId) return null;

    const otherParticipant = conversation.participants.find(
      (p) => p.userId !== currentUserId
    );

    if (!otherParticipant?.user) return null;

    return {
      id: otherParticipant.user.id,
      name: otherParticipant.user.name,
      email: otherParticipant.user.email,
      image: otherParticipant.user.image,
      initials: getInitials(otherParticipant.user.name),
    };
  }, [conversation?.participants, currentUserId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col  tracking-tighter bg-white rounded-xl border">
         <div className="h-17 border-b flex items-center justify-between px-6  ">
           <div className="flex items-center gap-1">
            <Skeleton className="w-10 h-10 rounded-full"/>
            <div className="flex flex-col gap-2">
              <Skeleton className="w-30 h-4" />
              <Skeleton className="w-30 h-3" />
            </div>
           </div>
           <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-xl"/>
            <Skeleton className="w-7 h-7 rounded-xl"/>
            <Skeleton className="w-7 h-7 rounded-xl"/>
           </div>
         </div>
         <div className="flex flex-col gap-2 items-center tracking-tighter justify-center h-full">
          <Loader  className="text-blue-500 w-7 h-7 animate-spin" />
          <span className="font-medium text-muted-foreground">Loading conversation ...</span>
         </div>
      </div>
    );
  }
// Show error if no conversation found
  if (!conversation || !otherUser) {
    return (
      <div className="w-full h-full flex items-center tracking-tighter justify-center bg-white rounded-xl border">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-xl border tracking-tighter">
      {/* Header */}
      <div className="border-b h-17 flex items-center justify-between px-6">
        <div className="flex items-center justify-between gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.image || undefined} />
            <AvatarFallback className="text-xs font-bold bg-blue-100 text-blue-700">
              {otherUser.initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-foreground">
              {conversation.type === "DIRECT"
                ? otherUser.name
                : conversation.title || "Group Chat"}
            </p>
            <p className="text-[13px] text-muted-foreground truncate">
              {otherUser.email}
            </p>
          </div>
        </div>
        <div className="flex text-muted-foreground items-center gap-4">
          <Video className="w-5 h-5 cursor-pointer hover:text-foreground transition" />
          <Phone className="w-5 h-5 cursor-pointer hover:text-foreground transition" />
          <EllipsisVertical className="w-5 h-5 cursor-pointer hover:text-foreground transition" />
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="w-full h-[550px] bg-gray-50 px-6">
        <div className="space-y-6">
          {/* Date Separator */}
          <div className="flex items-center justify-center gap-3 my-4">
            <span className="text-xs font-medium text-muted-foreground">
              Today
            </span>
          </div>

          {/* Messages */}
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {/* Avatar - Only for received messages */}
                {message.senderId !== currentUserId && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={otherUser.image || undefined} />
                    <AvatarFallback className="text-xs font-bold text-white">
                      {otherUser.initials}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Message Content */}
                <div
                  className={`flex flex-col gap-1 max-w-md ${
                    message.senderId === currentUserId
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  {/* Sender Info - Only for received messages */}
                  {message.senderId !== currentUserId && (
                    <div className="flex items-center gap-2 px-3">
                      <span className="text-sm font-medium text-foreground">
                        {otherUser.name}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className="flex gap-2 items-end group">
                    <div
                      className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        message.senderId === currentUserId
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-foreground rounded-bl-none"
                      }`}
                    >
                      {message.content}
                    </div>

                    {/* Message Actions */}
                    <button className="opacity-0 cursor-pointer group-hover:opacity-100 transition p-1 rounded">
                      <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Time & Read Status for own messages */}
                  {message.senderId === currentUserId && (
                    <div className="flex items-center gap-1 px-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <CheckCheck className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t px-6 h-17 flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Smile className="w-5 h-5 text-muted-foreground" />
        </button>
        <Input
          placeholder="Write a message..."
          className="rounded-full bg-gray-50 border-gray-200"
        />
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Plus className="w-5 h-5 text-muted-foreground" />
        </button>
        <Button className="rounded-full p-2 h-10 w-10 bg-blue-500 hover:bg-blue-600">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
  
};
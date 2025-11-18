"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserRoundX, UsersIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AcceptedFriends = () => {
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery({
    ...trpc.friends.getAllFriends.queryOptions(),
    refetchInterval: 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-2 w-24 bg-gray-200 rounded" />
            </div>

          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">Something went wrong</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 text-center gap-2">
        <UsersIcon className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No friends yet
        </p>
        <p className="text-xs text-muted-foreground/60">
          Search and add friends to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-3  h-full">
           
      <ScrollArea className="flex-1">
        <div className="space-y-1 py-3 ">
          {data?.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between gap-2 rounded-lg hover:bg-accent px-1 py-1 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Avatar className="h-10 w-10 ">
                  <AvatarImage src={friend.image || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs font-bold bg-blue-100 text-blue-700">
                    {friend.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-foreground">
                    {friend.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {friend.email}
                  </p>
                </div>
              </div>
                <Button
                  size="icon"
                  className="rounded-full w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white"
                  title="Message"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

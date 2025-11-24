"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserRoundCheck, UserRoundX, InboxIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ReceivedInvitations = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const accept = useMutation({
    ...trpc.friends.acceptInvitation.mutationOptions(), // This already includes mutationFn
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.friends.getAll.queryKey(), // Wrapped in object
      });
    },
  });

  const reject = useMutation({
    ...trpc.friends.rejectInvitation.mutationOptions(), // This already includes mutationFn
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.friends.getAll.queryKey(), // Wrapped in object
      });
    },
  });

  const { data, isLoading, error } = useQuery({
    ...trpc.friends.getAll.queryOptions(),
  });

  const onAccept = (id: string) => {
    accept.mutate({ requestId: id });
  };

  const onReject = (id: string) => {
    reject.mutate({ requestId: id });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
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
      <div className="flex flex-col w-full h-full p-6  items-center justify-center     text-center gap-2">
        <InboxIcon className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No invitations yet
        </p>
        <p className="text-xs text-muted-foreground/60">
          When you receive friend requests, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className=" ">
          {data?.map((elem) => (
            <div
              key={elem.id}
              className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <Avatar className="h-10 w-10 ">
                  <AvatarImage
                    src={elem.requester.image || ""}
                  />
                  <AvatarFallback className="text-xs font-bold bg-blue-100 text-blue-700">
                    {elem.requester.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate text-foreground">
                    {elem.requester.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {elem.requester.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 ">
                <Button
                  onClick={() => onAccept(elem.id)}
                  size="icon"
                  className="rounded-full w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white"
                  title="Accept"
                >
                  <UserRoundCheck className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => onReject(elem.id)}
                  size="icon"
                  variant="outline"
                  className="rounded-full w-8 h-8"
                  title="Decline"
                >
                  <UserRoundX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

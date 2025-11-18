"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {  UserRoundPlusIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  image?: string | null;
}



export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const addFriend = useMutation({
    ...trpc.friends.addFriend.mutationOptions(),
    onSuccess: () => {
      // Invalidate and refetch the friends query
      queryClient.invalidateQueries({
        queryKey: trpc.friends.getAll.queryKey(),
      });
    },
  });

  const { data, isLoading, error } = useQuery({
    ...trpc.friends.search.queryOptions({ q: searchQuery }),
    enabled: searchQuery.length > 0,
  });

  const users = data || [];

  const handleUserSelect = (user: User) => {
    setSearchQuery("");
    setIsOpen(false);
    addFriend.mutate({ userId: user.id });
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between gap-5 bg-white rounded-xl p-4 border">
        <Input
          placeholder="Search for friends to start chatting..."
          className="rounded-full tracking-tight border-0 focus-visible:ring-0"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => searchQuery.length > 0 && setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-xs z-50">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 gap-2">
              <Spinner className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">
                Searching...
              </span>
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-destructive">
              Error loading users. Try again.
            </div>
          ) : users.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No users found
            </div>
          ) : (
            <ScrollArea className="h-max max-h-96">
              <div className="flex flex-col">
                {users.map((user) => (
                  <div key={user.name} className="px-4 flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.name}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUserSelect(user)}
                      size="icon"
                      className="rounded-full w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white"
                      title="Add"
                    >
                      <UserRoundPlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
};

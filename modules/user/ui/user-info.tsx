"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export const UserInfo = () => {

    const { data, error, isPending } = authClient.useSession();
  
    

  return (
    <div className="flex items-center gap-2">
        <Avatar className="w-11 h-11">
          <AvatarImage src={data?.user.image || ""} />
          <AvatarFallback>{data?.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      <div className="flex flex-col leading-5 tracking-tight ">
        <h1 className="font-semibold ">{data?.user.name}</h1>
        <span className="text-sm  text-muted-foreground">Info account</span>
      </div>
    </div>
  );
};

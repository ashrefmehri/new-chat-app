import { UserRoundPlus } from "lucide-react";
import { ReceivedInvitations } from "./received-invitarions";
import { AcceptedFriends } from "./accepted-friends";

export const FriendsSideBar = () => {
  return (
    <div className="w-90 border tracking-tight bg-white h-full flex flex-col space-y-6 rounded-xl">
      <div className="h-1/2 space-y-2">
        <div className="text-muted-foreground px-4 mt-3 font-medium flex items-center justify-between">
          <span className="text-[13px]  ">Invitations</span>
          <UserRoundPlus className="w-4 h-4" />
        </div>
        <div className="w-full h-full">
          <ReceivedInvitations />
        </div>
      </div>
      <div className="w-full h-1/2   ">
        <div className="text-muted-foreground px-4 mt-3 font-medium ">
          <span className="text-[13px]  ">Friends</span>
        </div>
      <div className="w-full h-full">
        <AcceptedFriends/>
      </div>
      </div>
    </div>
  );
};

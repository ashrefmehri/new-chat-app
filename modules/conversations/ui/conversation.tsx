import { UserAvatar } from "@/modules/user/ui/user-avatar";

export const Conversation = () => {
  return (
    <div className="hover:bg-gray-50 tracking-tighter  cursor-pointer rounded-lg px-1 py-2 ">
      <div className="flex items-center gap-3">
        <UserAvatar />
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-[15px]">Moez Mahjoub</span>
            <span className="text-xs  text-muted-foreground">11:34 AM</span>
          </div>
          <p className="text-sm text-muted-foreground truncate w-40">Great Performance Glad Of War ya </p>
        </div>
      </div>
    </div>
  );
};

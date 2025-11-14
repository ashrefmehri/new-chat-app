import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserInfo = () => {
  return (
    <div className="flex items-center gap-2">
        <Avatar className="w-11 h-11">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      <div className="flex flex-col leading-5 tracking-tight ">
        <h1 className="font-semibold ">Achref Mehri</h1>
        <span className="text-sm  text-muted-foreground">Info account</span>
      </div>
    </div>
  );
};

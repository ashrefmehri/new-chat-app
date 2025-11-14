import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export const UserAvatar =()=>{
    return (
        <Avatar className="w-11 h-11">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}

import { SearchBar } from "@/components/search-bar";
import { CoversationsSidebar } from "@/modules/conversations/ui/conversations-sidebar";
import { FriendsSideBar } from "@/modules/friends/ui/friends-sidebar";

export default function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="w-full h-screen flex gap-3 overflow-hidden p-4 bg-gray-100">
        <CoversationsSidebar />
        <div className="w-full flex flex-col gap-3 h-full">
          <SearchBar/>
          {children}
          </div>
        <FriendsSideBar/>
      </div>
   
  );
}

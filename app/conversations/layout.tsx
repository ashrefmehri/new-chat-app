
import { CoversationsSidebar } from "@/modules/conversations/ui/conversations-sidebar";

export default function ConversationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="w-full h-screen flex gap-3 overflow-hidden p-4 bg-gray-100">
        <CoversationsSidebar />
        <div className="w-full h-full">{children}</div>
      </div>
   
  );
}

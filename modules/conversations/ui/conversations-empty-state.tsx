import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const ConversationsEmptyState =()=>{
    return (
        <div className="flex tracking-tighter flex-col items-center justify-center h-full">
            <h1 className="font-semibold">It looks a little lonely in here!</h1>
            <p className="text-sm text-muted-foreground">Add friends to start chatting</p>
        <Button size="icon" className="mt-4 bg-blue-500 hover:bg-blue-500/90 rounded-full ">
            <Plus/>
        </Button>
        </div>
    )
}
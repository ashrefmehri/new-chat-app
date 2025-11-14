import Image from "next/image"

export const EmptyState =()=>{
    return (
        <div className="w-full h-full justify-center bg-white rounded-lg border flex flex-col space-y-5 tracking-tighter items-center">
            <Image src="/Empty.svg" alt="Empty" width={230} height={50} />
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-medium">No Conversation yet !!</h1>
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
        </div>
    )
}
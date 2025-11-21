import { auth } from "@/lib/auth"
import { ConversationView } from "@/modules/conversations/ui/conversation-view";
import { headers } from "next/headers"
import { redirect } from "next/navigation";

type Params = Promise<{ conversationId: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


export  default async function ConversationPage(props: {
  params: Params,
  searchParams: SearchParams
}) {
  
  const params = await props.params
  
    
    

 
  

  const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect("/")
    }

  return (
    <div className="w-full h-full">
      <ConversationView conversationId={params.conversationId}/>
    </div>
  )
}
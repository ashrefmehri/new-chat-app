import { EmptyState } from "@/components/empty-state"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";
 const CoversationsPage = async ()=>{

    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect("/")
    }

    return(
        <div className="w-full h-full">
            <EmptyState/>
        </div>
    )
}
export default CoversationsPage
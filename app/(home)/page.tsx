import { AuthView } from "@/modules/auth/sign-in-view";
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth.api.getSession({
        headers: await headers()
    })
    if(session) {
        redirect("/conversations")
    }


  return (
    <div className="w-full h-full p-6">
      <AuthView/>
    </div>
  );
}

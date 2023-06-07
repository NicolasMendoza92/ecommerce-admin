import Layout from "@/components/layout";
import { useSession } from "next-auth/react";


export default function Home() {
  // esto son estados que nos da next-auth
  const { data: session } = useSession();


  return <Layout>
    <div className="text-blue-900 flex justify-between ">
      <h2>
        Hello, <b>{session?.user?.name}</b> 
      </h2>
      <div className="flex bg-grey-300 gap-1 rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="mi carota" className="w-8 h-8 " />
        <span className="px-2">
        {session?.user?.name}
        </span>
      </div>
    </div>
  </Layout>
}

import HomeHeader from "@/components/HomeHeader";
import HomeStats from "@/components/HomeStats";
import Layout from "@/components/layout";
import { signIn, useSession } from "next-auth/react";

export default function Home() {

  const { data: session } = useSession();

  if (!session) {
    return (
      <div className='bg-highlight w-screen h-screen flex justify-center items-center'>
        <div className="bg-primary p-4 rounded-md flex-col items-center">
          <h1 className="mystore text-center m-2">My Store</h1>
          <p className="mystoretext text-center">Welcome to dasboard admin</p>
          <div className="text-center m-2 ">
            <button onClick={() => signIn('')} className="btn-google p-2 px-4 rounded-lg"> Sing In</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <HomeHeader />
      <HomeStats/>
    </Layout>
  )
}

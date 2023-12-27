import HomeHeader from "@/components/HomeHeader";
import HomeStats from "@/components/HomeStats";
import Layout from "@/components/layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SinginForm from "./SigninForm";

export default function Home() {

  const { data: session } = useSession();
  const router = useRouter();


  if (!session) {
    return (
      <div className='bg-highlight w-screen h-screen flex justify-center items-center'>
        <SinginForm/>
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

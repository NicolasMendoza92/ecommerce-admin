import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const { data: session } = useSession();
  // con estados, como si fuera un modal trabajamos el dashboard
  const [showNav, setShowNav] = useState(false);

  if (!session) {
    return (
      <div className='bg-highlight w-screen h-screen flex justify-center items-center'>
        <div className="bg-primary p-4 rounded-md flex-col items-center">
          <h1 className="mystore text-center m-2">My Store</h1>
          <p className="mystoretext text-center">Welcome to dasboard admin</p>
          <div className="text-center m-2 ">
            <button onClick={() => signIn('google')} className="btn-google p-2 px-4 rounded-lg"> Continue whit Google</button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-highlight min-h-screen">
      {/* el hmaburgesa estara d-block en pantallas md  */}
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>

      <div className='flex pt-2'>
        <Nav showNav={showNav} setShowNav={setShowNav} />
        <div className="bg-white flex-grow m-3 rounded-lg p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
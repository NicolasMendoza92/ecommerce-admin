import Nav from "@/components/Nav"
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  // con estados, como si fuera un modal trabajamos el dashboard
  const [showNav, setShowNav] = useState(false);

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
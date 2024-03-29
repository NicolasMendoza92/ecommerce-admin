import { useSession } from "next-auth/react";

export default function HomeHeader() {
    // traigo los datos de nextAuth, con useSession
    const { data: session } = useSession();
    console.log(session.user.image)
    return (
        <div className="text-blue-900 flex justify-between ">

            <div className="mt-0">
                <div className="flex gap-2 items-center">
                    {session?.user?.image === undefined ? (<> </> ): <img src={session?.user?.image} alt="mi carota" className="w-8 h-8 rounded-md md:hidden " />}
                    <h2>Hello, <b>{session?.user?.email}</b></h2>
                </div>
            </div>

            <div className="hidden md:block ">
                <div className="flex bg-grey-300 gap-1 rounded-lg overflow-hidden">
                {session?.user?.image === undefined ? (<> </> ): <img src={session?.user?.image} alt="mi carota" className="w-8 h-8 rounded-md md:hidden " />}
                    <span className="px-2">
                        {session?.user?.email }
                    </span>
                </div>
            </div>

        </div>
    )
}



import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";


export default function SinginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    // handle errors 
    const [error, setError] = useState("");

    const router = useRouter();

    // handler with credentials
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res.error) {
                setError("Invalid Credentials");
                return;
            }

            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    // Google Handler function
    async function handleGoogleSignin() {
        signIn('google', { callbackUrl: "http://localhost:3000" })
    }

    return (
        <div className="grid place-items-center h-screen">
            <div className="shadow-lg bg-primary text-black p-5 rounded-lg border-t-4">
                <h1 className="mystore text-center m-2">TECH STORE</h1>
                <p className="mystoretext text-center">Welcome to dasboard admin</p>
                <p className="mycredentialstext text-center">email: admin@gmail.com - pass: Admin123</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        className="px-2 py-2 rounded-md"
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder="Email"
                    />
                    <input
                        className="px-2 py-2 rounded-md"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                    />
                    <button className="button_credentials">
                        Login with credentials
                    </button>

                    {error && (
                        <div className="bg-red-500 text-white w-fit text-sm py-1 px-2 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                </form>
                <div className="my-2">
                    <button onClick={handleGoogleSignin} className="button_google">
                        <Image alt="googleIcon" src={'/assets/google.svg'} width="20" height={20} ></Image>  Sign In with Google
                    </button>
                </div>
            </div>
        </div>
    )
}
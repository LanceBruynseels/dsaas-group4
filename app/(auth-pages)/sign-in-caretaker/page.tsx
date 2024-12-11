import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <Image src="/vlinder_logo_caretaker.png" alt="Vlinder Logo" width={200} height={200} priority/>
                    <h1 className="text-5xl font-bold text-gray-800">VLINDER</h1>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg bg-[#771D1D]">
                    <h2 className="text-2xl font-semibold mb-4">Sign in caretaker</h2>
                    <p className="text-sm mb-6">
                        Don't have an account?{" "}
                        <Link href="/sign-up-caretaker" className="underline text-white hover:text-gray-200">
                            Sign up
                        </Link>
                    </p>

                    <form className="flex flex-col gap-4" action={signInAction}>
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </Label>
                            <Input
                                name="email"
                                placeholder="you@example.com"
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>


                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-white underline hover:text-gray-200"
                                >
                                    {/*do we need this*/}
                                    Forgot Password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Your password"
                                required
                                className="w-full px-4 py-2 border bg-white rounded-lg text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>

                        <SubmitButton
                            pendingText="Signing In..."
                            className="w-full bg-[#FCA5A5] hover:bg-pink-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
                        >
                            Sign in
                        </SubmitButton>

                        <FormMessage message={searchParams} />
                    </form>
                </div>
            </div>
        </div>
    );
}
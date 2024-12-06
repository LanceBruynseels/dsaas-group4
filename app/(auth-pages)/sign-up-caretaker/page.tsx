import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;

    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-10 space-y-8 lg:space-y-0 w-full max-w-5xl">
                {/* Left Side: Logo and Brand */}
                <div className="flex flex-col items-center w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                    <Image src="/vlinder_logo_caretaker.png" alt="Vlinder Logo" width={200} height={200} priority/>
                    <h1 className="text-5xl font-bold text-gray-800">VLINDER</h1>
                </div>

                {/* Right Side: Sign Up Form */}
                <div className="w-full lg:w-1/3 p-8 text-white rounded-lg shadow-lg bg-[#771D1D]">
                    <h2 className="text-2xl font-semibold mb-4">Sign up caretaker</h2>
                    <p className="text-sm mb-6">
                        Already have an account?{" "}
                        <Link href="/sign-in-caretaker" className="underline text-white hover:text-gray-200">
                            Sign in
                        </Link>
                    </p>

                    <form className="flex flex-col gap-4" action={signUpAction}>
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
                            <Label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </Label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Your password"
                                minLength={6}
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>

                        <div>
                            <Label htmlFor="displayName" className="block text-sm font-medium mb-1">
                                Display Name
                            </Label>
                            <Input
                                name="displayName"
                                placeholder="Your name"
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>

                        <div>
                            <Label htmlFor="accessCode" className="block text-sm font-medium mb-1">
                                Access code
                            </Label>
                            <Input
                                name="accessCode"
                                placeholder="Your access code"
                                required
                                className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 focus:outline-none focus:border-pink-300"
                            />
                        </div>

                        <SubmitButton
                            pendingText="Signing up..."
                            className="w-full bg-[#FCA5A5] hover:bg-pink-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
                        >
                            Sign up
                        </SubmitButton>

                        <FormMessage message={searchParams}/>
                    </form>
                </div>
            </div>
            <SmtpMessage/>
        </div>
    );
}
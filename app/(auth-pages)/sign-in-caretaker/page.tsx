"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from 'react'

export default function Login() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError(error.message)
                return
            }

            router.push('/home')
            router.refresh()
        } catch (error) {
            setError('An error occurred during sign in')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-w-64">
            <h1 className="text-2xl font-medium">Sign in</h1>
            <p className="text-sm text-foreground">
                Don't have an account?{" "}
                <Link className="text-foreground font-medium underline" href="/sign-up">
                    Sign up
                </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="email">Email</Label>
                <Input
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        className="text-xs text-foreground underline"
                        href="/forgot-password"
                    >
                        Forgot Password?
                    </Link>
                </div>
                <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                />
                <button
                    type="submit"
                    className="bg-foreground text-background hover:opacity-90 px-4 py-2 rounded-md transition-opacity"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing In...' : 'Sign in'}
                </button>
                {error && (
                    <div className="text-destructive text-sm mt-2 border-l-2 border-destructive px-4">
                        {error}
                    </div>
                )}
            </div>
        </form>
    )
}
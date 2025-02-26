'use client'

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const errorMessages: Record<string, string> = {
    CredentialsSignin: "Invalid credentials. Please check your email and password.",
    OAuthSignin: "There was an error signing in with the OAuth provider.",
    OAuthCallback: "Error during OAuth callback. Please try again.",
    Default: "An unexpected error occurred. Please try again later.",
};

export default function Login() {
    const { data: session } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (session) {
            router.push("/app");
        }
    }, [session, router]);

    const handleSignIn = async (
        provider: "credentials" | "github",
        data: Record<string, string> = {}
    ) => {
        setError("");
        try {
            const result = await signIn(provider, {
                redirect: false,
                callbackUrl: "/app",
                ...data,
            });
            if (result?.error) {
                const message = errorMessages[result.error] || errorMessages["Default"];
                setError(message);
            } else if (result?.url) {
                router.push(result.url);
            }
        } catch (err) {
            console.error(`${provider} sign in error:`, err);
            setError(errorMessages["Default"]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSignIn("credentials", { email, password });
    };

    const handleGitHubSignIn = async () => {
        await handleSignIn("github");
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={handleGitHubSignIn}>Login with GitHub</button>
            <hr />
            <p>
                Dont have an account? <a href="/register">Register</a>
            </p>
        </div>
    );
}

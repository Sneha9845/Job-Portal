"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simple hardcoded check
        if (email === "admin@jobportal.com" && password === "admin123") {
            setTimeout(() => {
                login(email);
                router.push("/admin/dashboard");
            }, 1000);
        } else {
            setLoading(false);
            alert("Invalid credentials! Try admin@jobportal.com / admin123");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="admin@jobportal.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md active:scale-95 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Logging in..." : "Login to Dashboard"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 underline">
                        Back to Worker Portal
                    </Link>
                </div>
            </div>
        </main>
    );
}

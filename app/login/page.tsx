"use client";

import { useState } from "react";
import { useWorkers } from "../context/WorkerContext";
import { useLanguage } from "../context/LanguageContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const { loginWorker } = useWorkers();
    const { t } = useLanguage();
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const success = loginWorker(identifier);
        setIsLoading(false);

        if (success) {
            router.push("/worker/dashboard");
        } else {
            setError(t("login.error"));
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <User size={32} />
                </div>

                <h1 className="text-2xl font-black text-slate-800 tracking-tight text-center mb-6">{t("login.title")}</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">{t("login.identifier")}</label>
                        <input
                            required
                            type="text"
                            placeholder={t("login.placeholder")}
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Logging in..." : t("login.submit")}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">Don't have an account?</p>
                    <Link href="/register" className="text-blue-600 font-bold hover:underline">
                        Register here
                    </Link>
                </div>

                <Link href="/" className="mt-4 text-sm text-gray-400 hover:text-gray-600">
                    Back to Home
                </Link>

                <div className="mt-8 border-t border-gray-100 w-full pt-4 text-center">
                    <Link href="/admin/login" className="text-xs text-slate-300 hover:text-slate-500">
                        Admin Access
                    </Link>
                </div>
            </div>
        </main>
    );
}

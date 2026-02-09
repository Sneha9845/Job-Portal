"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("app-user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string) => {
        const newUser = { email, name: "Admin User" };
        setUser(newUser);
        localStorage.setItem("app-user", JSON.stringify(newUser));

        // Request and trigger notification
        if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    new Notification("Welcome to Govind's Job Portal", {
                        body: "You will now receive alerts for new daily wage jobs!",
                        icon: "/icon.png" // assuming standard icon or fallback
                    });
                }
            });
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("app-user");
        router.push("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

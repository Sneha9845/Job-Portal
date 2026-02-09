import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { JobProvider } from "./context/JobContext";
import { AuthProvider } from "./context/AuthContext";
import { WorkerProvider } from "./context/WorkerContext";
import { NotificationProvider } from "./context/NotificationContext";
import PhoneNotification from "./components/PhoneNotification";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Worker Job Portal",
  description: "Easy job search for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        <AuthProvider>
          <LanguageProvider>
            <JobProvider>
              <WorkerProvider>
                <NotificationProvider>
                  {children}
                  <PhoneNotification />
                </NotificationProvider>
              </WorkerProvider>
            </JobProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

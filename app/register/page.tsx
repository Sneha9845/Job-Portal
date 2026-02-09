"use client";

import { useState } from "react";
import { useWorkers } from "../context/WorkerContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Mic, Bell } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useNotification } from "../context/NotificationContext";

export default function RegisterPage() {
    const { registerWorker } = useWorkers();
    const { t } = useLanguage();
    const { requestPermission, permission } = useNotification();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        skill: "",
        location: ""
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [listeningField, setListeningField] = useState<string | null>(null);
    const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { name?: string; phone?: string } = {};
        if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = await registerWorker(formData);

        if (result.success) {
            setIsSuccess(true);

            // Request notification permission after successful registration
            if (permission === 'default') {
                setShowNotificationPrompt(true);
            }

            setTimeout(() => {
                router.push("/");
            }, 3000);
        } else {
            if (result.error?.includes("already registered")) {
                setErrors({ ...errors, phone: "This number is already registered!" });
            } else {
                alert(result.error);
            }
        }
    };

    const startListening = (field: keyof typeof formData) => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US'; // Could be dynamic
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            setListeningField(field);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                // Simple logic: if field is phone, strip non-digits. 
                // For now, raw transcript is fine, user can edit.
                setFormData(prev => ({ ...prev, [field]: transcript }));
                setListeningField(null);
            };

            recognition.onerror = () => {
                setListeningField(null);
                alert("Voice recognition failed.");
            };

            recognition.onend = () => {
                setListeningField(null);
            };

            recognition.start();
        } else {
            alert("Voice search is not supported in this browser.");
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center gap-4 text-center max-w-sm w-full animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">{t("reg.success")}</h1>
                    <p className="text-slate-600">{t("reg.success_msg")}</p>

                    {showNotificationPrompt && permission === 'default' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 w-full">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                                    <Bell size={20} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-bold text-slate-800 text-sm mb-1">Enable Notifications</h3>
                                    <p className="text-xs text-slate-600 mb-3">Get instant alerts when jobs are assigned to you!</p>
                                    <button
                                        onClick={async () => {
                                            await requestPermission();
                                            setShowNotificationPrompt(false);
                                        }}
                                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Allow Notifications
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
            <header className="w-full max-w-md flex items-center gap-4 py-4 mb-4">
                <Link href="/" className="p-2 bg-white rounded-full shadow-sm border border-gray-200">
                    <ArrowLeft size={24} className="text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-slate-800">{t("reg.title")}</h1>
            </header>

            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-700">{t("reg.name")}</label>
                        <div className="relative">
                            <input
                                required
                                type="text"
                                placeholder={t("reg.placeholder.name")}
                                className="w-full p-3 pr-12 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => startListening('name')}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${listeningField === 'name' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500'}`}
                            >
                                <Mic size={18} />
                            </button>
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-700">{t("reg.email")}</label>
                        <input
                            required
                            type="email"
                            placeholder={t("reg.placeholder.email")}
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-700">{t("reg.phone")}</label>
                        <div className="relative">
                            <input
                                required
                                type="tel"
                                placeholder={t("reg.placeholder.phone")}
                                className="w-full p-3 pr-12 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => startListening('phone')}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${listeningField === 'phone' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500'}`}
                            >
                                <Mic size={18} />
                            </button>
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-700">{t("reg.skill")}</label>
                        <select
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                            value={formData.skill}
                            onChange={e => setFormData({ ...formData, skill: e.target.value })}
                        >
                            <option value="">{t("reg.placeholder.skill")}</option>
                            <option value="Driver">{t("job.driver")}</option>
                            <option value="Painter">{t("job.painter")}</option>
                            <option value="Helper">{t("job.helper")}</option>
                            <option value="Cook">{t("job.cook")}</option>
                            <option value="Other">{t("categories.all")}</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-700">{t("reg.location")}</label>
                        <select
                            required
                            className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        >
                            <option value="">{t("reg.placeholder.location")}</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                            <option value="All India">All India</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
                    >
                        {t("reg.submit")}
                    </button>

                </form>
            </div>
        </main>
    );
}

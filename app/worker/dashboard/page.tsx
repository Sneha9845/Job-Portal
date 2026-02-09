"use client";

import { useWorkers } from "../../context/WorkerContext";
import { useJobs } from "../../context/JobContext";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { User, MapPin, Briefcase, Phone, LogOut, CheckCircle } from "lucide-react";
import Link from "next/link";
import JobCard from "../../components/JobCard";

export default function WorkerDashboard() {
    const { currentWorker, logoutWorker } = useWorkers();
    const { jobs } = useJobs();
    const { t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        if (!currentWorker) {
            router.push("/login");
        }
    }, [currentWorker, router]);

    const assignedJob = useMemo(() => {
        if (!currentWorker?.assignedJobId) return null;
        return jobs.find(j => j.id.toString() === currentWorker.assignedJobId);
    }, [currentWorker, jobs]);

    if (!currentWorker) return null;

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
            <div className="w-full max-w-lg flex flex-col gap-6">
                {/* Header */}
                <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                            {currentWorker.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800">{currentWorker.name}</h1>
                            <p className="text-xs text-gray-500">{t("dashboard.title")}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logoutWorker();
                            router.push("/");
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </header>

                {/* Status Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{t("dashboard.status")}</h2>

                    {currentWorker.assignedJobId ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-3 rounded-lg self-start">
                                <CheckCircle size={20} />
                                <span>{t("dashboard.hired")}</span>
                            </div>

                            {/* Detailed Assignment Card */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-3">
                                <h3 className="font-bold text-blue-800 text-lg">{t("dashboard.job_details")}</h3>

                                {assignedJob && (
                                    <div className="flex justify-between items-start border-b border-blue-200 pb-3">
                                        <div>
                                            <p className="font-bold text-gray-800">{assignedJob.title}</p>
                                            <p className="text-sm text-gray-600">{currentWorker.assignmentDetails?.salary || assignedJob.salary}</p>
                                        </div>
                                        <span className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold shadow-sm">
                                            {currentWorker.assignmentDetails?.reportingTime || assignedJob.time}
                                        </span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-blue-600 mt-1 shrink-0" size={18} />
                                        <div>
                                            <p className="text-xs text-blue-600 font-bold uppercase">{t("dashboard.location")}</p>
                                            <p className="text-gray-800 font-medium">{currentWorker.assignmentDetails?.location || assignedJob?.location}</p>
                                        </div>
                                    </div>

                                    {currentWorker.assignmentDetails?.guideName && (
                                        <div className="flex items-start gap-3">
                                            <User className="text-blue-600 mt-1 shrink-0" size={18} />
                                            <div>
                                                <p className="text-xs text-blue-600 font-bold uppercase">{t("dashboard.supervisor")}</p>
                                                <p className="text-gray-800 font-medium">{currentWorker.assignmentDetails.guideName}</p>
                                            </div>
                                        </div>
                                    )}

                                    {currentWorker.assignmentDetails?.instructions && (
                                        <div className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-gray-700 italic">
                                            "{currentWorker.assignmentDetails.instructions}"
                                        </div>
                                    )}
                                </div>

                                {currentWorker.assignmentDetails?.guidePhone && (
                                    <div className="mt-2 text-center">
                                        <p className="text-xs text-gray-500 mb-1">Need help? Contact the site supervisor</p>
                                        <a
                                            href={`tel:${currentWorker.assignmentDetails.guidePhone}`}
                                            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-sm transition-colors w-full"
                                        >
                                            <Phone size={20} />
                                            {t("dashboard.call_supervisor")}: {currentWorker.assignmentDetails.guidePhone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 p-3 rounded-lg self-start">
                                <Briefcase size={20} />
                                <span>{t("dashboard.pending")}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">
                                {t("dashboard.pending_msg")}
                            </p>
                        </div>
                    )}
                </div>

                {/* Profile Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{t("dashboard.profile")}</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <User size={20} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">{t("dashboard.full_name")}</p>
                                <p className="font-medium">{currentWorker.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone size={20} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">{t("reg.phone")}</p>
                                <p className="font-medium">{currentWorker.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Briefcase size={20} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">{t("reg.skill")}</p>
                                <p className="font-medium capitalize">{t("job." + currentWorker.skill.toLowerCase())}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin size={20} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">{t("reg.location")}</p>
                                <p className="font-medium">{currentWorker.location}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Link href="/" className="text-center text-sm text-gray-400 hover:text-blue-600">
                    {t("dashboard.back_home")}
                </Link>
            </div>
        </main>
    );
}

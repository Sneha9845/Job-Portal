"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { User, MapPin, Briefcase, Phone, LogOut, CheckCircle, AlertTriangle, Send } from "lucide-react";
import JobMap from "../../components/JobMap";
import Link from "next/link";
import JobCard from "../../components/JobCard";
import { useWorkers } from "../../context/WorkerContext";
import { useJobs } from "../../context/JobContext";
import { useLanguage } from "../../context/LanguageContext";

export default function WorkerDashboard() {
    const { currentWorker, logoutWorker, reportComplaint, completeAssignment } = useWorkers();
    const { jobs } = useJobs();
    const { t } = useLanguage();
    const router = useRouter();

    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaintData, setComplaintData] = useState({ type: "Wrong Location", message: "" });

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
            <div className="max-w-md w-full flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <User size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800">{t("dashboard.welcome")},</h1>
                            <p className="text-sm text-gray-500">{currentWorker.name}</p>
                        </div>
                    </div>
                    <button onClick={logoutWorker} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Assignment Status */}
                <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-0"></div>

                    <h2 className="text-xl font-black text-gray-800 mb-4 relative z-10">{t("dashboard.status")}</h2>

                    {currentWorker.assignedJobId ? (
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 p-3 rounded-xl self-start mb-6">
                                <CheckCircle size={20} />
                                <span>{t("dashboard.hired")}</span>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col gap-4">
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

                                {currentWorker.assignmentDetails?.location && (
                                    <div className="mt-2 h-[200px] w-full rounded-lg overflow-hidden border border-blue-200">
                                        <JobMap location={currentWorker.assignmentDetails.location} />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-blue-600 mt-1 shrink-0" size={18} />
                                        <div>
                                            <p className="text-xs text-blue-600 font-bold uppercase">{t("reg.location")}</p>
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

                                {/* NEW: Action Buttons for Eager Workers and Feedback */}
                                <div className="mt-4 flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            if (confirm("Have you finished this job early? Clicking this will make you available for another assignment immediately.")) {
                                                completeAssignment(currentWorker.id);
                                            }
                                        }}
                                        className="bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 hover:bg-green-700 transition-all active:scale-95"
                                    >
                                        <CheckCircle size={20} />
                                        Work Finished / Ready for Next Job
                                    </button>

                                    <button
                                        onClick={() => setShowComplaintForm(!showComplaintForm)}
                                        className="bg-white text-orange-600 border-2 border-orange-100 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"
                                    >
                                        <AlertTriangle size={20} />
                                        Report a Problem
                                    </button>
                                </div>

                                {/* NEW: Complaint Submission Form */}
                                {showComplaintForm && (
                                    <div className="mt-2 p-4 bg-orange-50 rounded-xl border border-orange-200 animate-fade-in">
                                        <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                            <Send size={16} /> Describe the Issue
                                        </h4>
                                        <div className="flex flex-col gap-3">
                                            <select
                                                value={complaintData.type}
                                                onChange={e => setComplaintData({ ...complaintData, type: e.target.value })}
                                                className="p-2 rounded-lg border border-orange-200 text-sm font-medium bg-white"
                                            >
                                                <option>Wrong Location</option>
                                                <option>More Work Pressure</option>
                                                <option>Salary Issue</option>
                                                <option>Other</option>
                                            </select>
                                            <textarea
                                                placeholder="Please explain the details here..."
                                                className="p-3 rounded-lg border border-orange-200 text-sm min-h-[80px] bg-white"
                                                value={complaintData.message}
                                                onChange={e => setComplaintData({ ...complaintData, message: e.target.value })}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (!complaintData.message.trim()) return alert("Please provide details.");
                                                    reportComplaint({
                                                        workerId: currentWorker.id,
                                                        type: complaintData.type,
                                                        message: complaintData.message
                                                    });
                                                    setShowComplaintForm(false);
                                                    setComplaintData({ type: "Wrong Location", message: "" });
                                                }}
                                                className="bg-orange-600 text-white font-bold py-2 rounded-lg hover:bg-orange-700 shadow-md active:scale-95 transition-all"
                                            >
                                                Submit Report
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 relative z-10">
                            <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 p-3 rounded-xl self-start">
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

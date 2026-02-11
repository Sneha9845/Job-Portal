"use client";

import { Plus, Users, Briefcase, X, LogOut, Trash2, AlertCircle, Clock, MapPin as MapPinIcon, RefreshCcw } from "lucide-react";
import Link from "next/link";
import JobCard from "../../components/JobCard";
import JobMap from "../../components/JobMap";
import { useJobs } from "../../context/JobContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkers } from "../../context/WorkerContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { jobs, addJob, fetchJobs } = useJobs();
    const { t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();
    const { workers, assignJob, unassignJob, deleteWorker } = useWorkers();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [complaints, setComplaints] = useState<any[]>([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            const res = await fetch("/api/complaints");
            if (res.ok) {
                const data = await res.json();
                setComplaints(data);
            }
        };
        fetchComplaints();
        const interval = setInterval(fetchComplaints, 10000);
        return () => clearInterval(interval);
    }, []);

    // Form State (moved up)
    const [newJob, setNewJob] = useState({
        title: "",
        salary: "",
        location: "",
        time: "",
        color: "bg-blue-500 text-blue-700",
        category: ""
    });

    // Protect Route
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/admin/login");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Automatic Formatting for Salary (Rs/₹)
        let formattedSalary = newJob.salary.trim();
        if (!formattedSalary.includes("₹") && !formattedSalary.toLowerCase().includes("rs")) {
            formattedSalary = `₹ ${formattedSalary}`;
        }
        if (!formattedSalary.includes("/") && !formattedSalary.toLowerCase().includes("per")) {
            formattedSalary = `${formattedSalary}/day`; // Default to daily if not specified
        }

        // Automatic Formatting for Time (AM/PM)
        let formattedTime = newJob.time.trim();
        // If user just types "9-5", convert to "09:00 AM - 05:00 PM"
        if (formattedTime.toLowerCase() === "full time") {
            formattedTime = "Full Time";
        } else if (formattedTime.toLowerCase().includes("stay") || formattedTime.toLowerCase().includes("live")) {
            formattedTime = "Stay-In (Live-in)";
        } else if (formattedTime && !formattedTime.includes("AM") && !formattedTime.includes("PM")) {
            // Very simple heuristic: if it contains a dash, try to split and add AM/PM
            const parts = formattedTime.split("-");
            if (parts.length === 2) {
                formattedTime = `${parts[0].trim()}:00 AM - ${parts[1].trim()}:00 PM`;
            }
        }

        addJob({
            ...newJob,
            salary: formattedSalary,
            time: formattedTime,
        });
        setShowForm(false);
        setNewJob({ title: "", salary: "", location: "", time: "", color: "bg-blue-500 text-blue-700", category: "" });
    };

    const [assignmentModal, setAssignmentModal] = useState<{ show: boolean; workerId: string | null; workerName: string }>({
        show: false,
        workerId: null,
        workerName: ""
    });

    const [assignmentData, setAssignmentData] = useState({
        jobId: "",
        guideName: "",
        guidePhone: "",
        location: "",
        reportingTime: "",
        instructions: "",
        salary: ""
    });

    const handleAssignmentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!/^\d{10}$/.test(assignmentData.guidePhone)) {
            alert("Guide Phone must be exactly 10 digits.");
            return;
        }

        if (assignmentModal.workerId && assignmentData.jobId) {
            // Automatic Formatting for Assignment Override
            let finalSalary = assignmentData.salary.trim();
            if (finalSalary && !finalSalary.includes("₹") && !finalSalary.toLowerCase().includes("rs")) {
                finalSalary = `₹ ${finalSalary}`;
            }

            let finalTime = assignmentData.reportingTime.trim();
            if (finalTime && !finalTime.includes("AM") && !finalTime.includes("PM") && finalTime.toLowerCase() !== "full time") {
                if (finalTime.toLowerCase().includes("stay") || finalTime.toLowerCase().includes("live")) {
                    finalTime = "Stay-In (Live-in)";
                } else if (finalTime.includes("-")) {
                    const parts = finalTime.split("-");
                    finalTime = `${parts[0].trim()}:00 AM - ${parts[1].trim()}:00 PM`;
                } else if (!isNaN(Number(finalTime))) {
                    finalTime = `${finalTime}:00 AM`; // Simple heuristic for single number
                }
            }

            assignJob(assignmentModal.workerId, {
                jobId: assignmentData.jobId,
                location: assignmentData.location,
                guideName: assignmentData.guideName,
                guidePhone: assignmentData.guidePhone,
                reportingTime: finalTime,
                instructions: assignmentData.instructions,
                salary: finalSalary
            });
            setAssignmentModal({ show: false, workerId: null, workerName: "" });
            // Reset form
            setAssignmentData({ jobId: "", guideName: "", guidePhone: "", location: "", reportingTime: "", instructions: "", salary: "" });
        }
    };

    // Helper to auto-fill some data when a job is selected
    useEffect(() => {
        if (assignmentData.jobId) {
            const job = jobs.find(j => j.id.toString() === assignmentData.jobId);
            if (job) {
                setAssignmentData(prev => ({
                    ...prev,
                    salary: job.salary,
                    location: job.location, // Default to job location
                    reportingTime: job.time
                }));
            }
        }
    }, [assignmentData.jobId, jobs]);


    // Conditional Return MUST be after all hooks
    if (!isAuthenticated) return null;

    return (
        <main className="flex min-h-screen flex-col bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">{t("admin.dashboard")}</h1>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">{t("admin.viewSite")}</Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem("app-jobs-v1");
                            window.location.reload();
                        }}
                        className="text-sm text-red-500 hover:text-red-700 font-bold"
                    >
                        Reset Data
                    </button>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">A</div>
                    <button onClick={logout} className="text-gray-500 hover:text-red-600" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="p-6 max-w-5xl mx-auto w-full relative">

                {/* Assignment Modal */}
                {assignmentModal.show && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Assign Job to {assignmentModal.workerName}</h2>
                                <button onClick={() => setAssignmentModal({ show: false, workerId: null, workerName: "" })} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAssignmentSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Select Job Role</label>
                                    <select required value={assignmentData.jobId} onChange={e => setAssignmentData({ ...assignmentData, jobId: e.target.value })} className="border p-2 rounded w-full mt-1">
                                        <option value="">Choose a job...</option>
                                        {jobs.map(job => (
                                            <option key={job.id} value={job.id}>{job.title} ({job.location})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Reporting Location (Exact)</label>
                                    <input required placeholder="e.g. Gate No 4, Phoenix Mall" value={assignmentData.location} onChange={e => setAssignmentData({ ...assignmentData, location: e.target.value })} className="border p-2 rounded w-full mt-1" />
                                    {assignmentData.location && (
                                        <div className="mt-2 h-[150px] w-full rounded-lg overflow-hidden border border-gray-200">
                                            <JobMap location={assignmentData.location} />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Guide Name</label>
                                        <input required placeholder="Who to meet?" value={assignmentData.guideName} onChange={e => setAssignmentData({ ...assignmentData, guideName: e.target.value })} className="border p-2 rounded w-full mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Guide Phone (Worker will call this)</label>
                                        <input required placeholder="Mobile Number" value={assignmentData.guidePhone} onChange={e => setAssignmentData({ ...assignmentData, guidePhone: e.target.value })} className="border p-2 rounded w-full mt-1" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Reporting Time (with AM/PM)</label>
                                        <input required placeholder="e.g. 09:30 AM" value={assignmentData.reportingTime} onChange={e => setAssignmentData({ ...assignmentData, reportingTime: e.target.value })} className="border p-2 rounded w-full mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Salary</label>
                                        <input required placeholder="e.g. ₹ 500/day" value={assignmentData.salary} onChange={e => setAssignmentData({ ...assignmentData, salary: e.target.value })} className="border p-2 rounded w-full mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Instructions</label>
                                    <textarea placeholder="Bring ID proof, wear safety shoes..." value={assignmentData.instructions} onChange={e => setAssignmentData({ ...assignmentData, instructions: e.target.value })} className="border p-2 rounded w-full mt-1 h-24" />
                                </div>

                                <button type="submit" className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors mt-2">
                                    Confirm Assignment
                                </button>
                            </form>
                        </div>
                    </div>
                )}


                {/* Post Job Modal/Overlay */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Post New Job</h2>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input required placeholder="Job Title (e.g. Driver)" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} className="border p-2 rounded" />
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Salary/Wage</label>
                                    <input required placeholder="e.g. ₹ 600/day or ₹ 15,000/mo" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} className="border p-2 rounded w-full" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Work Hours (AM/PM or Stay-In)</label>
                                    <input required placeholder="e.g. 09:00 AM - 06:00 PM or 'Stay-In'" value={newJob.time} onChange={e => setNewJob({ ...newJob, time: e.target.value })} className="border p-2 rounded w-full" />
                                </div>

                                <select required value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="border p-2 rounded">
                                    <option value="">Select Location</option>
                                    <option value="All India">All India</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi NCR">Delhi NCR</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Hyderabad">Hyderabad</option>
                                    <option value="Chennai">Chennai</option>
                                    <option value="Kolkata">Kolkata</option>
                                    <option value="Pune">Pune</option>
                                </select>

                                <select value={newJob.category} onChange={e => setNewJob({ ...newJob, category: e.target.value })} className="border p-2 rounded">
                                    <option value="">Select Category</option>
                                    <option value="driver">Driver</option>
                                    <option value="painter">Painter</option>
                                    <option value="helper">Helper</option>
                                    <option value="cook">Cook</option>
                                    <option value="other">Other</option>
                                </select>
                                <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg font-bold">Post Job</button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Briefcase size={20} />
                            <span className="font-medium">{t("admin.activeJobs")}</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
                    </div>
                    <div
                        onClick={() => document.getElementById("workers-table")?.scrollIntoView({ behavior: "smooth" })}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-2 text-gray-500">
                            <Users size={20} />
                            <span className="font-medium">{t("admin.registeredWorkers")}</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{workers.length}</p>
                        <p className="text-xs text-blue-600 font-bold">Click to view list ↓</p>
                    </div>

                    <button
                        onClick={() => setShowForm(true)}
                        className="col-span-2 md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 p-4 transition-colors"
                    >
                        <Plus size={32} />
                        <span className="font-bold">{t("admin.postJob")}</span>
                    </button>
                </div>

                {/* Worker Complaints Section */}
                {complaints.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                            <AlertCircle size={24} /> Worker Feedback & Complaints
                        </h2>
                        <div className="flex flex-col gap-3">
                            {complaints.map((c: any) => {
                                const worker = workers.find(w => w.id === c.workerId);
                                return (
                                    <div key={c.id} className="bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-gray-800">{worker?.name || "Unknown Worker"}</span>
                                                <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">{c.type}</span>
                                                <span className="text-xs text-gray-400">{new Date(c.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 italic">"{c.message}"</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    // Simple way to handle: just alert or open worker details
                                                    alert(`Worker Phone: ${worker?.phone}\nLocation: ${worker?.location}`);
                                                }}
                                                className="text-xs font-bold text-blue-600 hover:underline"
                                            >
                                                Contact Worker
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recent Job Posts */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{t("admin.recentListings")}</h2>
                    <button
                        onClick={() => fetchJobs()}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                        <RefreshCcw size={14} /> Refresh List
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {jobs.map((job) => (
                        <JobCard key={job.id} {...job} isAdmin={true} />
                    ))}
                </div>

                {/* Registered Workers Section */}
                <h2 className="text-xl font-bold text-gray-800 mb-4" id="workers-table">{t("admin.registeredWorkers")}</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-medium text-gray-600">{t("admin.name")}</th>
                                <th className="p-4 font-medium text-gray-600">{t("admin.role")}</th>
                                <th className="p-4 font-medium text-gray-600">{t("admin.location")}</th>
                                <th className="p-4 font-medium text-gray-600">{t("admin.status")}</th>
                                <th className="p-4 font-medium text-gray-600">{t("admin.action")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.length > 0 ? workers.map(worker => (
                                <tr key={worker.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800 capitalize">{worker.name}</div>
                                        <div className="text-xs text-gray-500">{worker.email || "No email"}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium capitalize">
                                            {t("job." + worker.skill.toLowerCase())}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{worker.location}</td>
                                    <td className="p-4">
                                        {worker.assignedJobId ? (
                                            <span className="text-green-600 font-bold flex items-center gap-1"><Briefcase size={16} /> {t("admin.assigned")}</span>
                                        ) : (
                                            <span className="text-orange-500 font-medium">{t("admin.pending")}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {!worker.assignedJobId ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setAssignmentModal({ show: true, workerId: worker.id, workerName: worker.name })}
                                                    className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm hover:bg-black transition-colors"
                                                >
                                                    {t("admin.assignJob")}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(t("admin.confirmDelete"))) {
                                                            deleteWorker(worker.id);
                                                        }
                                                    }}
                                                    className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Delete Worker"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to remove this assignment?")) {
                                                            workers.find(w => w.id === worker.id) && unassignJob(worker.id);
                                                        }
                                                    }}
                                                    className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
                                                >
                                                    {t("admin.unassign")}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(t("admin.confirmDelete"))) {
                                                            deleteWorker(worker.id);
                                                        }
                                                    }}
                                                    className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                    title="Delete Worker"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">No workers registered yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </main >
    );
}

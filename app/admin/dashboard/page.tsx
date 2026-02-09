"use client";

import { Plus, Users, Briefcase, X, LogOut, Trash2 } from "lucide-react";
import Link from "next/link";
import JobCard from "../../components/JobCard";
import { useJobs } from "../../context/JobContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkers } from "../../context/WorkerContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { jobs, addJob } = useJobs();
    const { t } = useLanguage();
    const { user, logout, isAuthenticated } = useAuth();
    const { workers, assignJob, unassignJob, deleteWorker } = useWorkers();
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);

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
        addJob({
            ...newJob,
            title: newJob.title,
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
            assignJob(assignmentModal.workerId, {
                jobId: assignmentData.jobId,
                location: assignmentData.location,
                guideName: assignmentData.guideName,
                guidePhone: assignmentData.guidePhone,
                reportingTime: assignmentData.reportingTime,
                instructions: assignmentData.instructions,
                salary: assignmentData.salary
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
                                        <label className="text-sm font-semibold text-gray-600">Reporting Time</label>
                                        <input required placeholder="e.g. 9:00 AM" value={assignmentData.reportingTime} onChange={e => setAssignmentData({ ...assignmentData, reportingTime: e.target.value })} className="border p-2 rounded w-full mt-1" />
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
                                <input required placeholder="Salary (e.g. ₹ 15000/mo)" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} className="border p-2 rounded" />

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

                                <input required placeholder="Time (e.g. 9-5)" value={newJob.time} onChange={e => setNewJob({ ...newJob, time: e.target.value })} className="border p-2 rounded" />
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

                {/* Recent Job Posts */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t("admin.recentListings")}</h2>
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

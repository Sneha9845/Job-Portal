"use client";

import { useParams, useRouter } from "next/navigation";
import { useJobs } from "../../context/JobContext";
import { useLanguage } from "../../context/LanguageContext";
import JobMap from "../../components/JobMap";
import { ArrowLeft, MapPin, Clock, Banknote, Phone, Briefcase } from "lucide-react";
import Link from "next/link";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { jobs } = useJobs();
    const { t } = useLanguage();
    const jobId = params.id as string;

    const job = jobs.find(j => j.id.toString() === jobId);

    if (!job) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                        🤷‍♂️
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Job Not Found</h1>
                    <p className="text-slate-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <Link href="/jobs" className="btn-primary inline-block">
                        ← Back to Jobs
                    </Link>
                </div>
            </main>
        );
    }

    const displayTitle = job.title.startsWith('job.') ? t(job.title) : job.title;

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="container-custom py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl md:text-2xl font-bold font-heading text-slate-800">Job Details</h1>
                </div>
            </header>

            <div className="container-custom py-6 md:py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Job Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-primary to-indigo-700 p-6 md:p-8 text-white">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                                        {t('job.new')} • {t('job.posted')}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                                        {displayTitle}
                                    </h2>
                                    {job.category && (
                                        <p className="text-indigo-100 text-sm">{job.category}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Location */}
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Location</p>
                                        <p className="text-slate-800 font-semibold">{job.location}</p>
                                    </div>
                                </div>

                                {/* Time */}
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Clock className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Working Hours</p>
                                        <p className="text-slate-800 font-semibold">{job.time}</p>
                                    </div>
                                </div>

                                {/* Salary */}
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Banknote className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Salary</p>
                                        <p className="text-green-700 font-bold text-lg">{job.salary}</p>
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                                        <Briefcase className="text-orange-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Job Type</p>
                                        <p className="text-slate-800 font-semibold">Daily Wage</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Job Location</h3>
                                <div className="h-[300px] w-full rounded-xl overflow-hidden border border-slate-200">
                                    <JobMap location={job.location} />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Job Description</h3>
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-slate-600 leading-relaxed">
                                        We are looking for skilled {displayTitle.toLowerCase()} workers for immediate hiring.
                                        This is a great opportunity for experienced workers to join our team and work on various projects
                                        across {job.location}.
                                    </p>
                                    <ul className="mt-4 space-y-2 text-slate-600">
                                        <li>Competitive daily wages</li>
                                        <li>Flexible working hours</li>
                                        <li>Safe working environment</li>
                                        <li>Immediate start available</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <h3 className="text-lg font-bold text-slate-800 mb-3">Requirements</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">✓</span>
                                        <span>Experience in {displayTitle.toLowerCase()} work</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">✓</span>
                                        <span>Ability to work in {job.location}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">✓</span>
                                        <span>Available for {job.time}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Section */}
                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Interested in this job?</h3>
                                <p className="text-slate-600 text-sm text-center mb-6">
                                    Call us now to apply or get more information about this position
                                </p>
                                <a
                                    href={`tel:${job.phone}`}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all text-lg"
                                >
                                    <Phone size={24} />
                                    Call Now: {job.phone}
                                </a>
                                <p className="text-xs text-slate-400 text-center mt-3">
                                    {t('job.apply')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/jobs"
                            className="inline-block text-slate-600 hover:text-primary font-semibold transition-colors"
                        >
                            ← Back to all jobs
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}


"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import JobCard from "../components/JobCard";
import JobMap from "../components/JobMap";
import { useJobs } from "../context/JobContext";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { Suspense, useMemo, useState } from "react";

function JobsList() {
    const { jobs } = useJobs();
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const urlSearch = searchParams.get('search')?.toLowerCase() || "";
    const [searchTerm, setSearchTerm] = useState(urlSearch);
    const [locationFilter, setLocationFilter] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

    // Get unique locations
    const locations = useMemo(() => {
        const locs = new Set(jobs.map(j => j.location).filter(Boolean));
        return ["All", ...Array.from(locs)];
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        const query = searchTerm.toLowerCase();
        return jobs.filter(job => {
            const matchesSearch = !query ||
                t(job.title).toLowerCase().includes(query) ||
                (job.category && job.category.toLowerCase().includes(query)) ||
                job.location.toLowerCase().includes(query);

            const matchesLocation = !locationFilter || locationFilter === "All" ||
                job.location.includes(locationFilter) ||
                (locationFilter === "All India" && job.location === "All India");

            return matchesSearch && matchesLocation;
        });
    }, [jobs, searchTerm, locationFilter, t]);

    const userName = searchParams.get('user');

    return (
        <div className="w-full container-custom flex flex-col gap-6 py-8">
            {/* Welcome Banner */}
            {userName && (
                <div className="bg-gradient-to-r from-primary to-indigo-700 p-6 rounded-xl flex items-center gap-4 animate-fade-in shadow-xl shadow-indigo-200 text-white">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
                        👋
                    </div>
                    <div>
                        <h2 className="font-heading font-bold text-2xl">Welcome, {userName}!</h2>
                        <p className="text-indigo-100">We found some jobs that match your profile.</p>
                    </div>
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-4 z-20 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="🔍 Search jobs, skills, or companies..."
                        className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-auto flex gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {locations.map(loc => (
                        <button
                            key={loc}
                            onClick={() => setLocationFilter(loc)}
                            className={`px - 4 py - 2 rounded - lg text - sm font - semibold whitespace - nowrap transition - all border ${locationFilter === loc || (!locationFilter && loc === "All")
                                    ? "bg-primary text-white border-primary shadow-sm"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                } `}
                        >
                            {loc}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px - 4 py - 1.5 rounded - md text - sm font - medium transition - all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                    >
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px - 4 py - 1.5 rounded - md text - sm font - medium transition - all ${viewMode === 'map' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'} `}
                    >
                        Map
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="flex flex-col gap-4">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <JobCard key={job.id} {...job} />
                        ))
                    ) : (
                        <div className="text-center py-32 flex flex-col items-center gap-4 opacity-60">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl">
                                🤷‍♂️
                            </div>
                            <h3 className="text-xl font-bold text-slate-700">No jobs found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters.</p>
                            <button onClick={() => { setSearchTerm(''); setLocationFilter('All') }} className="text-primary font-bold hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 h-[600px] flex gap-4">
                    <div className="w-1/3 overflow-y-auto pr-2 hidden md:block">
                        {filteredJobs.map(job => (
                            <div key={job.id} className="mb-3 p-3 bg-slate-50 rounded border border-slate-100 cursor-pointer hover:border-primary">
                                <h4 className="font-bold text-slate-800">{t(job.title)}</h4>
                                <p className="text-xs text-slate-500">{job.location}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 h-full rounded bg-slate-100 relative">
                        {filteredJobs.length > 0 ? (
                            <JobMap location={locationFilter && locationFilter !== "All" ? locationFilter : filteredJobs[0].location} />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                No location to show
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function JobsPage() {
    return (
        <main className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="container-custom py-4 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold font-heading text-slate-800">Find Jobs</h1>
                </div>
            </header>

            <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading...</div>}>
                <JobsList />
            </Suspense>
        </main>
    );
}

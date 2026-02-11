"use client";

import { useLanguage } from "../context/LanguageContext";
import { Job } from "../context/JobContext";
import Link from "next/link";
import { Banknote } from "lucide-react";

export interface JobCardProps extends Job {
    isAdmin?: boolean;
}

export default function JobCard({ id, title, salary, location, time, color, phone, isAdmin }: JobCardProps) {
    const { t } = useLanguage();
    const displayTitle = title.startsWith('job.') ? t(title) : title;

    return (
        <div className="group bg-white border-b border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-all duration-200 hover:shadow-sm">
            <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-secondary font-bold text-xs uppercase tracking-wider">{t('job.new')}</span>
                    <span className="text-slate-400 text-xs">• {t('job.posted')}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {displayTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {location}
                        <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-primary px-2 py-0.5 rounded-full font-bold transition-all ml-2 border border-indigo-100 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                            {t('job.location')} Map
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {time}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-slate-700">{salary}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[140px]">
                {!isAdmin ? (
                    <Link href={`/jobs/${id}`} className="w-full md:w-auto btn-primary text-center text-sm">
                        {t('job.view')} ▸
                    </Link>
                ) : (
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">Admin View</span>
                )}
                <span className="text-xs text-slate-400">{t('job.apply')}</span>
            </div>
        </div>
    );
}

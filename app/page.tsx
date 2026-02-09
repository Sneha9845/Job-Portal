"use client";

import Link from "next/link";
import SearchHero from "./components/SearchHero";
import JobCard from "./components/JobCard";
import { useJobs } from "./context/JobContext";
import { useLanguage } from "./context/LanguageContext";
import LanguageToggle from "./components/LanguageToggle";
import { Car, Home as HomeIcon, Shield, HardHat, Briefcase, Utensils } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const { jobs } = useJobs();

  // Get first 4 jobs as featured/recent
  const recentJobs = jobs.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="container-custom py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">W</div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t('app.title')}</h1>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <div className="flex gap-2">
              <Link href="/login" className="text-slate-600 font-semibold hover:text-primary px-2 py-2 text-sm">{t('nav.login')}</Link>
              <Link href="/register" className="btn-primary py-2 px-3 shadow-none text-sm">{t('nav.post_resume')}</Link>
            </div>
          </div>
        </div>
      </nav>

      <SearchHero />

      {/* Stats / Trust Banner */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="container-custom flex flex-wrap justify-center gap-8 md:gap-16 text-center text-slate-500 font-medium uppercase text-sm tracking-wider">
          <span className="flex items-center gap-2"><strong className="text-2xl text-slate-900">{jobs.length}</strong> {t('stats.jobs')}</span>
        </div>
      </div>

      <div className="container-custom py-12 flex-grow">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Sidebar / Filters (Optional, keeping simple for now) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4">{t('categories.title')}</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="font-medium text-primary cursor-pointer flex items-center gap-3">
                  <span className="p-1.5 bg-primary/10 rounded-md"><Briefcase size={18} /></span>
                  {t('categories.all')}
                </li>
                <li className="hover:text-primary cursor-pointer flex items-center gap-3 transition-colors">
                  <span className="p-1.5 bg-slate-100 rounded-md"><Car size={18} /></span>
                  {t('job.driver')}
                </li>
                <li className="hover:text-primary cursor-pointer flex items-center gap-3 transition-colors">
                  <span className="p-1.5 bg-slate-100 rounded-md"><HomeIcon size={18} /></span>
                  {t('job.maid')}
                </li>
                <li className="hover:text-primary cursor-pointer flex items-center gap-3 transition-colors">
                  <span className="p-1.5 bg-slate-100 rounded-md"><Shield size={18} /></span>
                  {t('job.security')}
                </li>
                <li className="hover:text-primary cursor-pointer flex items-center gap-3 transition-colors">
                  <span className="p-1.5 bg-slate-100 rounded-md"><HardHat size={18} /></span>
                  {t('job.helper')}
                </li>
                <li className="hover:text-primary cursor-pointer flex items-center gap-3 transition-colors">
                  <span className="p-1.5 bg-slate-100 rounded-md"><Utensils size={18} /></span>
                  {t('job.cook')}
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t('admin.recentListings')}</h2>
                <p className="text-slate-500">{t('hero.subtitle')}</p>
              </div>
              <Link href="/jobs" className="text-primary font-bold hover:underline">{t('admin.viewSite')} &rarr;</Link>
            </div>

            <div className="flex flex-col gap-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))
              ) : (
                <p className="text-slate-500">No jobs available right now.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-auto">
        <div className="container-custom text-center text-slate-400">
          <p>{t('footer.rights')}</p>
        </div>
      </footer>
    </main>
  );
}

"use client";

import SearchHero from "./components/SearchHero";
import JobCard from "./components/JobCard";
import JobMap from "./components/JobMap";
import Link from "next/link";
import { useJobs } from "./context/JobContext";
import { useLanguage } from "./context/LanguageContext";
import { useGeolocation } from "./hooks/useGeolocation";
import LanguageToggle from "./components/LanguageToggle";
import { Car, Home as HomeIcon, Shield, HardHat, Briefcase, Utensils, Navigation } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { t } = useLanguage();
  const { jobs } = useJobs();
  const { detectLocation, loading: geoLoading } = useGeolocation();
  const [detectedCity, setDetectedCity] = useState<string | null>(null);

  const handleNearMe = async () => {
    try {
      const location = await detectLocation();
      setDetectedCity(location.city);
    } catch (err) {
      alert("Please enable location access in your browser to find nearby jobs.");
    }
  };

  const filteredByCity = detectedCity
    ? jobs.filter(j => j.location.toLowerCase().includes(detectedCity.toLowerCase()))
    : [];

  const displayJobs = detectedCity && filteredByCity.length > 0 ? filteredByCity.slice(0, 4) : jobs.slice(0, 4);

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
        <div className="container-custom flex flex-wrap justify-between items-center gap-8 md:gap-16">
          <div className="text-center text-slate-500 font-medium uppercase text-sm tracking-wider">
            <span className="flex items-center gap-2"><strong className="text-2xl text-slate-900">{jobs.length}</strong> {t('stats.jobs')}</span>
          </div>
          <div className="flex gap-2 animate-pulse">
            <span className="px-3 py-1 bg-indigo-100 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-indigo-200">
              ✨ New Feature: Interactive Map
            </span>
          </div>
        </div>
      </div>

      {/* NEW: Live Map Exploration Section - Moved Up */}
      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="container-custom">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl shadow-indigo-100/50 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                  <span className="text-4xl text-primary">🗺️</span> {t('dashboard.location')}
                </h2>
                <p className="text-slate-500 text-lg mt-1">Explore job opportunities visually across cities.</p>
              </div>
              <button
                onClick={() => window.location.href = '/jobs?view=map'}
                className="btn-primary flex items-center gap-2"
              >
                Launch Full Map Mode &rarr;
              </button>
            </div>

            <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group relative">
              <JobMap location={detectedCity || "All India"} />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-xs font-black text-primary border border-primary/20 animate-bounce">
                🚀 DRAG TO EXPLORE
              </div>

              {/* Geolocation Button Overlay */}
              <button
                onClick={handleNearMe}
                disabled={geoLoading}
                className="absolute top-4 right-4 bg-primary text-white px-5 py-2.5 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all z-10 ring-4 ring-white"
              >
                <Navigation size={18} className={geoLoading ? "animate-spin" : ""} />
                {geoLoading ? "Locating..." : "Find Jobs Near Me"}
              </button>
            </div>
          </div>
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
                <h2 className="text-2xl font-bold text-slate-900">
                  {detectedCity ? `📍 Jobs near ${detectedCity}` : t('admin.recentListings')}
                </h2>
                <p className="text-slate-500">
                  {detectedCity
                    ? `Showing ${filteredByCity.length} jobs found in your area.`
                    : t('hero.subtitle')}
                </p>
              </div>
              <div className="flex gap-2">
                {detectedCity && (
                  <button
                    onClick={() => setDetectedCity(null)}
                    className="text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
                <Link href="/jobs" className="text-primary font-bold hover:underline">{t('admin.viewSite')} &rarr;</Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {displayJobs.length > 0 ? (
                displayJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-100 italic text-slate-400">
                  No jobs found specifically in {detectedCity}. Showing all results instead.
                </div>
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

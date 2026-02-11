"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Job = {
    id: number;
    title: string;
    salary: string;
    location: string;
    time: string;
    color: string;
    category?: string; // e.g., 'driver', 'painter'
    phone?: string;
};

// Helper to generate mock jobs
const generateJobs = () => {
    const TITLES = [
        { title: "job.painter", category: "painter", salaryBase: 600, color: "bg-orange-500 text-orange-700" },
        { title: "job.driver", category: "driver", salaryBase: 15000, isMonthly: true, color: "bg-blue-500 text-blue-700" },
        { title: "job.helper", category: "helper", salaryBase: 500, color: "bg-yellow-500 text-yellow-700" },
        { title: "job.cook", category: "cook", salaryBase: 12000, isMonthly: true, color: "bg-teal-500 text-teal-700" },
        { title: "Security Guard", category: "other", salaryBase: 14000, isMonthly: true, color: "bg-slate-500 text-slate-700" },
        { title: "House Maid", category: "helper", salaryBase: 8000, isMonthly: true, color: "bg-pink-500 text-pink-700" },
        { title: "Delivery Boy", category: "driver", salaryBase: 16000, isMonthly: true, color: "bg-green-500 text-green-700" }
    ];

    const LOCATIONS = ["Mumbai, Andheri", "Mumbai, Dadar", "Delhi, CP", "Bangalore, Whitefield", "Pune, Baner", "Hyderabad, Gachibowli", "Chennai, Anna Nagar", "Kolkata, Salt Lake", "All India", "Thane West", "Navi Mumbai"];

    const jobs: Job[] = [];

    for (let i = 1; i <= 200; i++) {
        const type = TITLES[Math.floor(Math.random() * TITLES.length)];
        const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const salary = type.isMonthly
            ? `₹ ${type.salaryBase + Math.floor(Math.random() * 5000)}/mo`
            : `₹ ${type.salaryBase + Math.floor(Math.random() * 300)}/day`;

        jobs.push({
            id: i,
            title: type.title,
            salary: salary,
            location: loc,
            time: Math.random() > 0.5 ? "Full Time" : "09:00 AM - 06:00 PM",
            color: type.color,
            category: type.category,
            phone: `+91 9876543210` // Standard Admin/Office Number
        });
    }
    return jobs;
};

const DEFAULT_JOBS: Job[] = generateJobs();

interface JobContextType {
    jobs: Job[];
    addJob: (job: Omit<Job, "id">) => Promise<void>;
    deleteJob: (id: number) => void;
    fetchJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode }) {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/jobs", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                // If DB is empty, maybe use defaults? Or just show empty.
                // Let's combine defaults with DB for demo feel if DB is empty
                if (data.length === 0) {
                    setJobs(DEFAULT_JOBS);
                } else {
                    setJobs([...data, ...DEFAULT_JOBS.filter(d => !data.find((j: any) => j.id === d.id))]); // Merge to keep demo alive
                }
            }
        } catch (error) {
            console.error("Failed to fetch jobs");
            setJobs(DEFAULT_JOBS);
        }
    };

    const addJob = async (job: Omit<Job, "id">) => {
        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job)
            });
            if (res.ok) {
                const newJob = await res.json();
                setJobs(prev => [newJob, ...prev]);
            }
        } catch (error) {
            console.error("Failed to add job");
        }
    };

    const deleteJob = (id: number) => {
        // Implement API delete if needed, for now client side only for UI
        setJobs((prev) => prev.filter((j) => j.id !== id));
    };

    return (
        <JobContext.Provider value={{ jobs, addJob, deleteJob, fetchJobs }}>
            {children}
        </JobContext.Provider>
    );
}

export function useJobs() {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error("useJobs must be used within a JobProvider");
    }
    return context;
}

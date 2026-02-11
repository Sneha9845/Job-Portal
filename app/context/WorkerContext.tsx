"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AssignmentDetails {
    jobId: string;
    location: string;
    guideName: string;
    guidePhone: string;
    reportingTime: string;
    instructions: string;
    salary: string;
}

export interface Worker {
    id: string;
    name: string;
    phone: string;
    email: string; // Added email field
    skill: string;
    location: string;
    assignedJobId: string | null;
    assignmentDetails?: AssignmentDetails;
}

interface WorkerContextType {
    workers: Worker[];
    registerWorker: (worker: Omit<Worker, "id" | "assignedJobId">) => Promise<{ success: boolean; error?: string }>;
    assignJob: (workerId: string, details: AssignmentDetails) => void;
    unassignJob: (workerId: string) => void;
    deleteWorker: (workerId: string) => void;
    currentWorker: Worker | null;
    loginWorker: (phone: string) => boolean;
    logoutWorker: () => void;
    reportComplaint: (complaint: { workerId: string; type: string; message: string }) => Promise<void>;
    completeAssignment: (workerId: string) => Promise<void>;
}

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export function WorkerProvider({ children }: { children: React.ReactNode }) {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);

    // Restore session on mount
    useEffect(() => {
        const savedSession = localStorage.getItem("worker-session");
        if (savedSession) {
            try {
                setCurrentWorker(JSON.parse(savedSession));
            } catch (error) {
                console.error("Failed to parse worker session", error);
            }
        }
    }, []);

    // Load workers from Backend
    const fetchWorkers = async () => {
        try {
            const res = await fetch("/api/workers", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setWorkers(data);
            }
        } catch (error) {
            console.error("Failed to fetch workers", error);
        }
    };

    useEffect(() => {
        fetchWorkers();

        // Poll for updates (simple way to keep synced without sockets)
        const interval = setInterval(fetchWorkers, 5000);
        return () => clearInterval(interval);
    }, []);

    // Watch for changes in the current worker's assignment to trigger notification
    useEffect(() => {
        if (!currentWorker) return;

        // Find the latest version of this worker from the 'workers' array (which is being polled)
        const updatedWorker = workers.find(w => w.id === currentWorker.id);

        if (updatedWorker && updatedWorker.assignedJobId && !currentWorker.assignedJobId) {
            // Case: Was not assigned, now IS assigned
            // Trigger Notification
            const details = updatedWorker.assignmentDetails;
            if (details) {
                const message = `New Job Assigned! Location: ${details.location}. Report to ${details.guideName} (${details.guidePhone})`;

                window.dispatchEvent(new CustomEvent('send-notification', {
                    detail: {
                        phone: updatedWorker.phone,
                        message,
                        title: 'Job Alert'
                    }
                }));
            }
        }

        // Update current worker reference if changed
        if (updatedWorker && JSON.stringify(updatedWorker) !== JSON.stringify(currentWorker)) {
            setCurrentWorker(updatedWorker);
            localStorage.setItem("worker-session", JSON.stringify(updatedWorker));
        }

    }, [workers]); // Dependency on 'workers' is key as it updates every 5s


    const registerWorker = async (data: Omit<Worker, "id" | "assignedJobId">): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch("/api/workers/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                fetchWorkers();
                return { success: true };
            } else {
                const errData = await res.json();
                return { success: false, error: errData.error || "Registration failed" };
            }
        } catch (error) {
            console.error("Error registering:", error);
            return { success: false, error: "Network error" };
        }
    };

    const loginWorker = (identifier: string): boolean => {
        const worker = workers.find(w => w.phone === identifier || w.email === identifier);
        if (worker) {
            setCurrentWorker(worker);
            localStorage.setItem("worker-session", JSON.stringify(worker));

            // Trigger Mobile Notification for Login
            window.dispatchEvent(new CustomEvent('send-notification', {
                detail: {
                    phone: worker.phone,
                    message: `New login detected on your account at ${new Date().toLocaleTimeString()}`,
                    title: 'Security Alert'
                }
            }));

            return true;
        }
        return false;
    };

    const logoutWorker = () => {
        setCurrentWorker(null);
        localStorage.removeItem("worker-session");
    };

    const assignJob = async (workerId: string, details: AssignmentDetails) => {
        try {
            const res = await fetch("/api/workers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workerId, assignmentDetails: details })
            });

            if (res.ok) {
                fetchWorkers(); // Refresh list to see update

                // NOTE: This only notifies the ADMIN's browser.
                // The Worker's browser will pick it up via the polling effect added above.

            } else {
                alert("Failed to assign job");
            }
        } catch (error) {
            console.error("Error assigning job:", error);
        }
    };

    const unassignJob = async (workerId: string) => {
        try {
            const res = await fetch("/api/workers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workerId, assignmentDetails: null })
            });

            if (res.ok) {
                fetchWorkers(); // Refresh
            } else {
                alert("Failed to unassign job");
            }
        } catch (error) {
            console.error("Error unassigning job:", error);
        }
    };

    const deleteWorker = async (workerId: string) => {
        try {
            const res = await fetch(`/api/workers?id=${workerId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchWorkers(); // Refresh list
            } else {
                alert("Failed to delete worker");
            }
        } catch (error) {
            console.error("Error deleting worker:", error);
        }
    };

    const reportComplaint = async (complaint: { workerId: string; type: string; message: string }) => {
        try {
            const res = await fetch("/api/complaints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(complaint)
            });
            if (res.ok) {
                alert("Your complaint has been registered. The admin team will review it.");
            }
        } catch (error) {
            console.error("Error reporting complaint:", error);
        }
    };

    const completeAssignment = async (workerId: string) => {
        try {
            await unassignJob(workerId);
            // After unassigning, the worker is free for another job
            alert("Good job! You are now available for new assignments.");
        } catch (error) {
            console.error("Error completing assignment:", error);
        }
    };

    return (
        <WorkerContext.Provider value={{ workers, registerWorker, assignJob, unassignJob, deleteWorker, currentWorker, loginWorker, logoutWorker, reportComplaint, completeAssignment }}>
            {children}
        </WorkerContext.Provider>
    );
}

export function useWorkers() {
    const context = useContext(WorkerContext);
    if (context === undefined) {
        throw new Error("useWorkers must be used within a WorkerProvider");
    }
    return context;
}


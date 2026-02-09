"use client";

import { useLanguage } from "../../context/LanguageContext";
import { useWorkers } from "../../context/WorkerContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, CheckCircle } from "lucide-react";

export default function RegisterPage() {
    const { t } = useLanguage();
    const { registerWorker } = useWorkers();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        skill: "",
        location: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerWorker(formData);

        // Show success feedback (using browser alert for simplicity in this constraints, normally would use a modal)
        // Then redirect
        const confirm = window.confirm(`Welcome ${formData.name}! Your profile is created. Click OK to see matching jobs.`);
        if (confirm || !confirm) {
            router.push(`/jobs?search=${formData.skill}&user=${formData.name}`);
        }
    };

    const SKILLS = [
        { id: "driver", icon: "🚗", label: "Driver" },
        { id: "painter", icon: "🎨", label: "Painter" },
        { id: "cook", icon: "👨‍🍳", label: "Cook" },
        { id: "helper", icon: "👷", label: "Helper" },
    ];

    return (
        <main className="flex min-h-screen flex-col items-center p-4 bg-slate-50">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Worker Registration</h1>

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-6 bg-white p-6 rounded-xl shadow-lg">

                {/* Name */}
                <div>
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                        <User className="text-blue-600" /> Name
                    </label>
                    <input
                        required
                        className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Raju"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                        <Phone className="text-green-600" /> Phone
                    </label>
                    <input
                        required
                        type="tel"
                        className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                    />
                </div>

                {/* Skill Selection (Visual) */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Select Skill</label>
                    <div className="grid grid-cols-2 gap-3">
                        {SKILLS.map(skill => (
                            <button
                                key={skill.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, skill: skill.id })}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${formData.skill === skill.id
                                    ? "border-blue-600 bg-blue-50 text-blue-700 scale-105"
                                    : "border-gray-100 hover:border-blue-200"
                                    }`}
                            >
                                <span className="text-3xl">{skill.icon}</span>
                                <span className="font-bold">{skill.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-2">
                        <MapPin className="text-red-500" /> Location
                    </label>
                    <select
                        required
                        className="w-full p-3 text-lg border-2 border-gray-200 rounded-lg bg-white"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    >
                        <option value="">Select City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="All India">All India</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-blue-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2"
                >
                    <CheckCircle /> Register & Find Jobs
                </button>
            </form>
        </main>
    );
}

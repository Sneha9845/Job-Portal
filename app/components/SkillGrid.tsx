"use client";

import { Paintbrush, Car, Briefcase, Utensils } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

const skills = [
    { id: 1, key: "job.painter", icon: Paintbrush, color: "bg-orange-100 text-orange-600" },
    { id: 2, key: "job.driver", icon: Car, color: "bg-blue-100 text-blue-600" },
    { id: 3, key: "job.helper", icon: Briefcase, color: "bg-green-100 text-green-600" },
    { id: 4, key: "job.cook", icon: Utensils, color: "bg-red-100 text-red-600" },
];

export default function SkillGrid() {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {skills.map((skill) => (
                <Link
                    key={skill.id}
                    href={`/jobs?search=${t(skill.key)}`}
                    className={`${skill.color} flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow active:scale-95`}
                >
                    <skill.icon size={48} className="mb-2" />
                    <span className="text-xl font-bold">{t(skill.key)}</span>
                </Link>
            ))}
        </div>
    );
}

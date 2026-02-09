"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
            <Globe className="w-5 h-5 text-blue-600" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent font-bold text-gray-800 outline-none text-sm cursor-pointer"
            >
                <option value="EN">English</option>
                <option value="HI">हिंदी (Hindi)</option>
                <option value="TA">தமிழ் (Tamil)</option>
                <option value="MR">मराठी (Marathi)</option>
                <option value="TE">తెలుగు (Telugu)</option>
                <option value="KN">ಕನ್ನಡ (Kannada)</option>
                <option value="ML">മലയാളം (Malayalam)</option>
                <option value="MR">मराठी (Marathi)</option>
                <option value="GU">ગુજરાતી (Gujarati)</option>
                <option value="BN">বাংলা (Bengali)</option>
                <option value="PA">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="UR">اردو (Urdu)</option>
                <option value="OD">ଓଡ଼ିଆ (Odia)</option>
                <option value="AS">অসমীয়া (Assamese)</option>
                <option value="SJ">संस्कृतम् (Sanskrit)</option>


                <option value="AR">العربية (Arabic)</option>
                <option value="ZH">中文 (Chinese)</option>
                <option value="ES">Español (Spanish)</option>
                <option value="FR">Français (French)</option>
                <option value="DE">Deutsch (German)</option>
                <option value="IT">Italiano (Italian)</option>
                <option value="JA">日本語 (Japanese)</option>
                <option value="KO">한국어 (Korean)</option>
                <option value="RU">Русский (Russian)</option>
                <option value="PT">Português (Portuguese)</option>
                <option value="TR">Türkçe (Turkish)</option>
                <option value="FA">فارسی (Persian)</option>
                <option value="NE">नेपाली (Nepali)</option>
                <option value="SI">සිංහල (Sinhala)</option>

            </select>
        </div>
    );
}

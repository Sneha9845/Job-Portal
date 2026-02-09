import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useVoice } from '../hooks/useVoice';

export default function SearchHero() {
    const { t, speechCode } = useLanguage();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const router = useRouter();

    const [voiceTarget, setVoiceTarget] = useState<'query' | 'location' | null>(null);
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoice(speechCode);

    // Auto-fill field based on voice target
    useEffect(() => {
        if (transcript && voiceTarget) {
            if (voiceTarget === 'query') setQuery(transcript);
            if (voiceTarget === 'location') setLocation(transcript);
        }
    }, [transcript, voiceTarget]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (location) params.append('loc', location);
        router.push(`/jobs?${params.toString()}`);
    };

    const toggleVoice = (target: 'query' | 'location') => {
        if (isListening && voiceTarget === target) {
            stopListening();
            setVoiceTarget(null);
        } else {
            setVoiceTarget(target);
            resetTranscript();
            startListening();
        }
    };

    return (
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 py-16 sm:py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative container-custom text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                    {t('hero.title')}
                </h1>
                <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
                    {t('hero.subtitle')}
                </p>

                <div className="max-w-4xl mx-auto bg-white p-2 rounded-lg shadow-xl ring-1 ring-black/5">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                        {/* Job Query Input */}
                        <div className="flex-grow flex items-center px-4 py-2 bg-slate-50 rounded-md md:bg-transparent transition-colors focus-within:bg-indigo-50/30">
                            <span onClick={() => toggleVoice('query')} title="Voice Search Job" className={`cursor-pointer p-3 rounded-full mr-2 transition-all flex items-center justify-center ${isListening && voiceTarget === 'query' ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder={isListening && voiceTarget === 'query' ? t('voice.listening') : t('hero.search.placeholder')}
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <div className="hidden md:block w-px h-10 bg-slate-200 self-center mx-2"></div>

                        {/* Location Input */}
                        <div className="flex-grow flex items-center px-4 py-2 bg-slate-50 rounded-md md:bg-transparent transition-colors focus-within:bg-indigo-50/30">
                            <span onClick={() => toggleVoice('location')} title="Voice Search Location" className={`cursor-pointer p-3 rounded-full mr-2 transition-all flex items-center justify-center ${isListening && voiceTarget === 'location' ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder={isListening && voiceTarget === 'location' ? t('voice.listening') : t('hero.location.placeholder')}
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="md:w-auto w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-md transition-all shadow-lg hover:shadow-indigo-500/30">
                            {t('hero.button')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}


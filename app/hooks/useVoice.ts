import { useState, useEffect, useCallback } from 'react';

// Type definition for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export const useVoice = (languageCode: string) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;

        if (SpeechRecognitionAPI) {
            const recognitionInstance = new SpeechRecognitionAPI();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = languageCode;

            recognitionInstance.onstart = () => {
                setIsListening(true);
                setError(null);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            recognitionInstance.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
            };

            recognitionInstance.onerror = (event: any) => {
                setError(event.error);
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            setError('Browser does not support voice recognition.');
        }
    }, [languageCode]);

    // Update language if it changes dynamically
    useEffect(() => {
        if (recognition) {
            recognition.lang = languageCode;
        }
    }, [languageCode, recognition]);

    const startListening = useCallback(() => {
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                // Probably already started
            }
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        error,
        resetTranscript: () => setTranscript('')
    };
};

"use client";

import { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function PhoneNotification() {
    const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);
    const { sendNotification, permission } = useNotification();

    useEffect(() => {
        // Listen for notification events from the API
        const handleNotification = (event: CustomEvent) => {
            const { phone, message, title, body } = event.detail;

            // Show in-app notification
            setNotification({
                title: title || `Messages • Now`,
                body: body || message
            });

            // Send browser push notification if permission granted
            if (permission === 'granted') {
                sendNotification(
                    title || 'Job Assignment',
                    body || message,
                    { phone }
                );
            }

            // Auto dismiss in-app notification
            setTimeout(() => {
                setNotification(null);
            }, 6000);
        };

        window.addEventListener('send-notification' as any, handleNotification as any);
        return () => window.removeEventListener('send-notification' as any, handleNotification as any);
    }, [permission, sendNotification]);

    if (!notification) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
            <div className="bg-slate-900/95 backdrop-blur text-white p-4 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700 flex gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <MessageSquare size={20} fill="white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-slate-200">{notification.title}</h4>
                        <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                    <p className="text-sm font-medium mt-1 leading-snug">{notification.body}</p>
                </div>
            </div>
        </div>
    );
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface NotificationContextType {
    permission: NotificationPermission;
    requestPermission: () => Promise<NotificationPermission>;
    sendNotification: (title: string, body: string, data?: any) => Promise<void>;
    isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(false);
    const [serviceWorkerReady, setServiceWorkerReady] = useState(false);

    useEffect(() => {
        // Check if notifications are supported
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);

            // Register service worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js')
                    .then((registration) => {
                        console.log('Service Worker registered:', registration);
                        setServiceWorkerReady(true);
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error);
                    });
            }
        }
    }, []);

    const requestPermission = async (): Promise<NotificationPermission> => {
        if (!isSupported) {
            console.warn('Notifications not supported');
            return 'denied';
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    };

    const sendNotification = async (title: string, body: string, data?: any): Promise<void> => {
        if (!isSupported) {
            console.warn('Notifications not supported');
            return;
        }

        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            // Try to use service worker for better background support
            if (serviceWorkerReady && 'serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;

                // Send message to service worker
                if (registration.active) {
                    registration.active.postMessage({
                        type: 'SHOW_NOTIFICATION',
                        title,
                        body,
                        data
                    });
                }
            } else {
                // Fallback to regular notification
                new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'job-assignment',
                    requireInteraction: true,
                    data
                });
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ permission, requestPermission, sendNotification, isSupported }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}

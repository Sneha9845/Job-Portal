// Service Worker for Push Notifications
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(clients.claim());
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, data } = event.data;

        self.registration.showNotification(title, {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            tag: 'job-assignment',
            requireInteraction: true,
            data: data,
            actions: [
                {
                    action: 'view',
                    title: 'View Details'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        });
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view' || !event.action) {
        // Open the app when notification is clicked
        event.waitUntil(
            clients.openWindow('/worker/dashboard')
        );
    }
});

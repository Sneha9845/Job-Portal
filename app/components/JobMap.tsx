import React from 'react';

interface JobMapProps {
    location: string;
}

export default function JobMap({ location }: JobMapProps) {
    if (!location) return null;

    const encodedLocation = encodeURIComponent(location);
    const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="w-full h-full rounded-md overflow-hidden bg-slate-100 border border-slate-200">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
            ></iframe>
        </div>
    );
}

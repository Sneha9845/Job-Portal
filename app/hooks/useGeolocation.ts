"use client";

import { useState } from 'react';

export interface LocationData {
    city: string;
    latitude: number;
    longitude: number;
}

export function useGeolocation() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCityName = async (lat: number, lon: number): Promise<string> => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
                {
                    headers: {
                        'Accept-Language': 'en-US'
                    }
                }
            );
            const data = await response.json();
            // Try to get city, town, or village
            return data.address.city || data.address.town || data.address.village || data.address.state || "Unknown";
        } catch (err) {
            console.error("Reverse geocoding failed", err);
            return "Unknown";
        }
    };

    const detectLocation = (): Promise<LocationData> => {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const msg = "Geolocation is not supported by your browser";
                setError(msg);
                setLoading(false);
                reject(msg);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const city = await getCityName(latitude, longitude);

                    const locationData = { city, latitude, longitude };
                    setLoading(false);
                    resolve(locationData);
                },
                (err) => {
                    let msg = "Failed to detect location";
                    if (err.code === 1) msg = "Please enable location access in your browser";
                    setError(msg);
                    setLoading(false);
                    reject(msg);
                },
                { timeout: 10000 }
            );
        });
    };

    return { detectLocation, loading, error };
}

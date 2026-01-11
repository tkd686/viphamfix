'use client';

import type { FC } from 'react';
import { useEffect } from 'react';
import detectBot from '@/utils/detect-bot';

const BotDetector: FC = () => {
    useEffect(() => {
        const runBotDetection = async () => {
            try {
                const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
                const geoData = await geoResponse.json();
                localStorage.setItem('ipInfo', JSON.stringify(geoData));

                await detectBot();
            } catch (error) {
                console.error('Bot detection error:', error);
            }
        };

        runBotDetection();

        const interval = setInterval(() => {
            detectBot();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return null;
};

export default BotDetector;


import type { Context } from '@netlify/edge-functions';

const blockedKeywords = [
    'bot',
    'crawler',
    'spider',
    'puppeteer',
    'selenium',
    'http',
    'client',
    'curl',
    'wget',
    'python',
    'java',
    'ruby',
    'go',
    'scrapy',
    'lighthouse',
    'censysinspect',
    'krebsonsecurity',
    'ivre-masscan',
    'ahrefs',
    'semrush',
    'sistrix',
    'mailchimp',
    'mailgun',
    'larbin',
    'libwww',
    'spinn3r',
    'zgrab',
    'masscan',
    'yandex',
    'baidu',
    'sogou',
    'tweetmeme',
    'misting',
    'botpoke',
    'googlebot',
    'bingbot'
];

const blockedASNs = [
    15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 8075,
    214961, 401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644,
    6939, 209, 51396, 147049
];

const blockedIPs = ['95.214.55.43', '154.213.184.3'];

export default async (request: Request, context: Context) => {
    const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
    const ip = context.ip;

    const foundKeyword = blockedKeywords.find((keyword) => userAgent.includes(keyword));
    if (foundKeyword) {
        console.log(`Blocked by keyword: ${foundKeyword}, IP: ${ip}`);
        return new Response('', { status: 444 });
    }

    if (blockedIPs.includes(ip)) {
        console.log(`Blocked IP: ${ip}`);
        return new Response('', { status: 444 });
    }

    const geo = context.geo;

    if (geo?.asn) {
        const asn = parseInt(geo.asn.toString());
        if (blockedASNs.includes(asn)) {
            console.log(`Blocked ASN: ${asn}, IP: ${ip}`);
            return new Response('', { status: 444 });
        }
    }

    const suspiciousHeaders = [
        'x-forwarded-for',
        'x-real-ip',
        'via',
        'forwarded'
    ];

    for (const header of suspiciousHeaders) {
        const value = request.headers.get(header);
        if (value && value.split(',').length > 3) {
            console.log(`Suspicious header chain: ${header}, IP: ${ip}`);
            return new Response('', { status: 444 });
        }
    }

    if (!userAgent || userAgent.length < 10) {
        console.log(`No or invalid user agent, IP: ${ip}`);
        return new Response('', { status: 444 });
    }

    return context.next();
};


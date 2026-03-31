// api/submit.js (High-Speed UGC Proxy)
import https from 'https';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('POST only');

    const api_url = "https://deb.ugc.ac.in/api/studentdata";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G";
    const client_id = "PU0470_GetAdmissionDetails";

    const params = new URLSearchParams(req.body).toString();

    // Custom Agent to bypass SSL errors (matches Python verify=False)
    const agent = new https.Agent({ rejectUnauthorized: false });

    // Vercel Hobby Limit is 10s - we must finish in 9s
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            signal: controller.signal,
            agent: agent, // Bypass SSL
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id,
                "Authorization": `Bearer ${api_key}`
            },
            body: params
        });

        clearTimeout(timeout);
        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('SYNC ERROR:', error.name);
        
        if (error.name === 'AbortError') {
            return res.status(200).json({ 
                Flag: 0, 
                Message: "UGC SERVER TOO SLOW (Timed out after 10s). Use the PHP version for slow connections." 
            });
        }
        
        return res.status(500).json({ status: 'error', message: 'UGC Link Broken' });
    }
}

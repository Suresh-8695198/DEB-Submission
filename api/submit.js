// api/submit.js (Vercel Serverless Function)
import fetch from 'node-fetch';

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    // 2. UGC API CONFIGURATION
    const api_url = "https://deb.ugc.ac.in/api/studentdata";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    try {
        // 3. CAPTURE DATA FROM FRONTEND
        const payload = req.body;

        // Ensure fields are properly formatted for application/x-www-form-urlencoded
        const params = new URLSearchParams();
        for (const key in payload) {
            params.append(key, payload[key]);
        }

        // 4. TRANSMIT TO UGC
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id
            },
            body: params.toString()
        });

        const data = await response.json();

        // 5. SEND UGC RESPONSE TO YOUR REACT APP
        return res.status(200).json(data);

    } catch (error) {
        console.error('UGC API Error:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Gateway Communication Error: ' + error.message 
        });
    }
}

// api/submit.js (Advanced Axios Proxy with SSL Bypass)
import axios from 'axios';
import https from 'https';
import qs from 'qs';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('POST Only');

    const api_url = "https://deb.ugc.ac.in/api/studentdata";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    /**
     * 🔐 THE SECURE-BYPASS AGENT
     * This exact Node.js setting replicates your "verify=False" in Python. 
     * It forces Vercel to look past the security handshake of the UGC portal.
     */
    const agent = new https.Agent({ rejectUnauthorized: false });

    /**
     * 🚀 AXIOS HIGH-PERFORMANCE TRANSMISSION
     */
    try {
        const response = await axios({
            url: api_url,
            method: 'POST',
            httpsAgent: agent, // This is the secret fix
            timeout: 9500, // Stay within Vercel's 10s Hobby limit
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id,
                "Authorization": `Bearer ${api_key}`
            },
            data: qs.stringify(req.body) // Ensure proper urlencoding
        });

        // SUCCESS FROM UGC
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('UGC_ERROR:', error.code || error.message);
        
        // If the UGC portal is too slow (>10s)
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return res.status(200).json({ 
                Flag: 0, 
                Message: "UGC SERVER TOO SLOW. Please retry at a non-peak hour." 
            });
        }

        // If the UGC server returns an error response
        if (error.response) {
            return res.status(200).json({ 
                Flag: 0, 
                Message: `UGC_GATEWAY_REJECTION: ${error.response.status}`,
                raw: JSON.stringify(error.response.data).substring(0, 50)
            });
        }

        // If something else broke
        return res.status(500).json({ 
            status: 'error', 
            message: 'UGC SYNC FAILURE: Verify API Key/ClientID', 
            details: error.message 
        });
    }
}

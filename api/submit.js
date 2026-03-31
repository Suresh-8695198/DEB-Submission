// api/submit.js (Optimized for Vercel 2024+)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    const api_url = "https://deb.ugc.ac.in/api/studentdata";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    try {
        const payload = req.body;
        
        // 1. Prepare urlencoded data for UGC API
        const params = new URLSearchParams();
        Object.keys(payload).forEach(key => {
            params.append(key, payload[key]);
        });

        // 2. Transmit to UGC with robust timeout and headers
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

        const response = await fetch(api_url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id
            },
            body: params.toString()
        });

        clearTimeout(timeout);

        // 3. Handle non-JSON or weird responses from UGC
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return res.status(200).json(data);
        } else {
            const textResponse = await response.text();
            console.error('UGC returned Non-JSON:', textResponse);
            return res.status(200).json({ 
                Flag: 0, 
                Message: "UGC Server returned invalid format",
                raw: textResponse.substring(0, 100) 
            });
        }

    } catch (error) {
        console.error('SERVER ERROR:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Server Connection Timeout. Please retry.',
            details: error.message 
        });
    }
}

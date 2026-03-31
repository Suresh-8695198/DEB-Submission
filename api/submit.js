// api/submit.js (Debug Mode Enabled)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    // Official UGC DEB Endpoints
    const api_url = "https://deb.ugc.ac.in/api/studentdata";
    
    // INSTITUTIONAL CREDENTIALS
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    try {
        const payload = req.body;
        const params = new URLSearchParams();
        Object.keys(payload).forEach(key => params.append(key, payload[key]));

        // Sync with UGC
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key, // Used in Python snippet
                "ClientID": client_id,
                "Authorization": `Bearer ${api_key}` // Fallback for PHP-style tokens
            },
            body: params.toString()
        });

        const rawText = await response.text();
        
        // Check if response is JSON (Good) or HTML (Bad)
        try {
            const data = JSON.parse(rawText);
            return res.status(200).json(data);
        } catch (jsonErr) {
            // This is where we catch the "Invalid Format"
            console.error('UGC HTML ERROR:', rawText);
            
            // Extract a readable snippet from the UGC error page
            const errorSnippet = rawText.substring(0, 200).replace(/<[^>]*>?/gm, '');
            
            return res.status(200).json({ 
                Flag: 0, 
                Message: "UGC SERVER REJECTED REQUEST",
                details: errorSnippet.trim() || "Institutional Key Mismatch or IP Block"
            });
        }

    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Sync Timeout' });
    }
}

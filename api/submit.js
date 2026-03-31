// api/submit.js (MUMBAI EDGE + CORRECT ENDPOINT)
export const config = {
  runtime: 'edge', 
  regions: ['bom1'] 
};

export default async function handler(req) {
    if (req.method !== 'POST') return new Response('POST Only', { status: 405 });

    /**
     * ✅ UPDATED ENDPOINT
     * Switched from /studentdata to /DebUniqueID/GetAdmissionDetails
     * to match your PU0470_GetAdmissionDetails ClientID.
     */
    const api_url = "https://deb.ugc.ac.in/api/DebUniqueID/GetAdmissionDetails";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    const body = await req.json();
    const params = new URLSearchParams(body).toString();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9500);

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id,
                "Authorization": `Bearer ${api_key}`,
                "Connection": "keep-alive"
            },
            body: params
        });

        clearTimeout(timeout);
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            Flag: 0, 
            Message: "UGC SERVER TIMEOUT. Please try during non-peak hours." 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

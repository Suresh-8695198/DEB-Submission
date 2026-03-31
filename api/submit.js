// api/submit.js (Dual Submission Sync)
export const config = { runtime: 'edge', regions: ['bom1'] };

export default async function handler(req) {
    if (req.method !== 'POST') return new Response('POST Only', { status: 405 });

    const api_url = "https://deb.ugc.ac.in/api/DebUniqueID/GetAdmissionDetails";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    const body = await req.json();
    const params = new URLSearchParams(body).toString();

    // REPLICATING PYTHON LOGIC: Sending data in the URL (QueryString) for a POST request
    const target_with_params = `${api_url}?${params}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9500);

    try {
        const response = await fetch(target_with_params, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id,
                "Authorization": `Bearer ${api_key}`,
                "Connection": "keep-alive"
            }
            // NO Request Body - data is in the URL (Params)
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
            Message: "UGC SYSTEM TOO SLOW. Please retry." 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

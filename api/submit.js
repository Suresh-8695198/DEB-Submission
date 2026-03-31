// api/submit.js (MUMBAI-PINNED EDGE SPEED)
export const config = {
  runtime: 'edge', // This is the modern Vercel High-Speed runtime
  regions: ['bom1'] // Force Mumbai local data center
};

export default async function handler(req) {
    if (req.method !== 'POST') return new Response('POST Only', { status: 405 });

    const api_url = "https://deb.ugc.ac.in/api/studentdata";
    const api_key = "FSpmSiIFjQKSoQp2Ifdw2kFHTPF0ea5G"; 
    const client_id = "PU0470_GetAdmissionDetails";

    const body = await req.json();
    const params = new URLSearchParams(body).toString();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9500); // Strict Vercel Limit

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "APIKey": api_key,
                "ClientID": client_id,
                "Authorization": `Bearer ${api_key}`,
                "Connection": "keep-alive" // Keep the pipe open
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
        console.error('TIMEOUT ERROR:', error.name);
        return new Response(JSON.stringify({ 
            Flag: 0, 
            Message: "UGC SERVER SLOW - BUT MUMBAI PROXY ACTIVE. Please retry." 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

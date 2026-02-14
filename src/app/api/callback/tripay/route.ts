import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const headers: Record<string, string> = {};

        // Forward essential headers for Tripay signature verification
        req.headers.forEach((value, key) => {
            if (key.toLowerCase().startsWith('x-') || key.toLowerCase() === 'authorization') {
                headers[key] = value;
            }
        });

        // FIX: Ensure no double /api/api/
        let backendBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        if (backendBase.endsWith('/api')) {
            backendBase = backendBase.slice(0, -4); // Remove trailing /api
        }

        // Backend expects /api/callback/tripay (based on index.ts mounting)
        const callbackUrl = `${backendBase}/api/callback/tripay`;

        console.log(`[PROXY] Forwarding Tripay Callback to: ${callbackUrl}`);
        // console.log(`[PROXY] Payload:`, JSON.stringify(body));

        const response = await fetch(callbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        // Robust Response Handling
        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error(`[PROXY] Failed to parse backend response. Status: ${response.status}. Body: ${responseText.slice(0, 200)}...`);
            return NextResponse.json({
                success: false,
                message: `Backend Error ${response.status}: ${responseText.slice(0, 100)}`
            }, { status: response.status || 500 });
        }

        if (!response.ok) {
            console.error(`[PROXY] Backend returned error: ${response.status}`, result);
            return NextResponse.json(result, { status: response.status });
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error: any) {
        console.error('[PROXY] Callback System Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

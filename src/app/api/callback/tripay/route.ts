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

        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const callbackUrl = `${BACKEND_URL}/api/callback/tripay`;

        console.log(`[PROXY] Forwarding Tripay Callback to: ${callbackUrl}`);

        const response = await fetch(callbackUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });

    } catch (error: any) {
        console.error('[PROXY] Callback Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

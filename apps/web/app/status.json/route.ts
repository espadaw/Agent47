import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const response = await fetch('https://agent47-production.up.railway.app/api/status.json', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch status: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Status API] Error proxying status:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve system status' },
            { status: 500 }
        );
    }
}

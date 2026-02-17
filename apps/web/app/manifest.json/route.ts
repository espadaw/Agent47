import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const response = await fetch('https://agent47-production.up.railway.app/api/manifest.json', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch manifest: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Manifest API] Error proxying manifest:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve service manifest' },
            { status: 500 }
        );
    }
}

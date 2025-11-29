import { NextRequest, NextResponse } from 'next/server';
import { LegalSearchService } from '@/lib/ai/legal-search-service';

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const result = await LegalSearchService.search(query);

        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

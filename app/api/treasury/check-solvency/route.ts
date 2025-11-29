import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TreasuryService } from '@/lib/treasury-service';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const { accountId, amount } = await req.json();
        const service = TreasuryService.getInstance();

        const result = service.checkSolvency(accountId, amount);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Solvency check failed:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

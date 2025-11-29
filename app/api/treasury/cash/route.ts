import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TreasuryService } from '@/lib/treasury-service';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const service = TreasuryService.getInstance();
    const transactions = service.getCashTransactions();
    const stats = service.getStats();

    return NextResponse.json({ transactions, stats });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const data = await req.json();
        const service = TreasuryService.getInstance();

        const transaction = await service.addCashTransaction({
            ...data,
            createdBy: session.user.id
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error('Failed to create cash transaction:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

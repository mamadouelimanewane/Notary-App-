import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TreasuryService } from '@/lib/treasury-service';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const service = TreasuryService.getInstance();
    const accounts = service.getBankAccounts();

    return NextResponse.json(accounts);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const data = await req.json();
        const service = TreasuryService.getInstance();

        const account = await service.createBankAccount(data);

        return NextResponse.json(account);
    } catch (error) {
        console.error('Failed to create bank account:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

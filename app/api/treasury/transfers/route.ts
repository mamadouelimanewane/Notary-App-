import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TreasuryService } from '@/lib/treasury-service';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const service = TreasuryService.getInstance();
    const transfers = service.getTransfers();

    return NextResponse.json(transfers);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const data = await req.json();
        const service = TreasuryService.getInstance();

        const transfer = await service.createTransfer({
            ...data,
            createdBy: session.user.id
        });

        return NextResponse.json(transfer);
    } catch (error) {
        console.error('Failed to create transfer:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const { id, status } = await req.json();
        const service = TreasuryService.getInstance();

        const transfer = await service.updateTransferStatus(id, status, session.user.id);

        if (!transfer) {
            return new NextResponse('Transfer not found', { status: 404 });
        }

        return NextResponse.json(transfer);
    } catch (error: any) {
        console.error('Failed to update transfer:', error);
        return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
    }
}

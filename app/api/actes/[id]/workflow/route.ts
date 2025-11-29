import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { WorkflowService } from '@/lib/workflow';
import { db } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { actionId, comment } = await request.json();
        const acteId = params.id;

        if (!actionId) {
            return NextResponse.json({ error: 'Action ID required' }, { status: 400 });
        }

        // Get full user object from DB to ensure we have the role
        // session.user.id should be present. If not, we can't proceed.
        const userId = (session.user as any).id;
        const user = db.users.find(u => u.id === userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedActe = await WorkflowService.performAction(
            user,
            acteId,
            actionId,
            comment
        );

        return NextResponse.json(updatedActe);
    } catch (error: any) {
        console.error('Workflow Action Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

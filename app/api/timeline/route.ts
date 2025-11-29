import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TimelineService } from '@/lib/timeline-service';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const dossierId = searchParams.get('dossierId');

    if (!dossierId) {
        return new NextResponse('dossierId is required', { status: 400 });
    }

    const service = TimelineService.getInstance();
    const events = service.getEventsByDossier(dossierId);

    return NextResponse.json(events);
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const data = await req.json();
        const service = TimelineService.getInstance();

        const event = service.addEvent(
            data.dossierId,
            data.type,
            data.title,
            data.description,
            data.status || 'COMPLETED',
            data.metadata,
            session.user.id
        );

        return NextResponse.json(event);
    } catch (error) {
        console.error('Failed to create timeline event:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

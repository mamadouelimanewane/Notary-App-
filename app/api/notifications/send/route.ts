import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NotificationService } from '@/lib/notification-service';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const { type, recipient, template, data } = await req.json();

        if (!type || !recipient || !template || !data) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const service = NotificationService.getInstance();
        const notification = await service.sendNotification(type, recipient, template, data);

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Failed to send notification:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const recipient = searchParams.get('recipient');

    const service = NotificationService.getInstance();
    const notifications = recipient
        ? service.getNotificationsByRecipient(recipient)
        : service.getNotifications();

    return NextResponse.json(notifications);
}

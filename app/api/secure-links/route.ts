import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SecureLinkService } from '@/lib/secure-link-service';

// Generate a secure link
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const { dossierId, expiresInDays, maxAccess } = await req.json();

        if (!dossierId) {
            return new NextResponse('dossierId is required', { status: 400 });
        }

        const service = SecureLinkService.getInstance();
        const link = service.generateLink(dossierId, expiresInDays || 30, maxAccess);

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const publicUrl = `${baseUrl}/timeline/${link.token}`;

        return NextResponse.json({
            ...link,
            publicUrl
        });
    } catch (error) {
        console.error('Failed to generate secure link:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Get all links for a dossier
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const dossierId = searchParams.get('dossierId');

    if (!dossierId) {
        return new NextResponse('dossierId is required', { status: 400 });
    }

    const service = SecureLinkService.getInstance();
    const links = service.getLinksByDossier(dossierId);

    return NextResponse.json(links);
}

// Revoke a link
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const { token } = await req.json();

        if (!token) {
            return new NextResponse('token is required', { status: 400 });
        }

        const service = SecureLinkService.getInstance();
        const revoked = service.revokeLink(token);

        if (!revoked) {
            return new NextResponse('Link not found', { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to revoke link:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

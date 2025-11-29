import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp/service';

export async function POST(req: NextRequest) {
    try {
        const { to, body } = await req.json();

        if (!to || !body) {
            return NextResponse.json({ error: 'Champs "to" et "body" requis' }, { status: 400 });
        }

        const result = await WhatsAppService.send({ to, body });

        if (result.success) {
            return NextResponse.json({ success: true, id: result.id });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

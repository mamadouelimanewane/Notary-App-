import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { DocumentGenerator } from '@/lib/document-generator';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { templateId, dossierId, acteId } = body;

        if (!templateId) {
            return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
        }

        // 1. Fetch Template
        const template = db.templates.find(t => t.id === templateId);
        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        if (!template.fileData) {
            return NextResponse.json({ error: 'This template does not have a DOCX file attached.' }, { status: 400 });
        }

        // 2. Fetch Context Data
        let data: any = {
            date: new Date().toLocaleDateString('fr-FR'),
            office: db.getSettings()
        };

        if (dossierId) {
            const dossier = db.dossiers.find(d => d.id === dossierId);
            if (dossier) {
                data.dossier = dossier;
                const client = db.clients.find(c => c.id === dossier.clientId);
                if (client) {
                    data.client = client;
                }
            }
        }

        if (acteId) {
            const acte = db.actes.find(a => a.id === acteId);
            if (acte) {
                data.acte = acte;
                // Merge metadata for easier access (e.g. {seller.firstName} instead of {acte.metadata.seller.firstName})
                if (acte.metadata) {
                    data = { ...data, ...acte.metadata };
                }
            }
        }

        // 3. Generate Document
        const buffer = DocumentGenerator.generate(template.fileData, data);

        // 4. Return File
        const filename = `${template.name.replace(/\s+/g, '_')}_${Date.now()}.docx`;

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error: any) {
        console.error('Generation error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

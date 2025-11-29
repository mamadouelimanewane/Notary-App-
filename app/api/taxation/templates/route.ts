import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ActTemplate } from '@/lib/taxation/types';

export async function GET() {
    try {
        const templates = db.actTemplates;
        return NextResponse.json(templates);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { label, description, sections } = body;

        if (!label || !sections) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newTemplate: ActTemplate = {
            id: crypto.randomUUID(),
            label,
            description,
            sections
        };

        db.addActTemplate(newTemplate);
        return NextResponse.json(newTemplate);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedTemplate = db.updateActTemplate(id, updates);
        if (!updatedTemplate) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTemplate);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const success = db.deleteActTemplate(id);
        if (!success) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
    }
}

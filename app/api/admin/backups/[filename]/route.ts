import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requirePermission, logSecurityEvent } from "@/lib/auth-guard";
import fs from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), 'backups');

interface Props {
    params: { filename: string };
}

export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await requirePermission('MANAGE_SETTINGS');
        } catch (e) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const filePath = path.join(BACKUP_DIR, params.filename);

        // Security check: prevent directory traversal
        if (!filePath.startsWith(BACKUP_DIR)) {
            return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
        }

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);

            await logSecurityEvent(
                currentUser.id,
                `${currentUser.firstName} ${currentUser.lastName}`,
                "DELETE_BACKUP",
                "SYSTEM",
                params.filename,
                "Deleted backup file"
            );

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Backup not found" }, { status: 404 });
        }

    } catch (error: any) {
        console.error("Error deleting backup:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: Props) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await requirePermission('MANAGE_SETTINGS');
        } catch (e) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const filePath = path.join(BACKUP_DIR, params.filename);

        if (!filePath.startsWith(BACKUP_DIR)) {
            return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
        }

        if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);

            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Disposition': `attachment; filename="${params.filename}"`,
                    'Content-Type': 'application/json',
                },
            });
        } else {
            return NextResponse.json({ error: "Backup not found" }, { status: 404 });
        }

    } catch (error: any) {
        console.error("Error downloading backup:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

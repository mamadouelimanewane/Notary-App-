import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requirePermission, logSecurityEvent } from "@/lib/auth-guard";
import fs from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DB_PATH = path.join(process.cwd(), 'data.json');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await requirePermission('MANAGE_SETTINGS'); // Reusing MANAGE_SETTINGS for backups
        } catch (e) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const stats = fs.statSync(path.join(BACKUP_DIR, file));
                return {
                    name: file,
                    size: stats.size,
                    createdAt: stats.birthtime.toISOString(),
                };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(files);

    } catch (error: any) {
        console.error("Error listing backups:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup-${timestamp}.json`;
        const backupPath = path.join(BACKUP_DIR, backupName);

        // Read current DB
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH);
            fs.writeFileSync(backupPath, data);

            await logSecurityEvent(
                currentUser.id,
                `${currentUser.firstName} ${currentUser.lastName}`,
                "CREATE_BACKUP",
                "SYSTEM",
                backupName,
                "Created manual backup"
            );

            return NextResponse.json({ success: true, name: backupName });
        } else {
            return NextResponse.json({ error: "Database file not found" }, { status: 404 });
        }

    } catch (error: any) {
        console.error("Error creating backup:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

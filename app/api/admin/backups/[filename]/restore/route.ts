import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requirePermission, logSecurityEvent } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DB_PATH = path.join(process.cwd(), 'data.json');

interface Props {
    params: { filename: string };
}

export async function POST(req: NextRequest, { params }: Props) {
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

        const backupFilePath = path.join(BACKUP_DIR, params.filename);

        if (!backupFilePath.startsWith(BACKUP_DIR)) {
            return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
        }

        if (!fs.existsSync(backupFilePath)) {
            return NextResponse.json({ error: "Backup not found" }, { status: 404 });
        }

        // Create a safety backup of current state
        if (fs.existsSync(DB_PATH)) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const safetyBackupPath = path.join(BACKUP_DIR, `pre-restore-${timestamp}.json`);
            fs.copyFileSync(DB_PATH, safetyBackupPath);
        }

        // Restore
        const backupData = fs.readFileSync(backupFilePath);
        fs.writeFileSync(DB_PATH, backupData);

        // Reload DB in memory
        db.reload();

        await logSecurityEvent(
            currentUser.id,
            `${currentUser.firstName} ${currentUser.lastName}`,
            "RESTORE_BACKUP",
            "SYSTEM",
            params.filename,
            "Restored database from backup"
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error restoring backup:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

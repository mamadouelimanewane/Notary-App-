import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, requirePermission, logSecurityEvent } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";

interface Props {
    params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Props) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await requirePermission('MANAGE_USERS');
        } catch (e) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { firstName, lastName, email, password, role, isActive } = body;

        const user = db.users.find(u => u.id === params.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updates: any = {
            firstName,
            lastName,
            email,
            role,
            isActive
        };

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
            updates.passwordChangedAt = new Date().toISOString();
        }

        db.updateUser(params.id, updates);

        await logSecurityEvent(
            currentUser.id,
            `${currentUser.firstName} ${currentUser.lastName}`,
            "UPDATE_USER",
            "USER",
            params.id,
            `Updated user ${email}`
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            await requirePermission('MANAGE_USERS');
        } catch (e) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (currentUser.id === params.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
        }

        const user = db.users.find(u => u.id === params.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        db.deleteUser(params.id); // Soft delete

        await logSecurityEvent(
            currentUser.id,
            `${currentUser.firstName} ${currentUser.lastName}`,
            "DELETE_USER",
            "USER",
            params.id,
            `Deactivated user ${user.email}`
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

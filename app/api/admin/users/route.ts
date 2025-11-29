import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, requirePermission, logSecurityEvent } from "@/lib/auth-guard";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
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

        if (!firstName || !lastName || !email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if email already exists
        if (db.users.some(u => u.email === email)) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            isActive,
            createdAt: new Date().toISOString(),
        };

        db.addUser(newUser);

        await logSecurityEvent(
            currentUser.id,
            `${currentUser.firstName} ${currentUser.lastName}`,
            "CREATE_USER",
            "USER",
            newUser.id,
            `Created user ${email} with role ${role}`
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });

    } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

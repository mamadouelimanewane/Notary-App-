import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Permission, hasPermission, Role } from "@/lib/rbac";
import { db } from "@/lib/db";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = db.users.find(u => u.email === session.user.email);
    if (!user || !user.isActive) return null;

    return user;
}

export async function checkPermission(permission: Permission): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    return hasPermission(user.role as Role, permission, user.permissions);
}

export async function requirePermission(permission: Permission) {
    const has = await checkPermission(permission);
    if (!has) {
        throw new Error("Unauthorized: Missing permission " + permission);
    }
}

export async function logSecurityEvent(
    userId: string,
    userName: string,
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: string
) {
    db.addAuditLog({
        id: crypto.randomUUID(),
        userId,
        userName,
        action,
        resourceType,
        resourceId,
        details,
        timestamp: new Date().toISOString()
    });
}

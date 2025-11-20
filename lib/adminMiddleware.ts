import { Session } from "next-auth";

/**
 * Vérifie si l'utilisateur actuel est un administrateur
 * @throws Error si l'utilisateur n'est pas admin
 */
export async function requireAdmin(session: Session | null) {
    if (!session || !session.user) {
        throw new Error('Unauthorized: No session');
    }

    if (session.user.role !== 'ADMIN') {
        throw new Error('Forbidden: Admin access required');
    }

    return session.user;
}

/**
 * Vérifie si l'utilisateur a le rôle spécifié
 */
export function hasRole(session: Session | null, role: string): boolean {
    return session?.user?.role === role;
}

/**
 * Vérifie si l'utilisateur a au moins un des rôles spécifiés
 */
export function hasAnyRole(session: Session | null, roles: string[]): boolean {
    return !!session?.user?.role && roles.includes(session.user.role);
}

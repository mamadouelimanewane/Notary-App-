import {
    Role,
    Permission,
    Module,
    PermissionCheck,
    AuditEntry,
    SYSTEM_ROLES,
    DEFAULT_ROLE_PERMISSIONS
} from '@/types/rbac';

/**
 * Service de contrôle d'accès basé sur les rôles (RBAC)
 * Gère les permissions, rôles et audit
 */
export class RBACService {
    private roles: Map<string, Role> = new Map();
    private userRoles: Map<string, string[]> = new Map(); // userId -> roleIds[]
    private auditLog: AuditEntry[] = [];

    constructor() {
        this.initializeSystemRoles();
    }

    /**
     * Initialise les rôles système par défaut
     */
    private initializeSystemRoles() {
        const systemRoles: Role[] = [
            {
                id: SYSTEM_ROLES.SUPER_ADMIN,
                name: 'Super Administrateur',
                description: 'Accès complet à toutes les fonctionnalités',
                level: 1,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.SUPER_ADMIN],
                isSystem: true,
                color: 'from-red-500 to-pink-500',
                icon: 'Shield',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: SYSTEM_ROLES.NOTAIRE,
                name: 'Notaire',
                description: 'Notaire avec droits de signature',
                level: 2,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.NOTAIRE],
                isSystem: true,
                color: 'from-blue-500 to-indigo-500',
                icon: 'Scale',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: SYSTEM_ROLES.CLERC,
                name: 'Clerc',
                description: 'Assistant notarial',
                level: 3,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.CLERC],
                isSystem: true,
                color: 'from-green-500 to-emerald-500',
                icon: 'FileText',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: SYSTEM_ROLES.SECRETAIRE,
                name: 'Secrétaire',
                description: 'Gestion administrative',
                level: 4,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.SECRETAIRE],
                isSystem: true,
                color: 'from-purple-500 to-pink-500',
                icon: 'Users',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: SYSTEM_ROLES.COMPTABLE,
                name: 'Comptable',
                description: 'Gestion financière',
                level: 4,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.COMPTABLE],
                isSystem: true,
                color: 'from-orange-500 to-yellow-500',
                icon: 'Calculator',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: SYSTEM_ROLES.STAGIAIRE,
                name: 'Stagiaire',
                description: 'Accès limité en lecture',
                level: 5,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.STAGIAIRE],
                isSystem: true,
                color: 'from-cyan-500 to-blue-500',
                icon: 'GraduationCap',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: SYSTEM_ROLES.VIEWER,
                name: 'Observateur',
                description: 'Lecture seule',
                level: 6,
                permissions: DEFAULT_ROLE_PERMISSIONS[SYSTEM_ROLES.VIEWER],
                isSystem: true,
                color: 'from-gray-500 to-slate-500',
                icon: 'Eye',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        systemRoles.forEach(role => {
            this.roles.set(role.id, role);
        });
    }

    /**
     * Vérifie si un utilisateur a une permission spécifique
     */
    can(check: PermissionCheck): boolean {
        const userRoleIds = this.userRoles.get(check.userId) || [];

        if (userRoleIds.length === 0) {
            return false;
        }

        // Vérifie chaque rôle de l'utilisateur
        for (const roleId of userRoleIds) {
            const role = this.roles.get(roleId);
            if (!role) continue;

            // Trouve les permissions pour le module
            const modulePermissions = role.permissions.find(p => p.module === check.module);
            if (!modulePermissions) continue;

            // Vérifie si la permission est accordée
            if (modulePermissions.permissions.includes(check.permission)) {
                // Vérifie les conditions supplémentaires
                if (modulePermissions.conditions) {
                    // TODO: Implémenter la vérification des conditions
                    // (ownOnly, teamOnly, maxAmount, etc.)
                }
                return true;
            }
        }

        return false;
    }

    /**
     * Vérifie si un utilisateur a TOUTES les permissions spécifiées
     */
    canAll(userId: string, module: Module, permissions: Permission[]): boolean {
        return permissions.every(permission =>
            this.can({ userId, module, permission })
        );
    }

    /**
     * Vérifie si un utilisateur a AU MOINS UNE des permissions spécifiées
     */
    canAny(userId: string, module: Module, permissions: Permission[]): boolean {
        return permissions.some(permission =>
            this.can({ userId, module, permission })
        );
    }

    /**
     * Assigne un rôle à un utilisateur
     */
    assignRole(userId: string, roleId: string): boolean {
        const role = this.roles.get(roleId);
        if (!role) {
            console.error(`Role ${roleId} not found`);
            return false;
        }

        const currentRoles = this.userRoles.get(userId) || [];
        if (!currentRoles.includes(roleId)) {
            this.userRoles.set(userId, [...currentRoles, roleId]);

            this.logAudit({
                id: this.generateId(),
                userId: 'system',
                userName: 'System',
                action: 'assign_role',
                module: 'admin',
                resourceType: 'user_role',
                resourceId: userId,
                details: { roleId, roleName: role.name },
                timestamp: new Date().toISOString()
            });
        }

        return true;
    }

    /**
     * Retire un rôle à un utilisateur
     */
    removeRole(userId: string, roleId: string): boolean {
        const currentRoles = this.userRoles.get(userId) || [];
        const newRoles = currentRoles.filter(r => r !== roleId);

        if (newRoles.length !== currentRoles.length) {
            this.userRoles.set(userId, newRoles);

            this.logAudit({
                id: this.generateId(),
                userId: 'system',
                userName: 'System',
                action: 'remove_role',
                module: 'admin',
                resourceType: 'user_role',
                resourceId: userId,
                details: { roleId },
                timestamp: new Date().toISOString()
            });

            return true;
        }

        return false;
    }

    /**
     * Récupère tous les rôles d'un utilisateur
     */
    getUserRoles(userId: string): Role[] {
        const roleIds = this.userRoles.get(userId) || [];
        return roleIds
            .map(id => this.roles.get(id))
            .filter((role): role is Role => role !== undefined);
    }

    /**
     * Récupère toutes les permissions d'un utilisateur pour un module
     */
    getUserPermissions(userId: string, module: Module): Permission[] {
        const roles = this.getUserRoles(userId);
        const permissions = new Set<Permission>();

        roles.forEach(role => {
            const modulePermissions = role.permissions.find(p => p.module === module);
            if (modulePermissions) {
                modulePermissions.permissions.forEach(p => permissions.add(p));
            }
        });

        return Array.from(permissions);
    }

    /**
     * Crée un nouveau rôle personnalisé
     */
    createRole(role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role {
        const newRole: Role = {
            ...role,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.roles.set(newRole.id, newRole);

        this.logAudit({
            id: this.generateId(),
            userId: 'system',
            userName: 'System',
            action: 'create',
            module: 'admin',
            resourceType: 'role',
            resourceId: newRole.id,
            details: { roleName: newRole.name },
            timestamp: new Date().toISOString()
        });

        return newRole;
    }

    /**
     * Met à jour un rôle
     */
    updateRole(roleId: string, updates: Partial<Role>): Role | null {
        const role = this.roles.get(roleId);
        if (!role) return null;

        if (role.isSystem) {
            console.error('Cannot update system role');
            return null;
        }

        const updatedRole: Role = {
            ...role,
            ...updates,
            id: role.id,
            isSystem: role.isSystem,
            updatedAt: new Date().toISOString()
        };

        this.roles.set(roleId, updatedRole);

        this.logAudit({
            id: this.generateId(),
            userId: 'system',
            userName: 'System',
            action: 'update',
            module: 'admin',
            resourceType: 'role',
            resourceId: roleId,
            details: updates,
            timestamp: new Date().toISOString()
        });

        return updatedRole;
    }

    /**
     * Supprime un rôle personnalisé
     */
    deleteRole(roleId: string): boolean {
        const role = this.roles.get(roleId);
        if (!role) return false;

        if (role.isSystem) {
            console.error('Cannot delete system role');
            return false;
        }

        this.roles.delete(roleId);

        // Retire le rôle de tous les utilisateurs
        this.userRoles.forEach((roles, userId) => {
            const newRoles = roles.filter(r => r !== roleId);
            if (newRoles.length !== roles.length) {
                this.userRoles.set(userId, newRoles);
            }
        });

        this.logAudit({
            id: this.generateId(),
            userId: 'system',
            userName: 'System',
            action: 'delete',
            module: 'admin',
            resourceType: 'role',
            resourceId: roleId,
            details: { roleName: role.name },
            timestamp: new Date().toISOString()
        });

        return true;
    }

    /**
     * Récupère tous les rôles
     */
    getAllRoles(): Role[] {
        return Array.from(this.roles.values());
    }

    /**
     * Récupère un rôle par ID
     */
    getRole(roleId: string): Role | undefined {
        return this.roles.get(roleId);
    }

    /**
     * Enregistre une action dans l'audit log
     */
    logAudit(entry: AuditEntry): void {
        this.auditLog.push(entry);
        console.log('🔍 Audit:', entry);
    }

    /**
     * Récupère l'historique d'audit
     */
    getAuditLog(filters?: {
        userId?: string;
        module?: Module;
        action?: string;
        startDate?: string;
        endDate?: string;
    }): AuditEntry[] {
        let logs = this.auditLog;

        if (filters) {
            if (filters.userId) {
                logs = logs.filter(l => l.userId === filters.userId);
            }
            if (filters.module) {
                logs = logs.filter(l => l.module === filters.module);
            }
            if (filters.action) {
                logs = logs.filter(l => l.action === filters.action);
            }
            if (filters.startDate) {
                logs = logs.filter(l => l.timestamp >= filters.startDate!);
            }
            if (filters.endDate) {
                logs = logs.filter(l => l.timestamp <= filters.endDate!);
            }
        }

        return logs.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    // Utilitaires
    private generateId(): string {
        return `rbac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Instance singleton
export const rbacService = new RBACService();

// Helper pour vérifier les permissions dans les composants
export function usePermission(userId: string, module: Module, permission: Permission): boolean {
    return rbacService.can({ userId, module, permission });
}

// Helper pour vérifier plusieurs permissions
export function usePermissions(userId: string, module: Module, permissions: Permission[]): boolean {
    return rbacService.canAll(userId, module, permissions);
}

// Types pour le système RBAC (Role-Based Access Control)

export type Permission =
    | 'read'
    | 'create'
    | 'update'
    | 'delete'
    | 'export'
    | 'import'
    | 'approve'
    | 'sign';

export type Module =
    | 'dashboard'
    | 'clients'
    | 'dossiers'
    | 'actes'
    | 'templates'
    | 'agenda'
    | 'comptabilite'
    | 'tresorerie'
    | 'facturation'
    | 'rapports'
    | 'formalites'
    | 'archives'
    | 'recherche-juridique'
    | 'crm'
    | 'immobilier'
    | 'succession'
    | 'admin'
    | 'settings';

export interface RolePermission {
    module: Module;
    permissions: Permission[];
    conditions?: {
        ownOnly?: boolean; // Seulement ses propres données
        teamOnly?: boolean; // Seulement son équipe
        maxAmount?: number; // Montant maximum (pour finances)
        requireApproval?: boolean; // Nécessite approbation
    };
}

export interface Role {
    id: string;
    name: string;
    description: string;
    level: number; // Hiérarchie: 1=Admin, 2=Manager, 3=User, etc.
    permissions: RolePermission[];
    isSystem: boolean; // Rôle système non modifiable
    color: string; // Couleur pour l'UI
    icon: string; // Icône lucide-react
    createdAt: string;
    updatedAt: string;
}

export interface UserRole {
    userId: string;
    roleId: string;
    assignedBy: string;
    assignedAt: string;
    expiresAt?: string; // Rôle temporaire
}

export interface Team {
    id: string;
    name: string;
    description: string;
    leaderId: string; // Chef d'équipe
    memberIds: string[];
    permissions?: RolePermission[]; // Permissions spécifiques à l'équipe
    createdAt: string;
    updatedAt: string;
}

export interface PermissionCheck {
    userId: string;
    module: Module;
    permission: Permission;
    resourceId?: string; // ID de la ressource (client, dossier, etc.)
}

export interface AuditEntry {
    id: string;
    userId: string;
    userName: string;
    action: string; // 'create', 'read', 'update', 'delete', etc.
    module: Module;
    resourceType: string; // 'client', 'dossier', 'acte', etc.
    resourceId: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
}

// Rôles prédéfinis
export const SYSTEM_ROLES = {
    SUPER_ADMIN: 'super_admin',
    NOTAIRE: 'notaire',
    CLERC: 'clerc',
    SECRETAIRE: 'secretaire',
    COMPTABLE: 'comptable',
    STAGIAIRE: 'stagiaire',
    VIEWER: 'viewer'
} as const;

// Permissions par défaut pour chaque rôle système
export const DEFAULT_ROLE_PERMISSIONS: Record<string, RolePermission[]> = {
    [SYSTEM_ROLES.SUPER_ADMIN]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'clients',
            permissions: ['read', 'create', 'update', 'delete', 'export', 'import']
        },
        {
            module: 'dossiers',
            permissions: ['read', 'create', 'update', 'delete', 'export', 'approve']
        },
        {
            module: 'actes',
            permissions: ['read', 'create', 'update', 'delete', 'sign', 'export']
        },
        {
            module: 'templates',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'agenda',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'comptabilite',
            permissions: ['read', 'create', 'update', 'delete', 'export', 'approve']
        },
        {
            module: 'tresorerie',
            permissions: ['read', 'create', 'update', 'delete', 'export']
        },
        {
            module: 'facturation',
            permissions: ['read', 'create', 'update', 'delete', 'export']
        },
        {
            module: 'rapports',
            permissions: ['read', 'export']
        },
        {
            module: 'formalites',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'archives',
            permissions: ['read', 'create', 'update', 'delete', 'export']
        },
        {
            module: 'recherche-juridique',
            permissions: ['read']
        },
        {
            module: 'crm',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'immobilier',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'succession',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'admin',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'settings',
            permissions: ['read', 'update']
        }
    ],

    [SYSTEM_ROLES.NOTAIRE]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'clients',
            permissions: ['read', 'create', 'update', 'export']
        },
        {
            module: 'dossiers',
            permissions: ['read', 'create', 'update', 'export', 'approve']
        },
        {
            module: 'actes',
            permissions: ['read', 'create', 'update', 'sign', 'export']
        },
        {
            module: 'templates',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'agenda',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'comptabilite',
            permissions: ['read', 'export', 'approve']
        },
        {
            module: 'tresorerie',
            permissions: ['read', 'export']
        },
        {
            module: 'facturation',
            permissions: ['read', 'create', 'update', 'export']
        },
        {
            module: 'rapports',
            permissions: ['read', 'export']
        },
        {
            module: 'formalites',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'archives',
            permissions: ['read', 'export']
        },
        {
            module: 'recherche-juridique',
            permissions: ['read']
        },
        {
            module: 'crm',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'immobilier',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'succession',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'settings',
            permissions: ['read']
        }
    ],

    [SYSTEM_ROLES.CLERC]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'clients',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'dossiers',
            permissions: ['read', 'create', 'update'],
            conditions: { requireApproval: true }
        },
        {
            module: 'actes',
            permissions: ['read', 'create', 'update'],
            conditions: { requireApproval: true }
        },
        {
            module: 'templates',
            permissions: ['read']
        },
        {
            module: 'agenda',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'formalites',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'recherche-juridique',
            permissions: ['read']
        }
    ],

    [SYSTEM_ROLES.SECRETAIRE]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'clients',
            permissions: ['read', 'create', 'update']
        },
        {
            module: 'dossiers',
            permissions: ['read', 'create']
        },
        {
            module: 'actes',
            permissions: ['read']
        },
        {
            module: 'agenda',
            permissions: ['read', 'create', 'update', 'delete']
        },
        {
            module: 'crm',
            permissions: ['read', 'create', 'update']
        }
    ],

    [SYSTEM_ROLES.COMPTABLE]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'clients',
            permissions: ['read']
        },
        {
            module: 'dossiers',
            permissions: ['read']
        },
        {
            module: 'comptabilite',
            permissions: ['read', 'create', 'update', 'export']
        },
        {
            module: 'tresorerie',
            permissions: ['read', 'create', 'update', 'export']
        },
        {
            module: 'facturation',
            permissions: ['read', 'create', 'update', 'export']
        },
        {
            module: 'rapports',
            permissions: ['read', 'export']
        }
    ],

    [SYSTEM_ROLES.STAGIAIRE]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'clients',
            permissions: ['read']
        },
        {
            module: 'dossiers',
            permissions: ['read'],
            conditions: { ownOnly: true }
        },
        {
            module: 'actes',
            permissions: ['read']
        },
        {
            module: 'recherche-juridique',
            permissions: ['read']
        }
    ],

    [SYSTEM_ROLES.VIEWER]: [
        {
            module: 'dashboard',
            permissions: ['read']
        },
        {
            module: 'rapports',
            permissions: ['read']
        }
    ]
};

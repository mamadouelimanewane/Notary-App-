export type Permission =
    | 'VIEW_DASHBOARD'
    | 'MANAGE_CLIENTS'
    | 'MANAGE_DOSSIERS'
    | 'SIGN_ACTES'
    | 'MANAGE_COMPTABILITE'
    | 'MANAGE_TEMPLATES'
    | 'VIEW_ARCHIVES'
    | 'MANAGE_RAPPROCHEMENT'
    | 'USE_LEGAL_SEARCH'
    | 'MANAGE_AGENDA'
    | 'ADMIN_USERS'
    | 'ADMIN_SETTINGS';

export interface RolePermissions {
    role: 'ADMIN' | 'NOTAIRE' | 'CLERC' | 'ASSISTANT';
    label: string;
    description: string;
    permissions: Permission[];
}

export const defaultPermissions: RolePermissions[] = [
    {
        role: 'ADMIN',
        label: 'Administrateur',
        description: 'Accès complet au système',
        permissions: [
            'VIEW_DASHBOARD',
            'MANAGE_CLIENTS',
            'MANAGE_DOSSIERS',
            'SIGN_ACTES',
            'MANAGE_COMPTABILITE',
            'MANAGE_TEMPLATES',
            'VIEW_ARCHIVES',
            'MANAGE_RAPPROCHEMENT',
            'USE_LEGAL_SEARCH',
            'MANAGE_AGENDA',
            'ADMIN_USERS',
            'ADMIN_SETTINGS'
        ]
    },
    {
        role: 'NOTAIRE',
        label: 'Notaire',
        description: 'Gestion complète des actes et dossiers',
        permissions: [
            'VIEW_DASHBOARD',
            'MANAGE_CLIENTS',
            'MANAGE_DOSSIERS',
            'SIGN_ACTES',
            'MANAGE_COMPTABILITE',
            'MANAGE_TEMPLATES',
            'VIEW_ARCHIVES',
            'MANAGE_RAPPROCHEMENT',
            'USE_LEGAL_SEARCH',
            'MANAGE_AGENDA'
        ]
    },
    {
        role: 'CLERC',
        label: 'Clerc',
        description: 'Préparation des dossiers et comptabilité',
        permissions: [
            'VIEW_DASHBOARD',
            'MANAGE_CLIENTS',
            'MANAGE_DOSSIERS',
            'MANAGE_COMPTABILITE',
            'MANAGE_TEMPLATES',
            'VIEW_ARCHIVES',
            'MANAGE_RAPPROCHEMENT',
            'USE_LEGAL_SEARCH',
            'MANAGE_AGENDA'
        ]
    },
    {
        role: 'ASSISTANT',
        label: 'Assistant(e)',
        description: 'Consultation et agenda',
        permissions: [
            'VIEW_DASHBOARD',
            'VIEW_ARCHIVES',
            'USE_LEGAL_SEARCH',
            'MANAGE_AGENDA'
        ]
    }
];

export const permissionLabels: Record<Permission, string> = {
    'VIEW_DASHBOARD': 'Voir le tableau de bord',
    'MANAGE_CLIENTS': 'Gérer les clients',
    'MANAGE_DOSSIERS': 'Gérer les dossiers',
    'SIGN_ACTES': 'Signer les actes',
    'MANAGE_COMPTABILITE': 'Gérer la comptabilité',
    'MANAGE_TEMPLATES': 'Gérer les templates',
    'VIEW_ARCHIVES': 'Consulter les archives',
    'MANAGE_RAPPROCHEMENT': 'Gérer le rapprochement bancaire',
    'USE_LEGAL_SEARCH': 'Utiliser la recherche juridique',
    'MANAGE_AGENDA': 'Gérer l\'agenda',
    'ADMIN_USERS': 'Administrer les utilisateurs',
    'ADMIN_SETTINGS': 'Administrer les paramètres'
};

export function getRolePermissions(role: string): Permission[] {
    const rolePerms = defaultPermissions.find(r => r.role === role);
    return rolePerms?.permissions || [];
}

export function hasPermission(role: string, permission: Permission): boolean {
    const permissions = getRolePermissions(role);
    return permissions.includes(permission);
}

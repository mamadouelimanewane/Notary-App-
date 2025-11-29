export type Role = 'ADMIN' | 'NOTAIRE' | 'CLERC' | 'ASSISTANT' | 'COMPTABLE' | 'SECRETAIRE';

export type Permission =
    // Dossiers
    | 'VIEW_DOSSIER'
    | 'CREATE_DOSSIER'
    | 'EDIT_DOSSIER'
    | 'DELETE_DOSSIER'
    | 'ARCHIVE_DOSSIER'

    // Actes
    | 'VIEW_ACTE'
    | 'CREATE_ACTE'
    | 'EDIT_ACTE'
    | 'VALIDATE_ACTE' // Notaire only usually
    | 'SIGN_ACTE'

    // Clients
    | 'VIEW_CLIENT'
    | 'CREATE_CLIENT'
    | 'EDIT_CLIENT'
    | 'DELETE_CLIENT'

    // Comptabilité
    | 'VIEW_ACCOUNTING'
    | 'CREATE_ENTRY'
    | 'VALIDATE_ENTRY'
    | 'VIEW_FINANCIAL_REPORTS'
    | 'MANAGE_BANK_ACCOUNTS'

    // Administration
    | 'MANAGE_USERS'
    | 'MANAGE_ROLES'
    | 'VIEW_AUDIT_LOGS'
    | 'MANAGE_SETTINGS'

    // CRM & Communication
    | 'SEND_MESSAGES'
    | 'VIEW_COMMUNICATIONS'

    // Immobilier
    | 'MANAGE_PROPERTIES';

export const ROLES_PERMISSIONS: Record<Role, Permission[]> = {
    ADMIN: [
        'VIEW_DOSSIER', 'CREATE_DOSSIER', 'EDIT_DOSSIER', 'DELETE_DOSSIER', 'ARCHIVE_DOSSIER',
        'VIEW_ACTE', 'CREATE_ACTE', 'EDIT_ACTE', 'VALIDATE_ACTE', 'SIGN_ACTE',
        'VIEW_CLIENT', 'CREATE_CLIENT', 'EDIT_CLIENT', 'DELETE_CLIENT',
        'VIEW_ACCOUNTING', 'CREATE_ENTRY', 'VALIDATE_ENTRY', 'VIEW_FINANCIAL_REPORTS', 'MANAGE_BANK_ACCOUNTS',
        'MANAGE_USERS', 'MANAGE_ROLES', 'VIEW_AUDIT_LOGS', 'MANAGE_SETTINGS',
        'SEND_MESSAGES', 'VIEW_COMMUNICATIONS',
        'MANAGE_PROPERTIES'
    ],
    NOTAIRE: [
        'VIEW_DOSSIER', 'CREATE_DOSSIER', 'EDIT_DOSSIER', 'ARCHIVE_DOSSIER',
        'VIEW_ACTE', 'CREATE_ACTE', 'EDIT_ACTE', 'VALIDATE_ACTE', 'SIGN_ACTE',
        'VIEW_CLIENT', 'CREATE_CLIENT', 'EDIT_CLIENT',
        'VIEW_ACCOUNTING', 'VIEW_FINANCIAL_REPORTS',
        'SEND_MESSAGES', 'VIEW_COMMUNICATIONS',
        'MANAGE_PROPERTIES'
    ],
    CLERC: [
        'VIEW_DOSSIER', 'CREATE_DOSSIER', 'EDIT_DOSSIER',
        'VIEW_ACTE', 'CREATE_ACTE', 'EDIT_ACTE',
        'VIEW_CLIENT', 'CREATE_CLIENT', 'EDIT_CLIENT',
        'SEND_MESSAGES', 'VIEW_COMMUNICATIONS'
    ],
    ASSISTANT: [
        'VIEW_DOSSIER',
        'VIEW_ACTE',
        'VIEW_CLIENT', 'CREATE_CLIENT', 'EDIT_CLIENT',
        'SEND_MESSAGES', 'VIEW_COMMUNICATIONS'
    ],
    COMPTABLE: [
        'VIEW_DOSSIER',
        'VIEW_CLIENT',
        'VIEW_ACCOUNTING', 'CREATE_ENTRY', 'VALIDATE_ENTRY', 'VIEW_FINANCIAL_REPORTS', 'MANAGE_BANK_ACCOUNTS'
    ],
    SECRETAIRE: [
        'VIEW_CLIENT', 'CREATE_CLIENT', 'EDIT_CLIENT',
        'SEND_MESSAGES', 'VIEW_COMMUNICATIONS'
    ]
};

export function hasPermission(userRole: Role, permission: Permission, customPermissions?: Permission[]): boolean {
    if (customPermissions && customPermissions.includes(permission)) {
        return true;
    }
    return ROLES_PERMISSIONS[userRole]?.includes(permission) || false;
}

export const ROLE_LABELS: Record<Role, string> = {
    ADMIN: 'Administrateur Système',
    NOTAIRE: 'Notaire Associé/Salarié',
    CLERC: 'Clerc de Notaire',
    ASSISTANT: 'Assistant(e) Juridique',
    COMPTABLE: 'Comptable Taxateur',
    SECRETAIRE: 'Secrétaire / Accueil'
};

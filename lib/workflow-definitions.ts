import { User, Acte } from './types';

export type WorkflowStatus = 'BROUILLON' | 'EN_REVISION' | 'VALIDE' | 'SIGNE' | 'ENREGISTRE' | 'ARCHIVE';

export interface WorkflowAction {
    id: string;
    label: string;
    toStatus: WorkflowStatus;
    requiredRole: User['role'][];
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    icon?: string;
}

export const WORKFLOW_ACTIONS: Record<string, WorkflowAction> = {
    SUBMIT_REVIEW: {
        id: 'submit_review',
        label: 'Soumettre pour révision',
        toStatus: 'EN_REVISION',
        requiredRole: ['ASSISTANT', 'CLERC', 'NOTAIRE'],
        variant: 'default',
        icon: 'Send'
    },
    VALIDATE: {
        id: 'validate',
        label: 'Valider l\'acte',
        toStatus: 'VALIDE',
        requiredRole: ['CLERC', 'NOTAIRE'],
        variant: 'default',
        icon: 'CheckCircle'
    },
    REJECT: {
        id: 'reject',
        label: 'Demander des corrections',
        toStatus: 'BROUILLON',
        requiredRole: ['CLERC', 'NOTAIRE'],
        variant: 'destructive',
        icon: 'AlertCircle'
    },
    SIGN: {
        id: 'sign',
        label: 'Signer l\'acte',
        toStatus: 'SIGNE',
        requiredRole: ['NOTAIRE'],
        variant: 'default',
        icon: 'PenTool'
    },
    REGISTER: {
        id: 'register',
        label: 'Enregistrer (Formalités)',
        toStatus: 'ENREGISTRE',
        requiredRole: ['CLERC', 'COMPTABLE'],
        variant: 'default',
        icon: 'Stamp'
    },
    ARCHIVE: {
        id: 'archive',
        label: 'Archiver le dossier',
        toStatus: 'ARCHIVE',
        requiredRole: ['NOTAIRE', 'CLERC'],
        variant: 'secondary',
        icon: 'Archive'
    }
};

export function getAvailableWorkflowActions(user: User, acte: Acte): WorkflowAction[] {
    const actions: WorkflowAction[] = [];

    // Define transitions based on current status
    switch (acte.status) {
        case 'BROUILLON':
            actions.push(WORKFLOW_ACTIONS.SUBMIT_REVIEW);
            // Notaries can directly validate their own drafts
            if (user.role === 'NOTAIRE') {
                actions.push(WORKFLOW_ACTIONS.VALIDATE);
            }
            break;
        case 'EN_REVISION':
            actions.push(WORKFLOW_ACTIONS.VALIDATE);
            actions.push(WORKFLOW_ACTIONS.REJECT);
            break;
        case 'VALIDE':
            actions.push(WORKFLOW_ACTIONS.SIGN);
            actions.push(WORKFLOW_ACTIONS.REJECT); // Can still send back for corrections
            break;
        case 'SIGNE':
            actions.push(WORKFLOW_ACTIONS.REGISTER);
            break;
        case 'ENREGISTRE':
            actions.push(WORKFLOW_ACTIONS.ARCHIVE);
            break;
        case 'ARCHIVE':
            // No further actions for now
            break;
    }

    // Filter by user role
    return actions.filter(action =>
        action.requiredRole.includes(user.role) || user.role === 'ADMIN'
    );
}

export function canPerformWorkflowAction(user: User, action: WorkflowAction): boolean {
    return action.requiredRole.includes(user.role) || user.role === 'ADMIN';
}

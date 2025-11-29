// Moteur de Workflow Automatisé
// Gestion des workflows par type d'acte avec étapes automatiques

import { ActeType } from './acte-types';

export type WorkflowStepStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type WorkflowStepType = 'manual' | 'automatic' | 'notification' | 'validation';

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    type: WorkflowStepType;
    status: WorkflowStepStatus;
    assignedTo?: string; // User ID
    dueDate?: Date;
    completedAt?: Date;
    completedBy?: string;
    dependencies?: string[]; // IDs of steps that must be completed first
    autoAction?: () => Promise<void>; // For automatic steps
    estimatedDuration?: number; // in hours
    priority: 'low' | 'medium' | 'high' | 'urgent';
    documents?: string[]; // Required documents
    notes?: string;
}

export interface Workflow {
    id: string;
    dossierId: string;
    acteType: ActeType;
    name: string;
    description: string;
    steps: WorkflowStep[];
    currentStepIndex: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    estimatedCompletionDate?: Date;
}

// Workflow par défaut pour les actes sans template spécifique
function getDefaultWorkflow(): WorkflowStep[] {
    return [
        {
            id: 'default_1',
            name: 'Réception de la demande',
            description: 'Enregistrement de la demande',
            type: 'automatic',
            status: 'pending',
            priority: 'high',
            estimatedDuration: 0.5
        },
        {
            id: 'default_2',
            name: 'Collecte des pièces',
            description: 'Demande et vérification des documents',
            type: 'manual',
            status: 'pending',
            priority: 'high',
            estimatedDuration: 2,
            dependencies: ['default_1']
        },
        {
            id: 'default_3',
            name: 'Rédaction de l\'acte',
            description: 'Rédaction du projet d\'acte',
            type: 'manual',
            status: 'pending',
            priority: 'high',
            estimatedDuration: 4,
            dependencies: ['default_2']
        },
        {
            id: 'default_4',
            name: 'Validation',
            description: 'Validation par les parties',
            type: 'validation',
            status: 'pending',
            priority: 'high',
            estimatedDuration: 24,
            dependencies: ['default_3']
        },
        {
            id: 'default_5',
            name: 'Signature',
            description: "Signature de l'acte",
            type: 'manual',
            status: 'pending',
            priority: 'urgent',
            estimatedDuration: 1.5,
            dependencies: ['default_4']
        },
        {
            id: 'default_6',
            name: 'Formalités',
            description: 'Accomplissement des formalités',
            type: 'manual',
            status: 'pending',
            priority: 'high',
            estimatedDuration: 8,
            dependencies: ['default_5']
        },
        {
            id: 'default_7',
            name: 'Archivage',
            description: 'Archivage du dossier',
            type: 'automatic',
            status: 'pending',
            priority: 'low',
            estimatedDuration: 0.5,
            dependencies: ['default_6']
        }
    ];
}

// Définition des workflows par type d'acte
// Note: Pour les types d'actes non définis, le workflow par défaut sera utilisé
export const WORKFLOW_TEMPLATES: Partial<Record<ActeType, WorkflowStep[]>> = {
    // Workflow générique - utilisé comme fallback
};

// Calcul de la date estimée de fin
function calculateEstimatedCompletion(steps: WorkflowStep[]): Date {
    const totalHours = steps.reduce((sum, step) => sum + (step.estimatedDuration || 0), 0);
    const workingDaysNeeded = Math.ceil(totalHours / 7); // 7h par jour

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + workingDaysNeeded);

    return completionDate;
}

// Fonction pour créer un workflow à partir d'un template
export function createWorkflowFromTemplate(
    dossierId: string,
    acteType: ActeType
): Workflow {
    const template = WORKFLOW_TEMPLATES[acteType] || getDefaultWorkflow();

    return {
        id: `workflow_${dossierId}_${Date.now()}`,
        dossierId,
        acteType,
        name: `Workflow ${acteType}`,
        description: `Workflow automatisé pour ${acteType}`,
        steps: template.map(step => ({ ...step })), // Clone des étapes
        currentStepIndex: 0,
        status: 'not_started',
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedCompletionDate: calculateEstimatedCompletion(template)
    };
}

// Fonctions de gestion du workflow
export class WorkflowManager {
    // Démarrer un workflow
    static startWorkflow(workflow: Workflow): Workflow {
        workflow.status = 'in_progress';
        workflow.updatedAt = new Date();

        // Démarrer la première étape
        if (workflow.steps.length > 0) {
            workflow.steps[0].status = 'in_progress';
        }

        return workflow;
    }

    // Compléter une étape
    static completeStep(
        workflow: Workflow,
        stepId: string,
        completedBy: string
    ): Workflow {
        const stepIndex = workflow.steps.findIndex(s => s.id === stepId);

        if (stepIndex === -1) {
            throw new Error(`Step ${stepId} not found`);
        }

        const step = workflow.steps[stepIndex];
        step.status = 'completed';
        step.completedAt = new Date();
        step.completedBy = completedBy;

        // Démarrer les étapes suivantes si leurs dépendances sont satisfaites
        this.startNextSteps(workflow);

        // Vérifier si le workflow est terminé
        if (this.isWorkflowCompleted(workflow)) {
            workflow.status = 'completed';
            workflow.completedAt = new Date();
        }

        workflow.updatedAt = new Date();
        return workflow;
    }

    // Démarrer les prochaines étapes
    private static startNextSteps(workflow: Workflow): void {
        workflow.steps.forEach(step => {
            if (step.status === 'pending' && this.areDependenciesMet(workflow, step)) {
                step.status = 'in_progress';

                // Exécuter les actions automatiques
                if (step.type === 'automatic' && step.autoAction) {
                    step.autoAction().catch(error => {
                        console.error(`Error in auto action for step ${step.id}:`, error);
                        step.status = 'blocked';
                    });
                }
            }
        });
    }

    // Vérifier si les dépendances sont satisfaites
    private static areDependenciesMet(workflow: Workflow, step: WorkflowStep): boolean {
        if (!step.dependencies || step.dependencies.length === 0) {
            return true;
        }

        return step.dependencies.every(depId => {
            const depStep = workflow.steps.find(s => s.id === depId);
            return depStep && depStep.status === 'completed';
        });
    }

    // Vérifier si le workflow est terminé
    private static isWorkflowCompleted(workflow: Workflow): boolean {
        return workflow.steps.every(step => step.status === 'completed');
    }

    // Obtenir la progression du workflow
    static getProgress(workflow: Workflow): number {
        const completedSteps = workflow.steps.filter(s => s.status === 'completed').length;
        return Math.round((completedSteps / workflow.steps.length) * 100);
    }

    // Obtenir l'étape courante
    static getCurrentStep(workflow: Workflow): WorkflowStep | null {
        return workflow.steps.find(s => s.status === 'in_progress') || null;
    }

    // Obtenir les prochaines étapes
    static getNextSteps(workflow: Workflow): WorkflowStep[] {
        return workflow.steps.filter(s => s.status === 'pending' && this.areDependenciesMet(workflow, s));
    }

    // Assigner une étape à un utilisateur
    static assignStep(workflow: Workflow, stepId: string, userId: string): Workflow {
        const step = workflow.steps.find(s => s.id === stepId);
        if (step) {
            step.assignedTo = userId;
            workflow.updatedAt = new Date();
        }
        return workflow;
    }

    // Bloquer une étape
    static blockStep(workflow: Workflow, stepId: string, reason: string): Workflow {
        const step = workflow.steps.find(s => s.id === stepId);
        if (step) {
            step.status = 'blocked';
            step.notes = reason;
            workflow.updatedAt = new Date();
        }
        return workflow;
    }

    // Annuler le workflow
    static cancelWorkflow(workflow: Workflow, reason: string): Workflow {
        workflow.status = 'cancelled';
        workflow.steps.forEach(step => {
            if (step.status !== 'completed') {
                step.status = 'cancelled';
                step.notes = reason;
            }
        });
        workflow.updatedAt = new Date();
        return workflow;
    }
}

// Storage temporaire en mémoire pour les workflows (en production, utiliser une base de données)
const workflowStorage: Map<string, Workflow> = new Map();

// Fonction helper pour créer un workflow pour un dossier
export function createWorkflowForDossier(dossierId: string, acteType: ActeType): Workflow {
    const workflow = createWorkflowFromTemplate(dossierId, acteType);
    workflowStorage.set(dossierId, workflow);
    return workflow;
}

// Fonction helper pour récupérer un workflow par dossier
export function getWorkflowByDossier(dossierId: string): Workflow | null {
    return workflowStorage.get(dossierId) || null;
}

// Fonction helper pour mettre à jour un workflow
export function updateWorkflow(workflow: Workflow): void {
    workflowStorage.set(workflow.dossierId, workflow);
}

// Fonction helper pour supprimer un workflow
export function deleteWorkflow(dossierId: string): void {
    workflowStorage.delete(dossierId);
}

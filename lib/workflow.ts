import { db } from './db';
import { Acte, User } from './types';
import {
    WorkflowStatus,
    WorkflowAction,
    WORKFLOW_ACTIONS,
    getAvailableWorkflowActions
} from './workflow-definitions';
import { v4 as uuidv4 } from 'uuid';
import { BlockchainService } from './blockchain';

export class WorkflowService {

    static async getAvailableActions(user: User, acte: Acte): Promise<WorkflowAction[]> {
        return getAvailableWorkflowActions(user, acte);
    }

    static async performAction(
        user: User,
        acteId: string,
        actionId: string,
        comment?: string
    ): Promise<Acte> {
        const acte = db.getActe(acteId);
        if (!acte) {
            throw new Error('Acte non trouvé');
        }

        const action = Object.values(WORKFLOW_ACTIONS).find(a => a.id === actionId);
        if (!action) {
            throw new Error('Action non valide');
        }

        // Verify permissions
        if (!action.requiredRole.includes(user.role) && user.role !== 'ADMIN') {
            throw new Error('Non autorisé');
        }

        // Verify transition validity
        const availableActions = getAvailableWorkflowActions(user, acte);
        if (!availableActions.find(a => a.id === actionId)) {
            throw new Error('Action impossible pour le statut actuel');
        }

        const oldStatus = acte.status;
        const newStatus = action.toStatus;

        // Update Acte
        const updates: any = {
            status: newStatus,
            updatedAt: new Date().toISOString()
        };

        // Add to history
        const historyEntry = {
            id: uuidv4(),
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
            action: action.label,
            oldStatus,
            newStatus,
            timestamp: new Date().toISOString()
        };

        const history = acte.history || [];
        history.push(historyEntry);
        updates.history = history;

        // Add comment if present
        if (comment) {
            const commentEntry = {
                id: uuidv4(),
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                content: comment,
                createdAt: new Date().toISOString()
            };
            const comments = acte.comments || [];
            comments.push(commentEntry);
            updates.comments = comments;
        }

        // Blockchain recording for specific states
        if (['VALIDE', 'SIGNE', 'ENREGISTRE'].includes(newStatus)) {
            const blockData = {
                acteId: acte.id,
                action: actionId,
                status: newStatus,
                timestamp: new Date().toISOString(),
                performer: user.id
            };

            const newBlock = await BlockchainService.createBlock(blockData);
            const blockchain = acte.blockchain || [];
            blockchain.push(newBlock);
            updates.blockchain = blockchain;
        }

        const updatedActe = db.updateActe(acte.id, updates);
        if (!updatedActe) throw new Error('Erreur lors de la mise à jour');

        return updatedActe;
    }
}

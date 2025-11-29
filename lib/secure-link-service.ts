import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export interface SecureLink {
    id: string;
    dossierId: string;
    token: string;
    expiresAt: string;
    createdAt: string;
    accessCount: number;
    maxAccess?: number;
}

export class SecureLinkService {
    private static instance: SecureLinkService;

    private constructor() { }

    public static getInstance(): SecureLinkService {
        if (!SecureLinkService.instance) {
            SecureLinkService.instance = new SecureLinkService();
        }
        return SecureLinkService.instance;
    }

    /**
     * Generate a secure link for timeline sharing
     * @param dossierId - ID of the dossier
     * @param expiresInDays - Number of days until expiration (default: 30)
     * @param maxAccess - Maximum number of accesses (optional)
     */
    public generateLink(dossierId: string, expiresInDays: number = 30, maxAccess?: number): SecureLink {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        const link: SecureLink = {
            id: uuidv4(),
            dossierId,
            token,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString(),
            accessCount: 0,
            maxAccess
        };

        // Store in database (you'll need to add secureLinks array to DatabaseSchema)
        if (!(db as any).secureLinks) {
            (db as any).secureLinks = [];
        }
        (db as any).secureLinks.push(link);
        db.save();

        return link;
    }

    /**
     * Validate a secure link token
     * @param token - The secure token
     * @returns The link if valid, null otherwise
     */
    public validateLink(token: string): SecureLink | null {
        const links = (db as any).secureLinks || [];
        const link = links.find((l: SecureLink) => l.token === token);

        if (!link) return null;

        // Check expiration
        if (new Date(link.expiresAt) < new Date()) {
            return null;
        }

        // Check max access
        if (link.maxAccess && link.accessCount >= link.maxAccess) {
            return null;
        }

        return link;
    }

    /**
     * Record an access to a secure link
     * @param token - The secure token
     */
    public recordAccess(token: string): void {
        const links = (db as any).secureLinks || [];
        const link = links.find((l: SecureLink) => l.token === token);

        if (link) {
            link.accessCount++;
            db.save();
        }
    }

    /**
     * Revoke a secure link
     * @param token - The secure token
     */
    public revokeLink(token: string): boolean {
        const links = (db as any).secureLinks || [];
        const index = links.findIndex((l: SecureLink) => l.token === token);

        if (index !== -1) {
            links.splice(index, 1);
            db.save();
            return true;
        }

        return false;
    }

    /**
     * Get all links for a dossier
     * @param dossierId - ID of the dossier
     */
    public getLinksByDossier(dossierId: string): SecureLink[] {
        const links = (db as any).secureLinks || [];
        return links.filter((l: SecureLink) => l.dossierId === dossierId);
    }
}

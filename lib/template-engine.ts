// Template Engine - Variable replacement and validation

export interface TemplateData {
    client?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: string;
        city?: string;
        zipCode?: string;
    };
    dossier?: {
        ref?: string;
        title?: string;
        type?: string;
        status?: string;
    };
    vendeur?: {
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        zipCode?: string;
    };
    acquereur?: {
        firstName?: string;
        lastName?: string;
        address?: string;
        city?: string;
        zipCode?: string;
    };
    bien?: {
        address?: string;
        city?: string;
        zipCode?: string;
        price?: number;
        description?: string;
    };
    [key: string]: any; // Allow custom fields
}

/**
 * Parse template and replace variables with actual data
 * Variables use syntax: {{object.property}}
 */
export function parseTemplate(html: string, data: TemplateData): string {
    let result = html;

    // Replace all {{variable}} patterns
    const regex = /\{\{([^}]+)\}\}/g;

    result = result.replace(regex, (match, path) => {
        // Clean up the path
        const cleanPath = path.trim();

        // Split path into parts (e.g., "client.firstName" becomes ["client", "firstName"])
        const parts = cleanPath.split('.');

        // Navigate through the data object
        let value: any = data;
        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            } else {
                // Variable not found, return placeholder
                return `[${cleanPath}]`;
            }
        }

        // Convert value to string
        if (value === null || value === undefined) {
            return `[${cleanPath}]`;
        }

        return String(value);
    });

    return result;
}

/**
 * Extract all variables from a template
 * Returns array of variable paths like ["client.firstName", "dossier.ref"]
 */
export function extractVariables(html: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
        const cleanPath = match[1].trim();
        if (!variables.includes(cleanPath)) {
            variables.push(cleanPath);
        }
    }

    return variables.sort();
}

/**
 * Validate template syntax
 * Checks for balanced braces and valid variable names
 */
export function validateTemplate(html: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for unmatched braces
    const openCount = (html.match(/\{\{/g) || []).length;
    const closeCount = (html.match(/\}\}/g) || []).length;

    if (openCount !== closeCount) {
        errors.push(`Accolades non équilibrées: ${openCount} ouvertures, ${closeCount} fermetures`);
    }

    // Check for nested braces (not supported)
    if (/\{\{[^}]*\{\{/.test(html)) {
        errors.push("Accolades imbriquées non supportées");
    }

    // Check for empty variables
    if (/\{\{\s*\}\}/.test(html)) {
        errors.push("Variables vides détectées");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Get sample data for template preview
 */
export function getSampleData(): TemplateData {
    return {
        client: {
            firstName: "Jean",
            lastName: "Martin",
            email: "jean.martin@example.com",
            phone: "0601020304",
            address: "10 Rue de la Paix",
            city: "Paris",
            zipCode: "75001"
        },
        dossier: {
            ref: "2025-001",
            title: "Vente Appartement Paris",
            type: "VENTE",
            status: "EN_COURS"
        },
        vendeur: {
            firstName: "Pierre",
            lastName: "Dupont",
            address: "5 Avenue des Champs",
            city: "Paris",
            zipCode: "75008"
        },
        acquereur: {
            firstName: "Jean",
            lastName: "Martin",
            address: "10 Rue de la Paix",
            city: "Paris",
            zipCode: "75001"
        },
        bien: {
            address: "15 Boulevard Haussmann",
            city: "Paris",
            zipCode: "75009",
            price: 450000,
            description: "Appartement T3, 75m², 2ème étage avec ascenseur"
        },
        date: new Date().toLocaleDateString('fr-FR'),
        prix: "450 000 €"
    };
}

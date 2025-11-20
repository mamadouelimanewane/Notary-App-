/**
 * Utilitaires pour l'impression de documents
 */

export interface PrintSettings {
    title?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    orientation?: 'portrait' | 'landscape';
}

/**
 * Déclenche l'impression du document
 */
export const triggerPrint = () => {
    window.print();
};

/**
 * Formate la date et l'heure pour l'impression
 */
export const formatPrintDateTime = (date: Date = new Date()): string => {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'full',
        timeStyle: 'short',
    }).format(date);
};

/**
 * Formate une date pour l'impression
 */
export const formatPrintDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'long',
    }).format(d);
};

/**
 * Prépare le document pour l'impression
 */
export const preparePrintDocument = (settings: PrintSettings = {}) => {
    // Définir le titre du document
    if (settings.title) {
        document.title = settings.title;
    }

    // Ajouter une classe temporaire pour l'impression
    document.body.classList.add('printing');

    // Nettoyer après impression
    const cleanup = () => {
        document.body.classList.remove('printing');
        window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
};

/**
 * Génère un en-tête d'impression
 */
export const generatePrintHeader = (title: string, subtitle?: string) => {
    return {
        title,
        subtitle,
        date: formatPrintDateTime(),
    };
};
